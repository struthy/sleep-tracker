import { useState } from 'react'

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'rough', emoji: '😮‍💨', label: 'Rough' },
]

export default function NotesMoodPicker({ onSave, onCancel, sleepType, duration }) {
  const [mood, setMood] = useState(null)
  const [notes, setNotes] = useState('')

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet">
        <div className="sheet-handle" />
        <h2 className="sheet-title">
          {sleepType === 'nap' ? '☀️ Nap' : '🌙 Night sleep'} logged
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

        <label className="form-label">
          Notes (optional)
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. fought sleep, woke early…"
            rows={3}
          />
        </label>

        <div className="sheet-actions">
          <button className="btn btn-primary" onClick={() => onSave({ mood, notes })}>
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
