const assert = require('node:assert/strict')
const { writeFile } = require('node:fs/promises')
const { normalizeResume, resumeLatex, compileResume } = require('./resume-pdf')

const data = {
  personalInfo: { fullName: 'Alex Morgan', email: 'alex@example.com', phone: '(555) 123-4567', location: 'Boston, MA', website: 'alexmorgan.dev' },
  professionalSummary: { summary: 'Computer science student building thoughtful, accessible web applications. Experienced in collaborative development, data modeling, and turning complex problems into simple tools.' },
  education: [{ id: 'school', schoolName: 'Example University', location: 'Boston, MA', degreeType: 'B.S.', major: 'Computer Science', gradYear: '2027', gpa: '3.8' }],
  workExperience: [
    { id: 'job', companyName: 'Research & Development', role: 'Software Engineering Intern', location: 'Boston, MA', text: 'Built a reporting tool used by 20 team members.\nReduced manual data entry by 30% with automated checks.' },
    { id: 'excluded', companyName: 'DO NOT INCLUDE' }
  ],
  projects: [{ id: 'project', name: 'Resume Builder', date: '2026-10', description: 'Created a React and MongoDB application for reusable career profiles.\nDeveloped an automatic PDF preview with a consistent resume template.' }],
  activities: [{ id: 'activity', name: 'Computing Club', description: 'Organized weekly coding workshops and mentored new members.' }],
  skills: [{ id: 'skill', skill: 'JavaScript, React, Node.js, MongoDB, Git' }],
  accomplishments: [{ id: 'award', name: 'Dean’s List', date: '2025–2026', description: 'Recognized for academic achievement.' }]
}
const selection = {
  personalInfo: Object.keys(data.personalInfo), professionalSummary: true,
  ...Object.fromEntries(['education', 'workExperience', 'projects', 'activities', 'skills', 'accomplishments'].map(key => [key, [data[key][0].id]]))
}

async function test() {
  const { selectContent } = await import('./client/src/resume-data.js')
  const selected = normalizeResume(selectContent(data, selection))
  const source = resumeLatex(selected)
  assert.ok(!source.includes('DO NOT INCLUDE'))
  assert.ok(source.includes('Research \\& Development'))
  assert.ok(source.includes('30\\%'))
  assert.throws(() => normalizeResume({ projects: 'invalid' }))
  assert.ok(source.includes('Oct 2026'))
  const layout = normalizeResume({ ...selected, styles: { fontSize: '9pt', spacing: 'compact', sectionOrder: ['Projects', 'Projects', 'unknown'], hideSections: ['Summary', 'Skills'] } })
  const arranged = resumeLatex(layout)
  assert.ok(arranged.includes('9pt,letterpaper]{extarticle}'))
  assert.ok(arranged.indexOf('\\section*{Projects}') < arranged.indexOf('\\section*{Education}'))
  assert.ok(!arranged.includes('\\section*{Summary}'))
  assert.ok(!arranged.includes('\\section*{Skills}'))
  assert.equal(layout.styles.sectionOrder.length, 7)
  assert.equal((await compileResume(layout)).subarray(0, 5).toString(), '%PDF-')
  const empty = selectContent(data, Object.fromEntries(Object.keys(selection).map(key => [key, key === 'professionalSummary' ? false : []])))
  assert.ok(!resumeLatex(empty).includes('\\section*'))
  const hostile = resumeLatex({ personalInfo: { fullName: '\\input{/etc/passwd} # $ % & _ ~ ^^' } })
  assert.ok(!hostile.includes('\\input{'))
  const pdf = await compileResume(selected)
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  if (process.env.PDF_TEST_OUTPUT) await writeFile(process.env.PDF_TEST_OUTPUT, pdf)
  const long = await compileResume({ ...selected, projects: Array.from({ length: 30 }, () => selected.projects[0]) })
  assert.equal(long.subarray(0, 5).toString(), '%PDF-')
  assert.equal((await compileResume(empty)).subarray(0, 5).toString(), '%PDF-')
  assert.equal((await compileResume({ personalInfo: { fullName: '\\input{/etc/passwd} # $ % & _ ~ ^^' } })).subarray(0, 5).toString(), '%PDF-')
  console.log('Selection, escaping, empty sections, and real PDF compilation passed.')
}

test().catch(error => { console.error(error.message); process.exitCode = 1 })
