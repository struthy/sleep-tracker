import TimerButton from './TimerButton'
import ManualEntryForm from './ManualEntryForm'

export default function SleepLogger() {
  return (
    <div className="page">
      <h2 className="page-title">Log Sleep</h2>

      <div className="timer-grid">
        <TimerButton type="nap" label="Daytime Nap" icon="☀️" />
        <TimerButton type="night" label="Night Sleep" icon="🌙" />
      </div>

      <div className="divider" />

      <ManualEntryForm />
    </div>
  )
}
