import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { monthValue } from '../resume-data'
import SavedResumes from '../components/SavedResumes'
import PersonalInfo from '../components/PersonalInfo'
import ProfessionalSummary from '../components/ProfessionalSummary'
import WorkExperience from '../components/WorkExperience'
import Projects from '../components/Projects'
import Activities from '../components/Activities'
import Education from '../components/Education'
import Skills from '../components/Skills'
import Accomplishments from '../components/Accomplishments'

function Account() {
  const [personalInfo, setPersonalInfo] = useState({})
  const [professionalSummary, setProfessionalSummary] = useState({})
  const [workExperience, setWorkExperience] = useState([])
  const [projects, setProjects] = useState([])
  const [activities, setActivities] = useState([])
  const [education, setEducation] = useState([])
  const [skills, setSkills] = useState([])
  const [accomplishments, setAccomplishments] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/resume')
        if (!response.ok) throw new Error()
        const data = await response.json()
        setPersonalInfo(data.personalInfo || {})
        setProfessionalSummary(data.professionalSummary || {})
        setWorkExperience(data.workExperience || [])
        setProjects((data.projects || []).map(item => ({ ...item, date: monthValue(item.date) || '' })))
        setActivities(data.activities || [])
        setEducation((data.education || []).map(item => ({ ...item, gradYear: monthValue(item.gradYear) || '' })))
        setSkills(data.skills || [])
        setAccomplishments((data.accomplishments || []).map(item => ({ ...item, date: monthValue(item.date) || '' })))
        setLoaded(true)
        setStatus('')
      } catch {
        setStatus('Could not load your information. Please reload to try again.')
      }
    }
    load()
  }, [])

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    setStatus('Saving...')
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalInfo, professionalSummary, workExperience, projects, activities, education, skills, accomplishments })
      })
      if (!response.ok) throw new Error()
      setStatus('Saved!')
    } catch {
      setStatus('Could not save. Your changes are still here; please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container">
      <h1>Account</h1>
      <SavedResumes />
      <p className="section-intro">Add your information here, then save your bins before building a resume.</p>
      <form onSubmit={handleSave}>
      <fieldset className="bin-form" disabled={!loaded || saving}>
        <PersonalInfo data={personalInfo} onChange={setPersonalInfo} />
        <ProfessionalSummary data={professionalSummary} onChange={setProfessionalSummary} />
        <Education data={education} onChange={setEducation} />
        <WorkExperience data={workExperience} onChange={setWorkExperience} />
        <Projects data={projects} onChange={setProjects} />
        <Activities data={activities} onChange={setActivities} />
        <Skills data={skills} onChange={setSkills} />
        <Accomplishments data={accomplishments} onChange={setAccomplishments} />
        <button className="save-btn" type="submit">{saving ? 'Saving...' : 'Save Information'}</button>
      </fieldset>
      </form>
      <p role="status">{status}</p>
      <Link to="/resume">Build a Resume</Link>
    </main>
  )
}

export default Account
