// AAP / Sleep Foundation recommendations by age range
export const SLEEP_RECOMMENDATIONS = [
  { label: 'Newborn (0-3m)', minHours: 14, maxHours: 17 },
  { label: 'Infant (4-11m)', minHours: 12, maxHours: 15 },
  { label: 'Toddler (1-2y)', minHours: 11, maxHours: 14 },
  { label: 'Preschool (3-5y)', minHours: 10, maxHours: 13 },
]

// Default to toddler
export const DEFAULT_REC = SLEEP_RECOMMENDATIONS[2]

export function getRecForAge(age) {
  if (!age) return DEFAULT_REC
  if (age < 1) return SLEEP_RECOMMENDATIONS[0]
  if (age <= 2) return SLEEP_RECOMMENDATIONS[2]
  if (age <= 5) return SLEEP_RECOMMENDATIONS[3]
  return SLEEP_RECOMMENDATIONS[3]
}

export function getSleepStatus(totalMinutes, rec) {
  const totalHours = totalMinutes / 60
  if (totalHours < rec.minHours) return 'under'
  if (totalHours > rec.maxHours) return 'over'
  return 'good'
}
