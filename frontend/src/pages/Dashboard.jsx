import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiCalendar, FiMapPin, FiTrash2, FiEdit, FiCheck, FiX, FiPackage } from 'react-icons/fi'
import { MdFlightTakeoff } from 'react-icons/md'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import { Loader } from '../components/Loader'
import toast from 'react-hot-toast'

const STATUS_CLASS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
}

export default function Dashboard() {
  const { user, updateProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, wRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/wishlist')
        ])
        setBookings(bRes.data.bookings)
        setWishlist(wRes.data.wishlist.tours || [])
      } catch { } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(b => b.filter(bk => bk._id !== id))
      toast.success('Booking cancelled')
    } catch {
      toast.error('Could not cancel booking')
    }
  }

  const removeWishlist = async (tourId) => {
    try {
      await api.post('/wishlist/toggle', { tourId })
      setWishlist(w => w.filter(t => t._id !== tourId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Error removing from wishlist')
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    const res = await updateProfile(profile)
    setSaving(false)
    if (res.success) { setEditMode(false); toast.success('Profile updated!') }
    else toast.error(res.message)
  }

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: FiPackage, count: bookings.length },
    { id: 'wishlist', label: 'Wishlist', icon: FiMapPin, count: wishlist.length },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ]

  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-2xl font-bold font-display shadow-glow">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-card mb-8 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}>
              <tab.icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader size="lg" text="Loading your data..." />
        ) : (
          <>
            {/* ===== BOOKINGS ===== */}
            {activeTab === 'bookings' && (
              <div className="space-y-4 animate-fade-in">
                {bookings.length === 0 ? (
                  <div className="card p-16 text-center">
                    <MdFlightTakeoff className="text-6xl text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">No bookings yet</h3>
                    <p className="text-slate-500 mb-6">Start exploring and book your first adventure!</p>
                    <Link to="/tours" className="btn-primary inline-block">Explore Tours</Link>
                  </div>
                ) : bookings.map(bk => (
                  <div key={bk._id} className="card p-5 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={bk.tour?.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200'}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <Link to={`/tours/${bk.tour?._id}`} className="font-display font-bold text-lg text-slate-900 dark:text-white hover:text-orange-500 transition-colors">
                          {bk.tour?.title}
                        </Link>
                        <span className={STATUS_CLASS[bk.status]}>{bk.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><FiMapPin size={13} /> {bk.tour?.location}</span>
                        <span className="flex items-center gap-1"><FiCalendar size={13} /> {new Date(bk.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>👥 {bk.travelers} traveler{bk.travelers > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600 text-lg">₹{bk.totalPrice?.toLocaleString('en-IN')}</span>
                        {bk.status === 'pending' && (
                          <button onClick={() => cancelBooking(bk._id)}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors">
                            <FiTrash2 size={13} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== WISHLIST ===== */}
            {activeTab === 'wishlist' && (
              <div className="animate-fade-in">
                {wishlist.length === 0 ? (
                  <div className="card p-16 text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-slate-500 mb-6">Save tours you love and come back to them later</p>
                    <Link to="/tours" className="btn-primary inline-block">Browse Tours</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlist.map(tour => (
                      <div key={tour._id} className="card overflow-hidden group">
                        <div className="relative h-44">
                          <img
                            src={tour.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400'}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400' }}
                          />
                          <button onClick={() => removeWishlist(tour._id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                            <FiX size={14} />
                          </button>
                        </div>
                        <div className="p-4">
                          <Link to={`/tours/${tour._id}`} className="font-semibold text-slate-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-1">
                            {tour.title}
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-slate-500 flex items-center gap-1"><FiMapPin size={12} />{tour.location}</span>
                            <span className="font-bold text-orange-600">₹{tour.price?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== PROFILE ===== */}
            {activeTab === 'profile' && (
              <div className="max-w-lg animate-fade-in">
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                    <button onClick={() => setEditMode(!editMode)}
                      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all ${editMode ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'btn-secondary'}`}>
                      {editMode ? <><FiX size={14} /> Cancel</> : <><FiEdit size={14} /> Edit</>}
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Full Name</label>
                      {editMode ? (
                        <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input" />
                      ) : (
                        <p className="text-slate-900 dark:text-white font-medium">{user?.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Email</label>
                      <p className="text-slate-900 dark:text-white font-medium">{user?.email}</p>
                      <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Phone</label>
                      {editMode ? (
                        <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input" placeholder="+91 98765 43210" />
                      ) : (
                        <p className="text-slate-900 dark:text-white font-medium">{user?.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Account Type</label>
                      <span className={`badge capitalize ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {user?.role}
                      </span>
                    </div>

                    {editMode && (
                      <button onClick={saveProfile} disabled={saving} className="btn-primary w-full justify-center flex items-center gap-2">
                        <FiCheck size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
