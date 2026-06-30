import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'
import useThemeStore from './store/themeStore'
import useWishlistStore from './store/wishlistStore'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AIPlanner from './pages/AIPlanner'
import Wishlist from './pages/Wishlist'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { initAuth, user } = useAuthStore()
  const { init } = useThemeStore()
  const { fetchWishlist } = useWishlistStore()

  useEffect(() => {
    init()
    initAuth()
  }, [])

  useEffect(() => {
    if (user) fetchWishlist()
  }, [user])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/ai-planner" element={
              <ProtectedRoute><AIPlanner /></ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'dark:bg-slate-800 dark:text-white',
            duration: 3000,
            style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' }
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
