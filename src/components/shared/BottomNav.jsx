import { NavLink } from 'react-router-dom'
import { Timer, ChartBar, ClockCounterClockwise, UserCircle } from '@phosphor-icons/react'

const NAV_ITEMS = [
  { to: '/log', Icon: Timer, label: 'Log' },
  { to: '/dashboard', Icon: ChartBar, label: 'Dashboard' },
  { to: '/history', Icon: ClockCounterClockwise, label: 'History' },
  { to: '/profile', Icon: UserCircle, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={24} weight="duotone" className="bottom-nav-icon" />
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
