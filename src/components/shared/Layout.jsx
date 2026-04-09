import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signOutUser } from '../../services/auth'
import BottomNav from './BottomNav'
import { useState } from 'react'

export default function Layout() {
  const { user, familyId } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOutUser()
    setMenuOpen(false)
  }

  return (
    <div className="app-layout">
      <header className="top-bar">
        <div className="top-bar-title">
          <span>🌙</span> Sleep Tracker
        </div>
        <div className="top-bar-actions">
          <button className="avatar-btn" onClick={() => setMenuOpen((o) => !o)}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="avatar" />
            ) : (
              <span className="avatar-placeholder">{user?.displayName?.[0] || '?'}</span>
            )}
          </button>
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-name">{user?.displayName}</div>
              <div className="user-menu-family">
                <span>Family ID:</span>
                <code
                  className="family-id"
                  onClick={() => {
                    navigator.clipboard.writeText(familyId || '')
                    setMenuOpen(false)
                  }}
                  title="Click to copy"
                >
                  {familyId?.slice(0, 8)}…
                </code>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
