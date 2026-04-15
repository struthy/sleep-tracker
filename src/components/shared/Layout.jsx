import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BottomNav from './BottomNav'
import { Moon } from '@phosphor-icons/react'

export default function Layout() {
  const { user, childPhotoDataURL, childName } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-layout">
      <header className="top-bar">
        <div className="top-bar-title">
          <Moon size={20} weight="fill" /> Sleep Tracker
        </div>
        <button className="avatar-btn" onClick={() => navigate('/profile')}>
          {childPhotoDataURL ? (
            <img src={childPhotoDataURL} alt={childName || 'child'} className="avatar" />
          ) : user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="avatar" />
          ) : (
            <span className="avatar-placeholder">{childName?.[0] || user?.displayName?.[0] || '?'}</span>
          )}
        </button>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
