import { useState } from 'react'
import { useActiveTimer } from '../../hooks/useActiveTimer'
import { useAuth } from '../../context/AuthContext'
import { addEntry } from '../../services/sleepService'
import NotesMoodPicker from './NotesMoodPicker'
import { formatElapsed, formatDuration } from '../../utils/dateHelpers'
import ErrorBanner from '../shared/ErrorBanner'

export default function TimerButton({ type, label, icon }) {
  const { familyId, user } = useAuth()
  const timer = useActiveTimer(type)
  const [pendingEntry, setPendingEntry] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleStop() {
    const { startTime, endTime } = timer.stop()
    const durationMinutes = Math.round((endTime - startTime) / 60000)
    setPendingEntry({ startTime, endTime, durationMinutes })
  }

  async function handleSaveMood({ mood, notes, wakings }) {
    if (!pendingEntry) return
    setSaving(true)
    setError(null)
    try {
      await addEntry(familyId, {
        type,
        startTime: pendingEntry.startTime,
        endTime: pendingEntry.endTime,
        logMethod: 'timer',
        mood,
        notes,
        wakings: wakings || [],
        createdBy: user.uid,
      })
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
    <div className="timer-card">
      <div className="timer-header">
        <span className="timer-icon">{icon}</span>
        <span className="timer-label">{label}</span>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {timer.isRunning ? (
        <>
          <div className="timer-elapsed">{formatElapsed(timer.elapsed)}</div>
          <div className="timer-start-note">
            Started at {timer.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="timer-row">
            <button className="btn btn-stop btn-lg" onClick={handleStop}>
              Stop
            </button>
            <button className="btn btn-ghost btn-sm" onClick={timer.cancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button className="btn btn-start btn-lg" onClick={timer.start} disabled={saving}>
          {saving ? 'Saving…' : 'Start'}
        </button>
      )}

      {pendingEntry && (
        <NotesMoodPicker
          sleepType={type}
          duration={formatDuration(pendingEntry.durationMinutes)}
          onSave={handleSaveMood}
          onCancel={handleSkipMood}
        />
      )}
    </div>
  )
}
