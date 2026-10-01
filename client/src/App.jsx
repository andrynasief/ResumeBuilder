import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Account from './pages/Account'
import ResumeBuilder from './pages/ResumeBuilder'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [checkedAuth, setCheckedAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          setUser(await response.json())
        }
      } finally {
        setCheckedAuth(true)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
  }

  if (!checkedAuth) {
    return <p>Loading...</p>
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        {user ? (
          <>
            <Link to="/account">Account</Link>
            <Link to="/resume">Resume Builder</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={user ? <Navigate to="/account" /> : <Login onLogin={setUser} />} />
        <Route path="/account" element={user ? <Account /> : <Navigate to="/" />} />
        <Route path="/resume" element={user ? <ResumeBuilder /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App