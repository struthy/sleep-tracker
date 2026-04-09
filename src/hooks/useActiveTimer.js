import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'sleepTracker_activeTimers'

function loadTimers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveTimers(timers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers))
}

// Returns timer state and controls for a specific sleep type ('nap' | 'night')
export function useActiveTimer(type) {
  const [startTime, setStartTime] = useState(() => {
    const saved = loadTimers()
    return saved[type] ? new Date(saved[type]) : null
  })
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (startTime) {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      setElapsed(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [startTime])

  function start() {
    const now = new Date()
    const timers = loadTimers()
    timers[type] = now.toISOString()
    saveTimers(timers)
    setStartTime(now)
  }

  function stop() {
    const end = new Date()
    const timers = loadTimers()
    const savedStart = timers[type] ? new Date(timers[type]) : startTime
    delete timers[type]
    saveTimers(timers)
    setStartTime(null)
    return { startTime: savedStart, endTime: end }
  }

  function cancel() {
    const timers = loadTimers()
    delete timers[type]
    saveTimers(timers)
    setStartTime(null)
  }

  return {
    isRunning: !!startTime,
    startTime,
    elapsed,
    start,
    stop,
    cancel,
  }
}
