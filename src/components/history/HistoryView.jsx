import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSleepEntries } from '../../hooks/useSleepEntries'
import EntryCard from './EntryCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorBanner from '../shared/ErrorBanner'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'nap', label: '☀️ Naps' },
  { value: 'night', label: '🌙 Night' },
]

export default function HistoryView() {
  const { familyId } = useAuth()
  const { entries, loading, error } = useSleepEntries(familyId, 60)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.type === filter)

  return (
    <div className="page">
      <h2 className="page-title">History</h2>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-tab${filter === f.value ? ' active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}
      {loading && <LoadingSpinner />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>No entries yet. Start logging sleep on the Log tab!</p>
        </div>
      )}

      <div className="entry-list">
        {filtered.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
