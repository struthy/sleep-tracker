import { useState } from 'react'
import { Sun, Moon, Plus, X } from '@phosphor-icons/react'

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'rough', emoji: '😮‍💨', label: 'Rough' },
]

export default function NotesMoodPicker({ onSave, onCancel, sleepType, duration }) {
  const [mood, setMood] = useState(null)
  const [notes, setNotes] = useState('')
  const [wakings, setWakings] = useState([]) // array of minute values

  function addWaking() {
    setWakings((w) => [...w, ''])
  }

  function updateWaking(i, val) {
    setWakings((w) => w.map((v, idx) => (idx === i ? val : v)))
  }

  function removeWaking(i) {
    setWakings((w) => w.filter((_, idx) => idx !== i))
  }

  function handleSave() {
    const parsedWakings = wakings
      .map((v) => parseInt(v, 10))
      .filter((v) => !isNaN(v) && v > 0)
    onSave({ mood, notes, wakings: parsedWakings })
  }

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">
        <div className="sheet-handle" />
        <h2 className="sheet-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sleepType === 'nap'
            ? <Sun size={20} weight="duotone" />
            : <Moon size={20} weight="duotone" />}
          {sleepType === 'nap' ? 'Nap' : 'Night sleep'} logged
          {duration && <span className="sheet-duration"> · {duration}</span>}
        </h2>

        <div className="mood-section">
          <p className="form-label">How did it go?</p>
          <div className="mood-row">
            {MOODS.map((m) => (
              <button
                key={m.value}
                className={`mood-btn${mood === m.value ? ' selected' : ''}`}
                onClick={() => setMood(mood === m.value ? null : m.value)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {sleepType === 'night' && (
          <div className="wakings-section">
            <div className="wakings-header">
              <span className="form-label" style={{ margin: 0 }}>Night wakings</span>
              <button type="button" className="wakings-add-btn" onClick={addWaking}>
                <Plus size={14} weight="bold" /> Add waking
              </button>
            </div>
            {wakings.length === 0 && (
              <p className="wakings-empty">No wakings — tap "Add waking" if the child woke up.</p>
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
                  onChange={(e) => updateWaking(i, e.target.value)}
                />
                <span className="waking-unit">min awake</span>
                <button type="button" className="waking-remove" onClick={() => removeWaking(i)}>
                  <X size={14} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="form-label">
          Notes (optional)
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. fought sleep, woke early…"
            rows={2}
          />
        </label>

        <div className="sheet-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={onCancel}>
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
