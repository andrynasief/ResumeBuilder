import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
const PdfPreview = lazy(() => import('../components/PdfPreview'))
import { personalFields, defaultStyles, entries, getSelection, selectContent, mergeContent } from '../resume-data'

async function request(url, options) {
  const response = await fetch(url, options)
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Could not complete the request. Please try again.')
  return result
}

function ResumeBuilder() {
  const [params, setParams] = useSearchParams()
  const resumeId = params.get('id')
  const [data, setData] = useState(null)
  const [selection, setSelection] = useState(null)
  const [name, setName] = useState('Untitled resume')
  const [styles, setStyles] = useState(defaultStyles)
  const [resumes, setResumes] = useState([])
  const [saved, setSaved] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loadedId, setLoadedId] = useState(undefined)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const options = { signal: controller.signal }
        const [library, list, resume] = await Promise.all([
          request('/api/resume', options), request('/api/resumes', options),
          resumeId ? request(`/api/resumes/${resumeId}`, options) : null
        ])
        const content = resume?.content || library
        const choices = getSelection(content)
        const available = resume ? mergeContent(library, content) : library
        const title = resume?.name || 'Untitled resume'
        const customStyles = { ...defaultStyles, ...resume?.content?.styles }

        setData(available)
        setSelection(choices)
        setName(title)
        setStyles(customStyles)
        setResumes(list)
        setSaved(JSON.stringify({ name: title, content: { ...selectContent(available, choices), styles: customStyles } }))
        setLoadedId(resumeId)
        setLoadError('')
        setMessage('')
        setError('')
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error.message)
      }
    }
    load()
    return () => controller.abort()
  }, [resumeId, reload])

  const content = useMemo(() => data && selection ? {
    ...selectContent(data, selection),
    styles
  } : null, [data, selection, styles])
  const signature = JSON.stringify({ name, content })
  const dirty = !!content && signature !== saved
  const loaded = data && loadedId === resumeId
  const count = selection ? Object.values(selection).reduce((total, value) => total + (Array.isArray(value) ? value.length : Number(value)), 0) : 0

  useEffect(() => {
    if (!dirty) return
    const warn = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!content || !count || !loaded) return
    const controller = new AbortController()
    let url
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/resumes/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
          signal: controller.signal
        })
        if (!response.ok) throw new Error((await response.json()).error || 'Could not build the preview.')
        const blob = await response.blob()
        if (controller.signal.aborted) return
        url = URL.createObjectURL(blob)
        setPreview({ url, content })
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message)
      }
    }, 800)
    return () => {
      clearTimeout(timer)
      controller.abort()
      if (url) URL.revokeObjectURL(url)
    }
  }, [content, count, loaded, retry])

  const change = (key, id) => {
    setError('')
    setMessage('')
    setSelection(current => ({ ...current, [key]: current[key].includes(id) ? current[key].filter(value => value !== id) : [...current[key], id] }))
  }
  const edit = (key, field, value, id) => {
    setError('')
    setMessage('')
    setData(current => ({ ...current, [key]: id ? current[key].map(item => item.id === id ? { ...item, [field]: value } : item) : { ...current[key], [field]: value } }))
  }

  const updateStyles = changes => {
    setError('')
    setMessage('')
    setStyles(current => ({ ...current, ...changes }))
  }

  const moveSection = (index, direction) => {
    const order = [...styles.sectionOrder]
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const [section] = order.splice(index, 1)
    order.splice(target, 0, section)
    updateStyles({ sectionOrder: order })
  }

  const canLeave = () => !dirty || window.confirm('Discard unsaved changes to this resume?')
  const open = id => {
    if (!canLeave()) return
    setLoadError('')
    setParams(id ? { id } : {})
    if (id === resumeId) setReload(reload + 1)
  }
  const save = async copy => {
    setSaving(true)
    setMessage('Saving...')
    const title = copy ? `${name.slice(0, 73)} (copy)` : name
    try {
      const result = await request(resumeId && !copy ? `/api/resumes/${resumeId}` : '/api/resumes', {
        method: resumeId && !copy ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title, content })
      })
      setSaved(JSON.stringify({ name: result.name, content }))
      setName(result.name)
      setResumes(current => [result, ...current.filter(item => item._id !== result._id)])
      setMessage('Saved.')
      if (result._id !== resumeId) setParams({ id: result._id })
    } catch (error) { setMessage(error.message) } finally { setSaving(false) }
  }

  const ready = loaded && count > 0 && preview?.content === content

  const renderSectionContent = (key) => {
    if (key === 'Summary') {
      return (
        <section className="section" key={key}>
          <h2>Professional Summary</h2>
          {data.professionalSummary?.summary !== undefined ? <>
            <label className="resume-choice"><input type="checkbox" checked={selection.professionalSummary} onChange={event => { setError(''); setSelection({ ...selection, professionalSummary: event.target.checked }) }} /><span>{data.professionalSummary.summary || 'Summary'}</span></label>
            {selection.professionalSummary && <details className="resume-edit"><summary>Edit summary</summary><textarea aria-label="Professional summary" value={data.professionalSummary.summary} onChange={event => edit('professionalSummary', 'summary', event.target.value)} /></details>}
          </> : <p className="empty-bin">Add a summary on your Account page.</p>}
        </section>
      )
    }

    const dataKeyMap = { Education: 'education', Experience: 'workExperience', Projects: 'projects', Activities: 'activities', Skills: 'skills', Accomplishments: 'accomplishments' }
    const binKey = dataKeyMap[key]
    if (!binKey) return null

    return (
      <section className="section" key={key}>
        <h2>{key === 'Experience' ? 'Experience' : key === 'Accomplishments' ? 'Awards & Certifications' : key}</h2>
        {entries(data, binKey).map(item => (
          <div key={item.id}>
            <label className="resume-choice">
              <input type="checkbox" checked={selection[binKey].includes(item.id)} onChange={() => change(binKey, item.id)} />
              <span><strong>{item.schoolName || item.companyName || item.name || item.skill || item.role || 'Untitled entry'}</strong>
                <small>{[item.role, item.major, item.location, item.date || item.gradYear].filter(Boolean).join(' · ')}</small>
                {(item.description || item.text) && <small>{item.description || item.text}</small>}
              </span>
            </label>
            {selection[binKey].includes(item.id) && <details className="resume-edit"><summary>Edit for this resume</summary>
              {Object.entries(item).filter(([field, value]) => field !== 'id' && typeof value === 'string').map(([field, value]) => (
                <label key={field}>{field.replace(/([A-Z])/g, ' $1')}
                  <textarea rows={field === 'description' || field === 'text' ? 3 : 1} value={value} onChange={event => edit(binKey, field, event.target.value, item.id)} />
                </label>
              ))}
            </details>}
          </div>
        ))}
        {!entries(data, binKey).length && <p className="empty-bin">No saved entries yet. Add them on your Account page.</p>}
      </section>
    )
  }

  return (
    <main className="resume-builder">
      <div className="builder-heading">
        <h1>Resume Builder</h1>
        <Link to="/account" onClick={event => { if (!canLeave()) event.preventDefault() }}>Manage your bins</Link>
      </div>
      <section className="section saved-resumes">
        <div className="preview-toolbar"><h2>Your resumes</h2><button onClick={() => open(null)} disabled={saving}>New resume</button></div>
        {!resumes.length && <p className="empty-bin">Your saved resumes will appear here.</p>}
        <div className="resume-list">{resumes.map(item => (
          <div className="resume-card" key={item._id}>
            <button aria-current={item._id === resumeId ? 'true' : undefined} disabled={saving} onClick={() => open(item._id)}>{item.name}</button>
            <a href={`/api/resumes/${item._id}/pdf`} download={`${item.name}.pdf`}>Download</a>
          </div>
        ))}</div>
      </section>
      {loadError ? <p role="alert">{loadError} <button onClick={() => setReload(reload + 1)}>Retry loading</button></p> : !loaded ? <p role="status">Loading your resume...</p> : <>
        <div className="resume-actions">
          <label>Resume name<input value={name} maxLength={80} disabled={saving} onChange={event => { setName(event.target.value); setMessage('') }} /></label>
          <button className="save-btn" disabled={saving || !name.trim()} onClick={() => save(false)}>{saving ? 'Saving...' : 'Save resume'}</button>
          {resumeId && <button disabled={saving || !name.trim()} onClick={() => save(true)}>Save as copy</button>}
          <span role="status">{message || (dirty ? 'Unsaved changes' : resumeId ? 'Saved' : 'New draft')}</span>
        </div>

        <section className="pdf-controls" aria-label="Resume layout">
          <h3>PDF options</h3>
          <fieldset disabled={saving}>
            <label>Font size
              <select aria-label="Font size" value={styles.fontSize} onChange={event => updateStyles({ fontSize: event.target.value })}>
                <option value="9pt">Small</option><option value="10pt">Standard</option>
                <option value="11pt">Large</option><option value="12pt">Extra large</option>
              </select>
            </label>
            <label>Spacing
              <select aria-label="Spacing" value={styles.spacing} onChange={event => updateStyles({ spacing: event.target.value })}>
                <option value="compact">Compact</option><option value="normal">Normal</option><option value="spacious">Spacious</option>
              </select>
            </label>
          </fieldset>
        </section>

        <div className="builder-layout">
          <fieldset className="builder-selections bin-form" disabled={saving}>
            <section className="section section-group">
              <h2>Personal Info</h2>
              {personalFields.filter(([key]) => data.personalInfo?.[key] !== undefined).map(([key, label]) => (
                <div key={key}>
                  <label className="resume-choice"><input type="checkbox" checked={selection.personalInfo.includes(key)} onChange={() => change('personalInfo', key)} /><span><strong>{label}</strong><small>{data.personalInfo[key]}</small></span></label>
                  {selection.personalInfo.includes(key) && <details className="resume-edit"><summary>Edit {label.toLowerCase()}</summary><input aria-label={label} value={data.personalInfo[key]} onChange={event => edit('personalInfo', key, event.target.value)} /></details>}
                </div>
              ))}
              {!selection.personalInfo.length && <p className="empty-bin">Select your contact details above, or add them on your Account page.</p>}
            </section>
            {styles.sectionOrder.map((sectionKey, index) => {
              const isHidden = styles.hideSections.includes(sectionKey)
              return (
                <div className="section-group" data-hidden={isHidden} key={sectionKey}>
                  <div className="section-tools" role="group" aria-label={`${sectionKey} controls`}>
                    <button type="button" aria-pressed={isHidden} onClick={() => updateStyles({ hideSections: isHidden ? styles.hideSections.filter(key => key !== sectionKey) : [...styles.hideSections, sectionKey] })} aria-label={`${isHidden ? 'Show' : 'Hide'} ${sectionKey}`}>{isHidden ? 'Show' : 'Hide'}</button>
                    <button type="button" disabled={index === 0} onClick={() => moveSection(index, -1)} aria-label={`Move ${sectionKey} up`}>↑ Up</button>
                    <button type="button" disabled={index === styles.sectionOrder.length - 1} onClick={() => moveSection(index, 1)} aria-label={`Move ${sectionKey} down`}>↓ Down</button>
                  </div>
                  {renderSectionContent(sectionKey)}
                </div>
              )
            })}
          </fieldset>
          <section className="preview-panel" aria-label="Resume preview">
            <div className="preview-toolbar">
              <div><h2>Your resume</h2><p>Classic template · US Letter</p></div>
              {ready && !error && <a className="save-btn" href={preview.url} download={`${name || 'resume'}.pdf`}>Download PDF</a>}
            </div>
            <p className="preview-status" role="status">{error || (!count ? 'Select at least one item to start your resume.' : ready ? 'Preview is up to date.' : 'Building your preview...')}</p>
            {error && <button onClick={() => { setError(''); setRetry(retry + 1) }}>Retry preview</button>}
            {ready && !error ? <Suspense fallback={<p>Loading preview...</p>}><PdfPreview key={preview.url} url={preview.url} /></Suspense> : <div className="preview-placeholder">{count ? 'Your resume will appear here.' : 'Select information to preview your resume.'}</div>}
            <p className="preview-note">Edits here affect only this resume. Save before switching to another version.</p>
          </section>
        </div>
      </>}
    </main>
  )
}

export default ResumeBuilder
