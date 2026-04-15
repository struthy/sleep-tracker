import { useState } from 'react'
import { deleteEntry } from '../../services/sleepService'
import { useAuth } from '../../context/AuthContext'
import { formatTime, formatDate, formatDuration } from '../../utils/dateHelpers'
import EditEntryModal from './EditEntryModal'
import { Sun, Moon, PencilSimple, Trash, Smiley, SmileyMeh, SmileySad } from '@phosphor-icons/react'

const MOOD_ICON = {
  great: <Smiley size={18} weight="duotone" color="var(--green)" />,
  okay: <SmileyMeh size={18} weight="duotone" color="var(--yellow)" />,
  rough: <SmileySad size={18} weight="duotone" color="var(--red)" />,
}

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
          {entry.type === 'nap'
            ? <Sun size={24} weight="duotone" color="var(--accent-nap)" />
            : <Moon size={24} weight="duotone" color="var(--accent-night)" />}
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
          {entry.mood && <div className="entry-mood">{MOOD_ICON[entry.mood]}</div>}
          <div className="entry-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit">
              <PencilSimple size={18} weight="duotone" />
            </button>
            <button className="icon-btn" onClick={handleDelete} disabled={deleting} aria-label="Delete">
              <Trash size={18} weight="duotone" color="var(--red)" />
            </button>
          </div>
        </div>
      </div>

      {editing && <EditEntryModal entry={entry} onClose={() => setEditing(false)} />}
    </>
  )
}
