import { Link } from 'react-router-dom'

function ResumeBuilder() {
  return (
    <div className="container">
      <h1>Resume Builder</h1>
      <p>Resume selection and saved versions are coming next.</p>
      <Link to="/account">Manage your information on the Account page</Link>
    </div>
  )
}

export default ResumeBuilder
