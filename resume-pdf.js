const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const { mkdtemp, writeFile, readFile, rm } = require('node:fs/promises')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const bins = ['education', 'workExperience', 'projects', 'activities', 'skills', 'accomplishments']
const personalFields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'website']
const escapes = { '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '$': '\\$', '&': '\\&', '#': '\\#', '%': '\\%', '_': '\\_', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }
const text = value => typeof value === 'string' ? value.trim() : ''
const escape = value => text(value).replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '').replace(/[\\{}$&#%_~^]/g, char => escapes[char]).replace(/\r?\n/g, ' ')
const joinText = values => values.map(text).filter(Boolean).join(' · ')

function normalizeResume(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid resume content.')
  const fields = {
    personalInfo: personalFields, professionalSummary: ['summary'],
    education: ['id', 'schoolName', 'location', 'major', 'minors', 'gpa', 'degreeType', 'gradYear'],
    workExperience: ['id', 'companyName', 'location', 'role', 'text'],
    projects: ['id', 'name', 'description', 'date'], activities: ['id', 'name', 'description'],
    skills: ['id', 'skill'], accomplishments: ['id', 'name', 'description', 'date']
  }
  const clean = (item, keys) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid resume content.')
    return Object.fromEntries(keys.filter(key => item[key] !== undefined).map(key => {
      if (typeof item[key] !== 'string' || item[key].length > 20000) throw new Error('Invalid resume content.')
      return [key, item[key]]
    }))
  }
  return Object.fromEntries(Object.entries(fields).map(([key, keys]) => {
    if (!bins.includes(key)) return [key, clean(data[key] || {}, keys)]
    const items = data[key] || []
    if (!Array.isArray(items) || items.length > 200 || items.some(item => !item || typeof item.id !== 'string' || !item.id)) throw new Error('Invalid resume content.')
    return [key, items.map(item => clean(item, keys))]
  }))
}

function resumeLatex(data) {
  const section = (title, content) => content ? `\\section*{${escape(title)}}\n${content}` : ''
  const paragraph = value => text(value) ? `${escape(value)}\\par\n` : ''
  const bullets = value => text(value) ? `\\begin{itemize}\n${text(value).split(/\r?\n/).filter(line => line.trim()).map(line => `\\item ${escape(line.replace(/^\s*[-•]\s*/, ''))}`).join('\n')}\n\\end{itemize}` : ''
  const entries = (key, format) => (data[key] || []).map(format).filter(Boolean).join('\n')
  const entry = (title, detail, description) => [title, detail, description].some(text) ? `\\needspace{4\\baselineskip}\n${text(title) ? `\\textbf{${escape(title)}}\\par` : ''}\n${paragraph(detail)}${bullets(description)}\\smallskip\n` : ''
  const personal = data.personalInfo || {}
  const content = [
    section('Summary', paragraph(data.professionalSummary?.summary)),
    section('Education', entries('education', item => entry(joinText([item.schoolName, item.location]), joinText([item.degreeType, item.major, item.minors && `Minor: ${item.minors}`, item.gpa && `GPA: ${item.gpa}`, item.gradYear]), ''))),
    section('Experience', entries('workExperience', item => entry(joinText([item.role, item.companyName]), item.location, item.text))),
    section('Projects', entries('projects', item => entry(item.name, item.date, item.description))),
    section('Activities', entries('activities', item => entry(item.name, '', item.description))),
    section('Skills', paragraph(joinText((data.skills || []).map(item => item.skill)))),
    section('Awards & Certifications', entries('accomplishments', item => entry(item.name, item.date, item.description)))
  ].join('\n')
  return String.raw`\documentclass[10pt,letterpaper]{article}
\usepackage[margin=0.65in]{geometry}
\usepackage{fontspec}
\setmainfont{lmroman10-regular.otf}[BoldFont=lmroman10-bold.otf,ItalicFont=lmroman10-italic.otf,BoldItalicFont=lmroman10-bolditalic.otf]
\usepackage{enumitem,titlesec,needspace}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{2pt}
\setlength{\emergencystretch}{3em}
\raggedright
\titleformat{\section}{\large\bfseries}{}{0pt}{}[\titlerule]
\titlespacing*{\section}{0pt}{10pt}{5pt}
\setlist[itemize]{leftmargin=1.2em,nosep,topsep=2pt}
\begin{document}
\begin{center}
${text(personal.fullName) ? String.raw`{\LARGE\bfseries ${escape(personal.fullName)}}\\[5pt]` : ''}
${escape(joinText([personal.email, personal.phone, personal.location]))}\par
${escape(joinText([personal.linkedin, personal.website]))}
\end{center}
${content}
\end{document}
`
}

async function compileResume(data, signal) {
  const source = resumeLatex(data)
  if (source.length > 100000) throw new Error('Resume is too long. Select fewer entries.')
  const directory = await mkdtemp(join(tmpdir(), 'resume-'))
  try {
    await writeFile(join(directory, 'resume.tex'), source)
    await promisify(execFile)(process.env.LATEX_PATH || 'xelatex', ['-no-shell-escape', '-interaction=nonstopmode', '-halt-on-error', 'resume.tex'], {
      cwd: directory, timeout: 20000, maxBuffer: 1024 * 1024, signal,
      env: { ...process.env, openin_any: 'p', openout_any: 'p' }
    })
    return await readFile(join(directory, 'resume.pdf'))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

module.exports = { normalizeResume, resumeLatex, compileResume }
