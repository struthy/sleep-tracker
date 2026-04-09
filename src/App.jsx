import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './components/auth/LoginPage'
import Layout from './components/shared/Layout'
import SleepLogger from './components/logger/SleepLogger'
import Dashboard from './components/dashboard/Dashboard'
import HistoryView from './components/history/HistoryView'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/log" replace />} />
              <Route path="/log" element={<SleepLogger />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<HistoryView />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
