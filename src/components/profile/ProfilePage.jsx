import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signOutUser } from '../../services/auth'
import { clearAllEntries } from '../../services/sleepService'
import { Camera, User } from '@phosphor-icons/react'

function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = 240
      const scale = Math.min(size / img.width, size / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = URL.createObjectURL(file)
  })
}

export default function ProfilePage() {
  const { childName, childBirthYear, childSex, childPhotoDataURL, childNotes, saveChildProfile, isProfileComplete } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [name, setName] = useState(childName || '')
  const [birthYear, setBirthYear] = useState(childBirthYear ? String(childBirthYear) : '')
  const [sex, setSex] = useState(childSex || null)
  const [photo, setPhoto] = useState(childPhotoDataURL || null)
  const [notes, setNotes] = useState(childNotes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataURL = await compressImage(file)
    setPhoto(dataURL)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter the child\'s name.'); return }
    setError(null)
    setSaving(true)
    try {
      const parsedYear = birthYear ? parseInt(birthYear, 10) : null
      await saveChildProfile({
        childName: name.trim(),
        childBirthYear: parsedYear,
        childSex: sex,
        childPhotoDataURL: photo,
        childNotes: notes.trim(),
      })
      navigate('/log', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleClearAll() {
    if (!clearConfirm) { setClearConfirm(true); return }
    setClearing(true)
    try {
      await clearAllEntries(familyId)
      setClearConfirm(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setClearing(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const age = birthYear && parseInt(birthYear) ? currentYear - parseInt(birthYear) : null

  return (
    <div className="page" style={{ maxWidth: 420, paddingTop: 24 }}>
      <h2 className="page-title">Child's Profile</h2>
      {!isProfileComplete && (
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
          Set up your child's profile to personalise the app and AI insights.
        </p>
      )}

      <form onSubmit={handleSave} className="profile-form">

        {/* Photo */}
        <div className="profile-photo-wrap">
          <div className="profile-photo" onClick={() => fileInputRef.current?.click()}>
            {photo
              ? <img src={photo} alt="Child" className="profile-photo-img" />
              : <User size={52} weight="duotone" color="var(--text-2)" />
            }
            <div className="profile-photo-overlay">
              <Camera size={22} weight="bold" color="white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <p className="profile-photo-hint">Tap to change photo</p>
        </div>

        {/* Name */}
        <label className="form-label">
          Child's name
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Lily"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {/* Birth year */}
        <label className="form-label">
          Year of birth
          <input
            className="form-input"
            type="number"
            placeholder={`e.g. ${currentYear - 2}`}
            min="2000"
            max={currentYear}
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
          {age !== null && <span className="profile-age-hint">Age: {age} year{age !== 1 ? 's' : ''} old</span>}
        </label>

        {/* Sex */}
        <div className="form-label">
          Sex
          <div className="profile-sex-toggle">
            {['male', 'female'].map((s) => (
              <button
                key={s}
                type="button"
                className={`type-btn${sex === s ? ' active' : ''}`}
                onClick={() => setSex(s)}
              >
                {s === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Notes for AI */}
        <label className="form-label">
          Notes for AI insights
          <textarea
            className="form-textarea"
            placeholder="e.g. premature birth, attends daycare, has reflux…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
            Optional context that helps personalise AI recommendations.
          </span>
        </label>

        {error && <div className="error-banner">{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : isProfileComplete ? 'Save Changes' : 'Get Started'}
        </button>

        {isProfileComplete && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        )}

        <hr className="divider" style={{ marginTop: 8 }} />

        {clearConfirm ? (
          <div className="clear-confirm-box">
            <p>This will permanently delete all sleep entries. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ flex: 1, background: 'var(--red)', color: 'white' }}
                onClick={handleClearAll}
                disabled={clearing}
              >
                {clearing ? 'Deleting…' : 'Yes, delete all'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ flex: 1 }}
                onClick={() => setClearConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--red)' }}
            onClick={handleClearAll}
          >
            Clear all sleep data
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => signOutUser()}
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
