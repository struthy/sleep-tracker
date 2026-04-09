import { SLEEP_RECOMMENDATIONS, getSleepStatus } from '../../utils/recommendations'

export default function SleepRecommendations({ avgDailyMinutes }) {
  return (
    <div className="rec-card">
      <h3 className="card-title">AAP Sleep Guidelines</h3>
      <div className="rec-list">
        {SLEEP_RECOMMENDATIONS.map((rec) => {
          const status = getSleepStatus(avgDailyMinutes, rec)
          return (
            <div key={rec.label} className="rec-row">
              <span className="rec-label">{rec.label}</span>
              <span className="rec-range">{rec.minHours}–{rec.maxHours}h</span>
            </div>
          )
        })}
      </div>
      <p className="rec-note">
        Source: American Academy of Pediatrics
      </p>
    </div>
  )
}
