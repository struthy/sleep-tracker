import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getInsights } from '../../services/claudeService'
import { Sparkle } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'

export default function AIInsightsPanel({ aiStats }) {
  const { childName, childAge, childSex, childNotes } = useAuth()
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGetInsights() {
    if (!aiStats) return
    setLoading(true)
    setError(null)
    try {
      const text = await getInsights(aiStats, { childName, childAge, childSex, childNotes })
      setResponse(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
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
          <button className="btn btn-ghost btn-sm" onClick={() => setResponse(null)}>
            Refresh
          </button>
        </>
      )}
    </div>
  )
}
