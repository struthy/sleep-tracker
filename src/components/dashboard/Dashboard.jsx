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
import { User } from '@phosphor-icons/react'

function ChildBanner({ name, age, sex, photoDataURL }) {
  const sexLabel = sex === 'male' ? 'Boy' : sex === 'female' ? 'Girl' : null
  return (
    <div className="child-banner">
      <div className="child-banner-photo">
        {photoDataURL
          ? <img src={photoDataURL} alt={name} className="child-banner-img" />
          : <User size={36} weight="duotone" color="var(--text-2)" />
        }
      </div>
      <div className="child-banner-info">
        <div className="child-banner-name">{name}</div>
        {(age !== null || sexLabel) && (
          <div className="child-banner-meta">
            {[age !== null ? `${age} yr${age !== 1 ? 's' : ''}` : null, sexLabel]
              .filter(Boolean).join(' · ')}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { familyId, childName, childAge, childSex, childPhotoDataURL } = useAuth()
  const { stats, loading, error } = useDashboardStats(familyId)

  if (loading) return <LoadingSpinner message="Loading dashboard…" />
  if (error) return <ErrorBanner message={error} />

  if (!stats || stats.totalEntries === 0) {
    return (
      <div className="page">
        {childName && (
          <ChildBanner name={childName} age={childAge} sex={childSex} photoDataURL={childPhotoDataURL} />
        )}
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
      {childName && (
        <ChildBanner name={childName} age={childAge} sex={childSex} photoDataURL={childPhotoDataURL} />
      )}

      <StatsCards stats={stats} childAge={childAge} />

      <WeeklyTotalChart data={stats.daily7} />

      <MonthlyTotalChart data={stats.daily30} />

      <div className="chart-row">
        <NapVsNightChart
          avgNapMinutes={stats.avgNapMinutes}
          avgNightMinutes={stats.avgNightMinutes}
        />
      </div>

      <SleepConsistencyChart data={stats.consistencyData} />

      <SleepRecommendations avgDailyMinutes={avgDailyMinutes} childAge={childAge} />

      <AIInsightsPanel aiStats={stats.aiStats} />
    </div>
  )
}
