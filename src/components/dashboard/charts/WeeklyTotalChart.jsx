import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { DEFAULT_REC } from '../../../utils/recommendations'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="chart-tooltip">
      <div className="tooltip-date">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {Math.round(p.value)}m
        </div>
      ))}
      <div className="tooltip-total">Total: {Math.round(total / 60 * 10) / 10}h</div>
    </div>
  )
}

export default function WeeklyTotalChart({ data }) {
  const minLine = DEFAULT_REC.minHours * 60
  const maxLine = DEFAULT_REC.maxHours * 60

  return (
    <div className="chart-card">
      <h3 className="card-title">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={minLine} stroke="#22c55e" strokeDasharray="4 2" label={{ value: 'Min', fontSize: 10, fill: '#22c55e' }} />
          <ReferenceLine y={maxLine} stroke="#3b82f6" strokeDasharray="4 2" label={{ value: 'Max', fontSize: 10, fill: '#3b82f6' }} />
          <Bar dataKey="napMinutes" name="Nap" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
          <Bar dataKey="nightMinutes" name="Night" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
