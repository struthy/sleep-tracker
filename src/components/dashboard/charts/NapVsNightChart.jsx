import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatDuration } from '../../../utils/dateHelpers'

const COLORS = ['#fbbf24', '#6366f1']

export default function NapVsNightChart({ avgNapMinutes, avgNightMinutes }) {
  const data = [
    { name: 'Nap', value: avgNapMinutes || 0 },
    { name: 'Night', value: avgNightMinutes || 0 },
  ].filter((d) => d.value > 0)

  if (!data.length) {
    return (
      <div className="chart-card">
        <h3 className="card-title">Nap vs Night Sleep</h3>
        <div className="chart-empty">No data yet</div>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3 className="card-title">Avg Nap vs Night Sleep</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatDuration(v)} />
          <Legend formatter={(v, entry) => `${v}: ${formatDuration(entry.payload.value)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
