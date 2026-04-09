import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
} from 'firebase/firestore'
import { db } from './firebase'

function entriesRef(familyId) {
  return collection(db, 'families', familyId, 'sleepEntries')
}

function calcDuration(startTime, endTime) {
  const diffMs = endTime.toMillis() - startTime.toMillis()
  return Math.round(diffMs / 60000)
}

export async function addEntry(familyId, entry) {
  const startTime = entry.startTime instanceof Timestamp
    ? entry.startTime
    : Timestamp.fromDate(new Date(entry.startTime))
  const endTime = entry.endTime instanceof Timestamp
    ? entry.endTime
    : Timestamp.fromDate(new Date(entry.endTime))

  const durationMinutes = Math.max(1, calcDuration(startTime, endTime))
  if (endTime.toMillis() <= startTime.toMillis()) throw new Error('End time must be after start time.')

  return addDoc(entriesRef(familyId), {
    type: entry.type,
    startTime,
    endTime,
    durationMinutes,
    logMethod: entry.logMethod || 'manual',
    notes: entry.notes || null,
    mood: entry.mood || null,
    createdBy: entry.createdBy,
    createdAt: Timestamp.now(),
  })
}

export async function updateEntry(familyId, entryId, updates) {
  const ref = doc(db, 'families', familyId, 'sleepEntries', entryId)
  const payload = { ...updates }

  if (updates.startTime || updates.endTime) {
    const startTime = updates.startTime instanceof Timestamp
      ? updates.startTime
      : Timestamp.fromDate(new Date(updates.startTime))
    const endTime = updates.endTime instanceof Timestamp
      ? updates.endTime
      : Timestamp.fromDate(new Date(updates.endTime))
    payload.startTime = startTime
    payload.endTime = endTime
    payload.durationMinutes = calcDuration(startTime, endTime)
    if (payload.durationMinutes <= 0) throw new Error('End time must be after start time.')
  }

  await updateDoc(ref, payload)
}

export async function deleteEntry(familyId, entryId) {
  await deleteDoc(doc(db, 'families', familyId, 'sleepEntries', entryId))
}

// Real-time listener for recent entries (used on History view)
export function subscribeToEntries(familyId, days, callback) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const q = query(
    entriesRef(familyId),
    where('startTime', '>=', Timestamp.fromDate(since)),
    orderBy('startTime', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(entries)
  })
}

// One-time fetch for a date range (used by dashboard)
export async function getEntriesForRange(familyId, startDate, endDate) {
  const q = query(
    entriesRef(familyId),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate)),
    orderBy('startTime', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
