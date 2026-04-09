import { useState, useEffect } from 'react'
import { getEntriesForRange } from '../services/sleepService'
import {
  getDailyTotals,
  getAverageBedtime,
  getAverageWakeTime,
  getAverageByType,
  getSleepConsistencyData,
  buildAIStats,
} from '../utils/sleepCalculations'

export function useDashboardStats(familyId) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) return

    async function load() {
      setLoading(true)
      try {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)

        const entries = await getEntriesForRange(familyId, start, end)

        const daily30 = getDailyTotals(entries, 30)
        const daily7 = daily30.slice(-7)

        const nightEntries = entries.filter((e) => e.type === 'night')
        const napEntries = entries.filter((e) => e.type === 'nap')

        const todayStr = new Date().toLocaleDateString('en-CA')
        const todayEntries = entries.filter((e) => {
          const d = e.startTime.toDate ? e.startTime.toDate() : new Date(e.startTime)
          return d.toLocaleDateString('en-CA') === todayStr
        })
        const todayTotal = todayEntries.reduce((sum, e) => sum + e.durationMinutes, 0)

        setStats({
          daily30,
          daily7,
          avgNapMinutes: getAverageByType(napEntries),
          avgNightMinutes: getAverageByType(nightEntries),
          avgBedtime: getAverageBedtime(nightEntries),
          avgWakeTime: getAverageWakeTime(nightEntries),
          todayTotalMinutes: todayTotal,
          consistencyData: getSleepConsistencyData(entries),
          aiStats: buildAIStats(entries, daily30),
          totalEntries: entries.length,
        })
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [familyId])

  return { stats, loading, error }
}
