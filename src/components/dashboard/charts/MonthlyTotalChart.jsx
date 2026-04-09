import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="chart-tooltip">
      <div className="tooltip-date">{label}</div>
      <div className="tooltip-total">{Math.round(total / 60 * 10) / 10}h total</div>
    </div>
  )
}

export default function MonthlyTotalChart({ data }) {
  // Show every 5th label to avoid crowding
  const tickData = data.map((d, i) => ({ ...d, tick: i % 5 === 0 ? d.date : '' }))

  return (
    <div className="chart-card">
      <h3 className="card-title">Last 30 Days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={tickData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="napGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="nightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="tick" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" domain={[0, 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="napMinutes" name="Nap" stackId="a" stroke="#fbbf24" fill="url(#napGrad)" />
          <Area type="monotone" dataKey="nightMinutes" name="Night" stackId="a" stroke="#6366f1" fill="url(#nightGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
