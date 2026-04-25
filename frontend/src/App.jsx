import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CycleTracker from './pages/CycleTracker'
import FoodLogger from './pages/FoodLogger'
import MoodJournal from './pages/MoodJournal'
import PregnancyTracker from './pages/PregnancyTracker'
import GovtSchemes from './pages/GovtSchemes'
import HealthReport from './pages/HealthReport'
import AIChat from './pages/AIChat'
import Onboarding from './pages/Onboarding'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" />
}

function AppContent() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  // Pages where Footer should NOT appear (e.g., AI chat takes full height)
  const noFooterPages = ['/ai-chat']
  const showFooter = !noFooterPages.includes(location.pathname)

  // Landing page has its own header, so don't show Navbar on landing when logged out
  const isLandingPage = location.pathname === '/' && !token

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar on every page except the landing page (which has its own header) */}
      {!isLandingPage && <Navbar />}

      {/* Main content area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/cycles" element={
            <ProtectedRoute><CycleTracker /></ProtectedRoute>
          } />
          <Route path="/fitness" element={
            <ProtectedRoute><FoodLogger /></ProtectedRoute>
          } />
          <Route path="/mental" element={
            <ProtectedRoute><MoodJournal /></ProtectedRoute>
          } />
          <Route path="/pregnancy" element={
            <ProtectedRoute><PregnancyTracker /></ProtectedRoute>
          } />
          <Route path="/schemes" element={
            <ProtectedRoute><GovtSchemes /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><HealthReport /></ProtectedRoute>
          } />
          <Route path="/ai-chat" element={
            <ProtectedRoute><AIChat /></ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute><Onboarding /></ProtectedRoute>
          } />
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer on every page except specific ones */}
      {showFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
