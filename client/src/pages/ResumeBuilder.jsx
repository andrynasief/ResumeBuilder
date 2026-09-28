import { useState, useEffect } from 'react'
import PersonalInfo from '../components/PersonalInfo'
import ProfessionalSummary from '../components/ProfessionalSummary'

function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState({})
  const [professionalSummary, setProfessionalSummary] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

  const loadResume = async function() {
    const response = await fetch( '/api/resume' )
    const data = await response.json()

    if( data.personalInfo ) setPersonalInfo( data.personalInfo )
    if( data.professionalSummary ) setProfessionalSummary( data.professionalSummary )
  }

  useEffect( function() {
    loadResume()
  }, [] )

  const handleSave = async function() {
    setSaveStatus('Saving...')

    const body = JSON.stringify({ personalInfo, professionalSummary })

    await fetch( '/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })

    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  return (
    <div className="container">
      <h1>Resume Builder</h1>

      <PersonalInfo data={personalInfo} onChange={setPersonalInfo} />
      <ProfessionalSummary data={professionalSummary} onChange={setProfessionalSummary} />

      <button className="save-btn" onClick={handleSave}>Save Resume</button>
      {saveStatus && <span className="save-status">{saveStatus}</span>}
    </div>
  )
}

export default ResumeBuilder