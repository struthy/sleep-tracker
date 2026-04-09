import { useAuth } from '../../context/AuthContext'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import StatsCards from './StatsCards'
import SleepRecommendations from './SleepRecommendations'
import WeeklyTotalChart from './charts/WeeklyTotalChart'
import MonthlyTotalChart from './charts/MonthlyTotalChart'
import NapVsNightChart from './charts/NapVsNightChart'
import SleepConsistencyChart from './charts/SleepConsistencyChart'
import AIInsightsPanel from '../ai/AIInsightsPanel'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorBanner from '../shared/ErrorBanner'

export default function Dashboard() {
  const { familyId } = useAuth()
  const { stats, loading, error } = useDashboardStats(familyId)

  if (loading) return <LoadingSpinner message="Loading dashboard…" />
  if (error) return <ErrorBanner message={error} />

  if (!stats || stats.totalEntries === 0) {
    return (
      <div className="page">
        <h2 className="page-title">Dashboard</h2>
        <div className="empty-state">
          <p>No sleep data yet. Start logging on the Log tab!</p>
        </div>
      </div>
    )
  }

  const avgDailyMinutes = stats.daily30.reduce((s, d) => s + d.totalMinutes, 0) / 30

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      <StatsCards stats={stats} />

      <WeeklyTotalChart data={stats.daily7} />

      <MonthlyTotalChart data={stats.daily30} />

      <div className="chart-row">
        <NapVsNightChart
          avgNapMinutes={stats.avgNapMinutes}
          avgNightMinutes={stats.avgNightMinutes}
        />
      </div>

      <SleepConsistencyChart data={stats.consistencyData} />

      <SleepRecommendations avgDailyMinutes={avgDailyMinutes} />

      <AIInsightsPanel aiStats={stats.aiStats} />
    </div>
  )
}
