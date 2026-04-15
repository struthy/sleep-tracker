import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, initializeUserData, joinFamily } from '../../services/auth'
import { useAuth } from '../../context/AuthContext'
import { Moon } from '@phosphor-icons/react'

export default function LoginPage() {
  const { user, setFamilyId } = useAuth()
  const navigate = useNavigate()
  const [joinMode, setJoinMode] = useState(false)

  // Redirect if already signed in
  useEffect(() => {
    if (user && !joinMode) navigate('/log', { replace: true })
  }, [user, joinMode, navigate])
  const [familyIdInput, setFamilyIdInput] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setError(null)
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      const fid = await initializeUserData(user)
      setFamilyId(fid)
      navigate('/log', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinFamily(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      // First ensure user doc exists
      await initializeUserData(user)
      // Then join the provided family
      const fid = await joinFamily(user.uid, familyIdInput.trim())
      setFamilyId(fid)
      navigate('/log', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Moon size={52} weight="duotone" color="var(--primary)" />
          <h1>Sleep Tracker</h1>
          <p>Track your little one's sleep</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {!joinMode ? (
          <>
            <button className="btn btn-primary btn-lg" onClick={handleSignIn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in with Google'}
            </button>
            <button className="btn btn-ghost" onClick={() => setJoinMode(true)}>
              Join a family account
            </button>
          </>
        ) : (
          <form onSubmit={handleJoinFamily} className="join-form">
            <label className="form-label">
              Family ID
              <input
                className="form-input"
                value={familyIdInput}
                onChange={(e) => setFamilyIdInput(e.target.value)}
                placeholder="Paste the Family ID here"
                required
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Joining…' : 'Sign in & Join Family'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setJoinMode(false)}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
