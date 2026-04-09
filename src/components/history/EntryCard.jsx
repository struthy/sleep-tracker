import { useState } from 'react'
import { deleteEntry } from '../../services/sleepService'
import { useAuth } from '../../context/AuthContext'
import { formatTime, formatDate, formatDuration } from '../../utils/dateHelpers'
import EditEntryModal from './EditEntryModal'

const MOOD_EMOJI = { great: '😄', okay: '😐', rough: '😮‍💨' }

export default function EntryCard({ entry }) {
  const { familyId } = useAuth()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this entry?')) return
    setDeleting(true)
    try {
      await deleteEntry(familyId, entry.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className={`entry-card${deleting ? ' deleting' : ''}`}>
        <div className="entry-icon">
          {entry.type === 'nap' ? '☀️' : '🌙'}
        </div>
        <div className="entry-info">
          <div className="entry-date">{formatDate(entry.startTime)}</div>
          <div className="entry-times">
            {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
          </div>
          {entry.notes && <div className="entry-notes">{entry.notes}</div>}
        </div>
        <div className="entry-right">
          <div className="entry-duration">{formatDuration(entry.durationMinutes)}</div>
          {entry.mood && <div className="entry-mood">{MOOD_EMOJI[entry.mood]}</div>}
          <div className="entry-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit">
              ✏️
            </button>
            <button className="icon-btn" onClick={handleDelete} disabled={deleting} aria-label="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>

      {editing && <EditEntryModal entry={entry} onClose={() => setEditing(false)} />}
    </>
  )
}
