import { formatDuration } from '../../utils/dateHelpers'
import { DEFAULT_REC, getSleepStatus } from '../../utils/recommendations'

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`stat-card${highlight ? ` highlight-${highlight}` : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

export default function StatsCards({ stats }) {
  const status = getSleepStatus(stats.todayTotalMinutes, DEFAULT_REC)
  const statusMap = { good: 'green', under: 'yellow', over: 'blue' }

  return (
    <div className="stats-grid">
      <StatCard
        label="Today's total"
        value={formatDuration(stats.todayTotalMinutes)}
        sub={`Goal: ${DEFAULT_REC.minHours}–${DEFAULT_REC.maxHours}h`}
        highlight={statusMap[status]}
      />
      <StatCard
        label="Avg nap"
        value={formatDuration(stats.avgNapMinutes)}
      />
      <StatCard
        label="Avg night sleep"
        value={formatDuration(stats.avgNightMinutes)}
      />
      <StatCard
        label="Avg bedtime"
        value={stats.avgBedtime || '—'}
      />
      <StatCard
        label="Avg wake time"
        value={stats.avgWakeTime || '—'}
      />
    </div>
  )
}
