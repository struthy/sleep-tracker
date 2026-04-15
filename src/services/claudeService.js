const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

function ageRec(childAge) {
  if (!childAge) return '11–14 hours (toddler estimate)'
  if (childAge < 1) return '12–16 hours (including naps)'
  if (childAge <= 2) return '11–14 hours (including naps)'
  if (childAge <= 5) return '10–13 hours (including naps)'
  return '9–12 hours'
}

function buildPrompt(stats, { childName, childAge, childSex, childNotes } = {}) {
  const name = childName || 'the child'
  const pronoun = childSex === 'male' ? 'he' : childSex === 'female' ? 'she' : 'they'
  const possessive = childSex === 'male' ? 'his' : childSex === 'female' ? 'her' : 'their'

  const lines = [
    `Here is ${name}'s sleep data from the past 14 days:`,
    ...(childAge ? [`Age: ${childAge} year${childAge !== 1 ? 's' : ''} old`] : []),
    ...(childSex ? [`Sex: ${childSex}`] : []),
    ...(childNotes ? [`Additional context: ${childNotes}`] : []),
    ``,
    `Daily totals (most recent first):`,
    ...stats.dailyTotals.map(
      (d) => `  ${d.date}: ${d.totalHours}h total (${d.napMinutes}min nap, ${d.nightMinutes}min night sleep)`
    ),
    ``,
    `Averages:`,
    `  Average nap duration: ${stats.avgNapMinutes}min`,
    `  Average night sleep: ${stats.avgNightMinutes}min`,
    `  Average bedtime: ${stats.avgBedtime}`,
    `  Average wake time: ${stats.avgWakeTime}`,
    `  Total days tracked: ${stats.daysTracked}`,
    ...(stats.nightsTrackedWithWakings > 0 ? [
      `  Avg night wakings: ${stats.avgWakingsPerNight} per night`,
      `  Avg total time awake during wakings: ${stats.avgWakingMinutes} min per night`,
      `  (based on ${stats.nightsTrackedWithWakings} tracked nights)`,
    ] : []),
    ``,
    `Notes/moods logged: ${stats.recentNotes || 'None'}`,
    ``,
    `Please provide personalized, practical feedback on ${name}'s sleep patterns.`,
    `Refer to ${name} by name and use ${pronoun}/${possessive} pronouns. Include:`,
    `1. What's going well`,
    `2. Areas for improvement`,
    `3. 2-3 specific, actionable tips`,
    `4. How this compares to AAP recommendations for this age (${ageRec(childAge)} per day)`,
    ``,
    `Keep your response warm, supportive, and concise (around 300 words).`,
  ]
  return lines.join('\n')
}

export async function getInsights(stats, profile = {}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Anthropic API key not configured.')

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system:
        'You are a friendly, knowledgeable pediatric sleep consultant. Give practical, evidence-based advice to parents about their toddler\'s sleep. Use markdown formatting in your response.',
      messages: [{ role: 'user', content: buildPrompt(stats, profile) }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}
