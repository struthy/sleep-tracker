export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatTime(date) {
  if (!date) return '—'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date) {
  if (!date) return '—'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function toLocalDateString(date) {
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD
}

export function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// Combine a date string (YYYY-MM-DD) and time string (HH:MM) into a Date
export function combineDateAndTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`)
}

export function todayDateString() {
  return new Date().toLocaleDateString('en-CA')
}

export function currentTimeString() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
