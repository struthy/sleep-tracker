const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

function buildPrompt(stats) {
  const lines = [
    `Here is my toddler's sleep data from the past 14 days:`,
    ``,
    `Daily totals (most recent first):`,
    ...stats.dailyTotals.map(
      (d) =>
        `  ${d.date}: ${d.totalHours}h total (${d.napMinutes}min nap, ${d.nightMinutes}min night sleep)`
    ),
    ``,
    `Averages:`,
    `  Average nap duration: ${stats.avgNapMinutes}min`,
    `  Average night sleep: ${stats.avgNightMinutes}min`,
    `  Average bedtime: ${stats.avgBedtime}`,
    `  Average wake time: ${stats.avgWakeTime}`,
    `  Total days tracked: ${stats.daysTracked}`,
    ``,
    `Notes/moods logged: ${stats.recentNotes || 'None'}`,
    ``,
    `Please provide personalized, practical feedback on this toddler's sleep patterns. Include:`,
    `1. What's going well`,
    `2. Areas for improvement`,
    `3. 2-3 specific, actionable tips`,
    `4. How this compares to AAP recommendations for toddlers (11-14 hours total per day)`,
    ``,
    `Keep your response warm, supportive, and concise (around 300 words).`,
  ]
  return lines.join('\n')
}

export async function getInsights(stats) {
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
      messages: [{ role: 'user', content: buildPrompt(stats) }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}
