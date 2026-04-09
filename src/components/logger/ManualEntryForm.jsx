import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addEntry } from '../../services/sleepService'
import { combineDateAndTime, todayDateString, currentTimeString, formatDuration } from '../../utils/dateHelpers'
import NotesMoodPicker from './NotesMoodPicker'
import ErrorBanner from '../shared/ErrorBanner'

export default function ManualEntryForm() {
  const { familyId, user } = useAuth()
  const [type, setType] = useState('nap')
  const [date, setDate] = useState(todayDateString())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingEntry, setPendingEntry] = useState(null)

  function validate() {
    if (!startTime || !endTime) return 'Please fill in both start and end times.'
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    const start = combineDateAndTime(date, startTime)
    let end = combineDateAndTime(date, endTime)
    if (end <= start) end = new Date(end.getTime() + 86400000) // next day

    const durationMinutes = Math.round((end - start) / 60000)
    setPendingEntry({ startTime: start, endTime: end, durationMinutes, type })
  }

  async function handleSaveMood({ mood, notes }) {
    setSaving(true)
    setError(null)
    try {
      await addEntry(familyId, {
        type: pendingEntry.type,
        startTime: pendingEntry.startTime,
        endTime: pendingEntry.endTime,
        logMethod: 'manual',
        mood,
        notes,
        createdBy: user.uid,
      })
      // Reset form
      setStartTime('')
      setEndTime('')
      setPendingEntry(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleSkipMood() {
    handleSaveMood({ mood: null, notes: '' })
  }

  return (
    <div className="manual-form-card">
      <h3 className="card-title">Manual Entry</h3>
      <form onSubmit={handleSubmit} className="manual-form">
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn${type === 'nap' ? ' active' : ''}`}
            onClick={() => setType('nap')}
          >
            ☀️ Nap
          </button>
          <button
            type="button"
            className={`type-btn${type === 'night' ? ' active' : ''}`}
            onClick={() => setType('night')}
          >
            🌙 Night
          </button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <label className="form-label">
          Date
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <div className="form-row">
          <label className="form-label">
            Start time
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            End time
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add Entry'}
        </button>
      </form>

      {pendingEntry && (
        <NotesMoodPicker
          sleepType={pendingEntry.type}
          duration={formatDuration(pendingEntry.durationMinutes)}
          onSave={handleSaveMood}
          onCancel={handleSkipMood}
        />
      )}
    </div>
  )
}
