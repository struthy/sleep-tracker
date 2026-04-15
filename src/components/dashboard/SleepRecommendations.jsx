import { SLEEP_RECOMMENDATIONS, getRecForAge } from '../../utils/recommendations'

export default function SleepRecommendations({ avgDailyMinutes, childAge }) {
  const activeRec = getRecForAge(childAge)

  return (
    <div className="rec-card">
      <h3 className="card-title">AAP Sleep Guidelines</h3>
      <div className="rec-list">
        {SLEEP_RECOMMENDATIONS.map((rec) => {
          const isActive = rec === activeRec
          return (
            <div key={rec.label} className={`rec-row${isActive ? ' rec-row-active' : ''}`}>
              <span className="rec-label">{rec.label}</span>
              <span className="rec-range">{rec.minHours}–{rec.maxHours}h</span>
            </div>
          )
        })}
      </div>
      <p className="rec-note">Source: American Academy of Pediatrics</p>
    </div>
  )
}
