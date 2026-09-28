import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Account from './pages/Account'
import ResumeBuilder from './pages/ResumeBuilder'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Login</Link>
        <Link to="/account">Account</Link>
        <Link to="/resume">Resume Builder</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/resume" element={<ResumeBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App