import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { getInsights } from '../../services/claudeService'
import { Sparkle } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'

export default function AIInsightsPanel({ aiStats }) {
  const { familyId, childName, childAge, childSex, childNotes } = useAuth()
  const storageKey = familyId ? `sleepTracker_aiInsights_${familyId}` : null

  const [response, setResponse] = useState(() => {
    if (!storageKey) return null
    return localStorage.getItem(storageKey) || null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Keep localStorage in sync if familyId loads after mount
  useEffect(() => {
    if (storageKey && !response) {
      const cached = localStorage.getItem(storageKey)
      if (cached) setResponse(cached)
    }
  }, [storageKey])

  async function handleGetInsights() {
    if (!aiStats) return
    setLoading(true)
    setError(null)
    try {
      const text = await getInsights(aiStats, { childName, childAge, childSex, childNotes })
      setResponse(text)
      if (storageKey) localStorage.setItem(storageKey, text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleRefresh() {
    setResponse(null)
    if (storageKey) localStorage.removeItem(storageKey)
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <Sparkle size={26} weight="duotone" color="var(--accent-nap)" className="ai-icon" />
        <div>
          <h3 className="card-title">AI Sleep Insights</h3>
          <p className="card-subtitle">Personalized feedback powered by Claude</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!response && !loading && (
        <button
          className="btn btn-primary"
          onClick={handleGetInsights}
          disabled={!aiStats || loading}
        >
          Get AI Insights
        </button>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="spinner" />
          <p>Analyzing sleep patterns…</p>
        </div>
      )}

      {response && (
        <>
          <div className="ai-response">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleRefresh}>
            Refresh
          </button>
        </>
      )}
    </div>
  )
}
