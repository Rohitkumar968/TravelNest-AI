import { useState, useEffect } from 'react'
import { FiUsers, FiPackage, FiCalendar, FiDollarSign, FiTrash2, FiEdit, FiPlus, FiX, FiCheck, FiSave } from 'react-icons/fi'
import { MdFlightTakeoff } from 'react-icons/md'
import api from '../utils/api'
import { Loader } from '../components/Loader'
import toast from 'react-hot-toast'

const STATUS_CLASS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
}

const EMPTY_TOUR = {
  title: '', location: '', country: '', price: '', duration: '',
  description: '', category: 'cultural', difficulty: 'moderate',
  maxGroupSize: 20, featured: false,
  images: [''],
  highlights: [''],
  included: [''],
  excluded: [''],
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTourForm, setShowTourForm] = useState(false)
  const [editTour, setEditTour] = useState(null)
  const [tourForm, setTourForm] = useState(EMPTY_TOUR)
  const [formLoading, setFormLoading] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [sRes, uRes, bRes, tRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/bookings'),
        api.get('/tours?limit=50'),
      ])
      setStats(sRes.data.stats)
      setUsers(uRes.data.users)
      setBookings(bRes.data.bookings)
      setTours(tRes.data.tours)
    } catch { } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(u => u.filter(user => user._id !== id))
      toast.success('User deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/bookings/${id}`, { status })
      setBookings(b => b.map(bk => bk._id === id ? res.data.booking : bk))
      toast.success(`Booking ${status}`)
    } catch { toast.error('Update failed') }
  }

  const deleteTour = async (id) => {
    if (!confirm('Delete this tour?')) return
    try {
      await api.delete(`/tours/${id}`)
      setTours(t => t.filter(tour => tour._id !== id))
      toast.success('Tour deleted')
    } catch { toast.error('Delete failed') }
  }

  const openEditTour = (tour) => {
    setEditTour(tour._id)
    setTourForm({
      ...tour,
      images: tour.images?.length ? tour.images : [''],
      highlights: tour.highlights?.length ? tour.highlights : [''],
      included: tour.included?.length ? tour.included : [''],
      excluded: tour.excluded?.length ? tour.excluded : [''],
    })
    setShowTourForm(true)
  }

  const openNewTour = () => {
    setEditTour(null)
    setTourForm(EMPTY_TOUR)
    setShowTourForm(true)
  }

  const saveTour = async () => {
    setFormLoading(true)
    try {
      const payload = {
        ...tourForm,
        price: Number(tourForm.price),
        duration: Number(tourForm.duration),
        maxGroupSize: Number(tourForm.maxGroupSize),
        images: tourForm.images.filter(Boolean),
        highlights: tourForm.highlights.filter(Boolean),
        included: tourForm.included.filter(Boolean),
        excluded: tourForm.excluded.filter(Boolean),
      }
      if (editTour) {
        const res = await api.put(`/tours/${editTour}`, payload)
        setTours(t => t.map(tour => tour._id === editTour ? res.data.tour : tour))
        toast.success('Tour updated!')
      } else {
        const res = await api.post('/tours', payload)
        setTours(t => [res.data.tour, ...t])
        toast.success('Tour created!')
      }
      setShowTourForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setFormLoading(false)
    }
  }

  const updateArr = (field, idx, val) => {
    setTourForm(f => ({ ...f, [field]: f[field].map((v, i) => i === idx ? val : v) }))
  }
  const addArr = (field) => setTourForm(f => ({ ...f, [field]: [...f[field], ''] }))
  const removeArr = (field, idx) => setTourForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiDollarSign },
    { id: 'tours', label: 'Tours', icon: MdFlightTakeoff },
    { id: 'bookings', label: 'Bookings', icon: FiCalendar },
    { id: 'users', label: 'Users', icon: FiUsers },
  ]

  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your travel platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-card mb-8 w-fit overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}>
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? <Loader size="lg" text="Loading admin data..." /> : (
          <>
            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && stats && (
              <div className="animate-fade-in space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'from-blue-500 to-blue-600' },
                    { label: 'Total Tours', value: stats.totalTours, icon: MdFlightTakeoff, color: 'from-orange-500 to-amber-500' },
                    { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, color: 'from-purple-500 to-purple-600' },
                    { label: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'from-emerald-500 to-emerald-600' },
                  ].map(s => (
                    <div key={s.label} className="card p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                        <s.icon className="text-white" size={22} />
                      </div>
                      <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-5">Recent Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          {['Customer', 'Tour', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left pb-3 font-medium text-slate-500 dark:text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentBookings?.map(bk => (
                          <tr key={bk._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="py-3 font-medium text-slate-900 dark:text-white">{bk.user?.name}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{bk.tour?.title}</td>
                            <td className="py-3"><span className={STATUS_CLASS[bk.status]}>{bk.status}</span></td>
                            <td className="py-3 text-slate-500">{new Date(bk.createdAt).toLocaleDateString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== TOURS ===== */}
            {activeTab === 'tours' && (
              <div className="animate-fade-in space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Manage Tours ({tours.length})</h2>
                  <button onClick={openNewTour} className="btn-primary flex items-center gap-2 py-2.5 px-5">
                    <FiPlus size={16} /> Add Tour
                  </button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          {['Tour', 'Location', 'Price', 'Duration', 'Category', 'Featured', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tours.map(tour => (
                          <tr key={tour._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-[180px] truncate">{tour.title}</td>
                            <td className="px-4 py-3 text-slate-500">{tour.location}</td>
                            <td className="px-4 py-3 font-semibold text-orange-600">₹{tour.price?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-slate-500">{tour.duration}D</td>
                            <td className="px-4 py-3 capitalize"><span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{tour.category}</span></td>
                            <td className="px-4 py-3">{tour.featured ? '✅' : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEditTour(tour)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                  <FiEdit size={15} />
                                </button>
                                <button onClick={() => deleteTour(tour._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <FiTrash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== BOOKINGS ===== */}
            {activeTab === 'bookings' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">All Bookings ({bookings.length})</h2>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          {['Customer', 'Tour', 'Date', 'Travelers', 'Total', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(bk => (
                          <tr key={bk._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900 dark:text-white">{bk.user?.name}</div>
                              <div className="text-slate-400 text-xs">{bk.user?.email}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[140px] truncate">{bk.tour?.title}</td>
                            <td className="px-4 py-3 text-slate-500">{new Date(bk.bookingDate).toLocaleDateString('en-IN')}</td>
                            <td className="px-4 py-3 text-slate-500">{bk.travelers}</td>
                            <td className="px-4 py-3 font-semibold text-orange-600">₹{bk.totalPrice?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3"><span className={STATUS_CLASS[bk.status]}>{bk.status}</span></td>
                            <td className="px-4 py-3">
                              <select
                                value={bk.status}
                                onChange={e => updateBookingStatus(bk._id, e.target.value)}
                                className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== USERS ===== */}
            {activeTab === 'users' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">All Users ({users.length})</h2>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white flex items-center justify-center text-xs font-bold">
                                  {u.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{u.email}</td>
                            <td className="px-4 py-3">
                              <span className={`badge capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                            <td className="px-4 py-3">
                              {u.role !== 'admin' && (
                                <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <FiTrash2 size={15} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== TOUR FORM MODAL ===== */}
      {showTourForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="card w-full max-w-2xl p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {editTour ? 'Edit Tour' : 'Add New Tour'}
              </h2>
              <button onClick={() => setShowTourForm(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Title *</label>
                  <input value={tourForm.title} onChange={e => setTourForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Tour title" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Location *</label>
                  <input value={tourForm.location} onChange={e => setTourForm(f => ({ ...f, location: e.target.value }))} className="input" placeholder="City, Region" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Country *</label>
                  <input value={tourForm.country} onChange={e => setTourForm(f => ({ ...f, country: e.target.value }))} className="input" placeholder="Country" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Price (₹) *</label>
                  <input type="number" value={tourForm.price} onChange={e => setTourForm(f => ({ ...f, price: e.target.value }))} className="input" placeholder="Price per person" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Duration (Days) *</label>
                  <input type="number" value={tourForm.duration} onChange={e => setTourForm(f => ({ ...f, duration: e.target.value }))} className="input" placeholder="Number of days" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Category</label>
                  <select value={tourForm.category} onChange={e => setTourForm(f => ({ ...f, category: e.target.value }))} className="input">
                    {['adventure', 'cultural', 'beach', 'mountain', 'city', 'wildlife', 'religious'].map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Difficulty</label>
                  <select value={tourForm.difficulty} onChange={e => setTourForm(f => ({ ...f, difficulty: e.target.value }))} className="input">
                    {['easy', 'moderate', 'challenging'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Description *</label>
                  <textarea value={tourForm.description} onChange={e => setTourForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" rows={3} placeholder="Tour description" />
                </div>
              </div>

              {/* Images */}
              {[
                { label: 'Image URLs', field: 'images', placeholder: 'https://...' },
                { label: 'Highlights', field: 'highlights', placeholder: 'e.g. Taj Mahal visit' },
                { label: 'Included', field: 'included', placeholder: 'e.g. Breakfast' },
                { label: 'Excluded', field: 'excluded', placeholder: 'e.g. Flights' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">{label}</label>
                  {tourForm[field].map((val, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input value={val} onChange={e => updateArr(field, idx, e.target.value)} className="input flex-1" placeholder={placeholder} />
                      {tourForm[field].length > 1 && (
                        <button type="button" onClick={() => removeArr(field, idx)} className="p-2 text-red-400 hover:text-red-600">
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArr(field)} className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                    <FiPlus size={14} /> Add {label.slice(0, -1)}
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={tourForm.featured} onChange={e => setTourForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500" />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Featured</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowTourForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveTour} disabled={formLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiSave size={16} /> {formLoading ? 'Saving...' : editTour ? 'Update Tour' : 'Create Tour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
