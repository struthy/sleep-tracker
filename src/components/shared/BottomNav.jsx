import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/log', icon: '⏱️', label: 'Log' },
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/history', icon: '📋', label: 'History' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
