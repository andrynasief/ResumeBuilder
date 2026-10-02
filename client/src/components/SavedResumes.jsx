import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function SavedResumes() {
  const [resumes, setResumes] = useState([])
  const [status, setStatus] = useState('Loading resumes...')
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/resumes', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error()
      const data = await response.json()
      setResumes(data)
      setStatus(data.length ? '' : 'No saved resumes yet.')
    }).catch(() => { if (!controller.signal.aborted) setStatus('Could not load saved resumes. Reload to try again.') })
    return () => controller.abort()
  }, [])
  return (
    <section className="section">
      <h2>Your resumes</h2>
      <p role="status">{status}</p>
      <div className="resume-list">{resumes.map(resume => (
        <div className="resume-card" key={resume._id}>
          <Link to={`/resume?id=${resume._id}`}>{resume.name}</Link>
          <a href={`/api/resumes/${resume._id}/pdf`} download={`${resume.name}.pdf`}>Download</a>
        </div>
      ))}</div>
      <Link to="/resume">Build a new resume</Link>
    </section>
  )
}

export default SavedResumes
