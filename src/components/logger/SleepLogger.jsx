import TimerButton from './TimerButton'
import ManualEntryForm from './ManualEntryForm'
import { Sun, Moon } from '@phosphor-icons/react'

export default function SleepLogger() {
  return (
    <div className="page">
      <h2 className="page-title">Log Sleep</h2>

      <div className="timer-grid">
        <TimerButton type="nap" label="Daytime Nap" icon={<Sun size={22} weight="duotone" />} />
        <TimerButton type="night" label="Night Sleep" icon={<Moon size={22} weight="duotone" />} />
      </div>

      <div className="divider" />

      <ManualEntryForm />
    </div>
  )
}
