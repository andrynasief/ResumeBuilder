import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Account from './pages/Account'
import ResumeBuilder from './pages/ResumeBuilder'
import AppStyles from './AppStyles'

function App() {
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [checkedAuth, setCheckedAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          setUser(await response.json())
        }
      } catch {
        setAuthError('Could not reach the server. Please refresh or try logging in again.')
      } finally {
        setCheckedAuth(true)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST'})
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setUser(null)
      window.location.href = '/'
    }
  }

  if (!checkedAuth) {
    return <><AppStyles /><p className="container" role="status">Loading...</p></>
  }

  return (
    <BrowserRouter>
      <AppStyles />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="navbar" aria-label="Main navigation">
        <Link className="brand" to={user ? "/account" : "/"}>ResumeBuilder</Link>
        {user ? (
          <>
            <NavLink to="/account">Account</NavLink>
            <NavLink to="/resume">Resume Builder</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>

      <div id="main-content" tabIndex={-1}>
      {authError && <p className="container" role="alert">{authError}</p>}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/account" /> : <Login onLogin={user => { setAuthError(''); setUser(user) }} />} />
        <Route path="/account" element={user ? <Account /> : <Navigate to="/" />} />
        <Route path="/resume" element={user ? <ResumeBuilder /> : <Navigate to="/" />} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App