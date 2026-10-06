import { useState } from 'react'

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      onLogin(data)
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button className="save-btn" type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>
      <button className="text-button" disabled={submitting} type="button" onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login') }}>
        {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Log in'}
      </button>
    </main>
  )
}

export default Login