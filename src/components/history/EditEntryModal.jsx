import { useState } from 'react'
import { updateEntry } from '../../services/sleepService'
import { useAuth } from '../../context/AuthContext'
import { formatDuration, combineDateAndTime } from '../../utils/dateHelpers'
import ErrorBanner from '../shared/ErrorBanner'

function toInputDate(ts) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-CA')
}

function toInputTime(ts) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const MOODS = [
  { value: 'great', emoji: '😄' },
  { value: 'okay', emoji: '😐' },
  { value: 'rough', emoji: '😮‍💨' },
]

export default function EditEntryModal({ entry, onClose }) {
  const { familyId } = useAuth()
  const [type, setType] = useState(entry.type)
  const [date, setDate] = useState(toInputDate(entry.startTime))
  const [startTime, setStartTime] = useState(toInputTime(entry.startTime))
  const [endTime, setEndTime] = useState(toInputTime(entry.endTime))
  const [mood, setMood] = useState(entry.mood || null)
  const [notes, setNotes] = useState(entry.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    const start = combineDateAndTime(date, startTime)
    let end = combineDateAndTime(date, endTime)
    if (end <= start) end = new Date(end.getTime() + 86400000)

    setSaving(true)
    try {
      await updateEntry(familyId, entry.id, {
        type,
        startTime: start,
        endTime: end,
        mood: mood || null,
        notes: notes || null,
      })
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">Edit Entry</h2>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleSave} className="manual-form">
          <div className="type-toggle">
            <button type="button" className={`type-btn${type === 'nap' ? ' active' : ''}`} onClick={() => setType('nap')}>
              ☀️ Nap
            </button>
            <button type="button" className={`type-btn${type === 'night' ? ' active' : ''}`} onClick={() => setType('night')}>
              🌙 Night
            </button>
          </div>

          <label className="form-label">
            Date
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <div className="form-row">
            <label className="form-label">
              Start
              <input type="time" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </label>
            <label className="form-label">
              End
              <input type="time" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </label>
          </div>

          <div className="mood-row">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`mood-btn${mood === m.value ? ' selected' : ''}`}
                onClick={() => setMood(mood === m.value ? null : m.value)}
              >
                <span className="mood-emoji">{m.emoji}</span>
              </button>
            ))}
          </div>

          <label className="form-label">
            Notes
            <textarea className="form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </label>

          <div className="sheet-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
