import { toLocalDateString, formatDuration } from './dateHelpers'

function toDate(ts) {
  return ts?.toDate ? ts.toDate() : new Date(ts)
}

// Group entries by local date string
export function groupEntriesByDay(entries) {
  const map = {}
  for (const entry of entries) {
    const key = toLocalDateString(toDate(entry.startTime))
    if (!map[key]) map[key] = []
    map[key].push(entry)
  }
  return map
}

// Returns array of { date, totalMinutes, napMinutes, nightMinutes } for last N days
export function getDailyTotals(entries, days) {
  const grouped = groupEntriesByDay(entries)
  const result = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-CA')
    const dayEntries = grouped[key] || []

    const napMinutes = dayEntries
      .filter((e) => e.type === 'nap')
      .reduce((sum, e) => sum + e.durationMinutes, 0)
    const nightMinutes = dayEntries
      .filter((e) => e.type === 'night')
      .reduce((sum, e) => sum + e.durationMinutes, 0)

    result.push({
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      dateKey: key,
      napMinutes,
      nightMinutes,
      totalMinutes: napMinutes + nightMinutes,
      totalHours: +((napMinutes + nightMinutes) / 60).toFixed(1),
    })
  }
  return result
}

// Average duration for a set of entries (same type)
export function getAverageByType(entries) {
  if (!entries.length) return 0
  const sum = entries.reduce((s, e) => s + e.durationMinutes, 0)
  return Math.round(sum / entries.length)
}

// Average bedtime (startTime of night entries)
export function getAverageBedtime(nightEntries) {
  if (!nightEntries.length) return null
  const minutesFromMidnight = nightEntries.map((e) => {
    const d = toDate(e.startTime)
    // Handle times after midnight as next day (e.g. 1am = 25h)
    let h = d.getHours()
    if (h < 6) h += 24
    return h * 60 + d.getMinutes()
  })
  const avg = minutesFromMidnight.reduce((a, b) => a + b, 0) / minutesFromMidnight.length
  const h = Math.floor(avg % 24)
  const m = Math.round(avg % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Average wake time (endTime of night entries)
export function getAverageWakeTime(nightEntries) {
  if (!nightEntries.length) return null
  const minutesFromMidnight = nightEntries.map((e) => {
    const d = toDate(e.endTime)
    return d.getHours() * 60 + d.getMinutes()
  })
  const avg = minutesFromMidnight.reduce((a, b) => a + b, 0) / minutesFromMidnight.length
  const h = Math.floor(avg / 60)
  const m = Math.round(avg % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// For scatter/consistency chart — normalized hour of day for start times
export function getSleepConsistencyData(entries) {
  return entries.map((e) => {
    const d = toDate(e.startTime)
    let hour = d.getHours() + d.getMinutes() / 60
    // Shift late-night times past midnight to keep chart readable
    if (hour < 6) hour += 24
    return {
      hour: +hour.toFixed(2),
      type: e.type,
      date: toLocalDateString(d),
    }
  })
}

// Build the stats object passed to Claude AI
export function buildAIStats(entries, daily30) {
  const recent14 = daily30.slice(-14)
  const nightEntries = entries.filter((e) => e.type === 'night')
  const napEntries = entries.filter((e) => e.type === 'nap')

  const recentNotes = entries
    .filter((e) => e.notes)
    .slice(0, 5)
    .map((e) => `[${e.mood || 'no mood'}] ${e.notes}`)
    .join('; ')

  return {
    dailyTotals: recent14,
    avgNapMinutes: getAverageByType(napEntries),
    avgNightMinutes: getAverageByType(nightEntries),
    avgBedtime: getAverageBedtime(nightEntries) || 'unknown',
    avgWakeTime: getAverageWakeTime(nightEntries) || 'unknown',
    daysTracked: recent14.filter((d) => d.totalMinutes > 0).length,
    recentNotes: recentNotes || 'None',
  }
}
