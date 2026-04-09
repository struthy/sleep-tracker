import { useState, useEffect } from 'react'
import { subscribeToEntries } from '../services/sleepService'

export function useSleepEntries(familyId, days = 60) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) return
    setLoading(true)
    const unsubscribe = subscribeToEntries(familyId, days, (data) => {
      setEntries(data)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [familyId, days])

  return { entries, loading, error }
}
