import { useState } from 'react'
import { updateEntry } from '../../services/sleepService'
import { useAuth } from '../../context/AuthContext'
import { formatDuration, combineDateAndTime } from '../../utils/dateHelpers'
import ErrorBanner from '../shared/ErrorBanner'
import { Sun, Moon, Plus, X } from '@phosphor-icons/react'

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
  const [wakings, setWakings] = useState(entry.wakings?.map(String) || [])
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
      const parsedWakings = wakings.map((v) => parseInt(v, 10)).filter((v) => !isNaN(v) && v > 0)
      await updateEntry(familyId, entry.id, {
        type,
        startTime: start,
        endTime: end,
        mood: mood || null,
        notes: notes || null,
        wakings: parsedWakings,
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
              <Sun size={16} weight="duotone" /> Nap
            </button>
            <button type="button" className={`type-btn${type === 'night' ? ' active' : ''}`} onClick={() => setType('night')}>
              <Moon size={16} weight="duotone" /> Night
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

          {type === 'night' && (
            <div className="wakings-section">
              <div className="wakings-header">
                <span className="form-label" style={{ margin: 0 }}>Night wakings</span>
                <button type="button" className="wakings-add-btn" onClick={() => setWakings((w) => [...w, ''])}>
                  <Plus size={14} weight="bold" /> Add waking
                </button>
              </div>
              {wakings.length === 0 && (
                <p className="wakings-empty">No wakings logged.</p>
              )}
              {wakings.map((val, i) => (
                <div key={i} className="waking-row">
                  <span className="waking-label">Waking {i + 1}</span>
                  <input
                    className="form-input waking-input"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="mins"
                    value={val}
                    onChange={(e) => setWakings((w) => w.map((v, idx) => idx === i ? e.target.value : v))}
                  />
                  <span className="waking-unit">min awake</span>
                  <button type="button" className="waking-remove" onClick={() => setWakings((w) => w.filter((_, idx) => idx !== i))}>
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
