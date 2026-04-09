import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function hourToTime(hour) {
  const h = Math.floor(hour % 24)
  const m = Math.round((hour % 1) * 60)
  const period = h >= 12 && h < 24 ? 'PM' : 'AM'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="chart-tooltip">
      <div>{d.date}</div>
      <div>Start: {hourToTime(d.hour)}</div>
      <div>{d.type === 'nap' ? '☀️ Nap' : '🌙 Night'}</div>
    </div>
  )
}

export default function SleepConsistencyChart({ data }) {
  const napData = data.filter((d) => d.type === 'nap')
  const nightData = data.filter((d) => d.type === 'night')

  return (
    <div className="chart-card">
      <h3 className="card-title">Sleep Consistency</h3>
      <p className="chart-subtitle">When does he typically fall asleep?</p>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" type="category" tick={{ fontSize: 10 }} hide />
          <YAxis
            dataKey="hour"
            type="number"
            domain={[12, 26]}
            tickFormatter={hourToTime}
            tick={{ fontSize: 10 }}
            ticks={[12, 14, 16, 18, 20, 22, 24, 26]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter name="Nap" data={napData} fill="#fbbf24" opacity={0.8} />
          <Scatter name="Night" data={nightData} fill="#6366f1" opacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
