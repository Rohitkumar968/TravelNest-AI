import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiStar, FiUsers, FiHeart, FiArrowLeft, FiCheckCircle, FiXCircle, FiCalendar, FiSend } from 'react-icons/fi'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import useWishlistStore from '../store/wishlistStore'
import { Loader } from '../components/Loader'
import toast from 'react-hot-toast'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { isInWishlist, toggleWishlist } = useWishlistStore()

  const [tour, setTour] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [booking, setBooking] = useState({ date: '', travelers: 1 })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [tourRes, reviewRes] = await Promise.all([
          api.get(`/tours/${id}`),
          api.get(`/reviews/${id}`)
        ])
        setTour(tourRes.data.tour)
        setReviews(reviewRes.data.reviews)
      } catch {
        toast.error('Tour not found')
        navigate('/tours')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to book'); navigate('/login'); return }
    if (!booking.date) { toast.error('Please select a date'); return }
    setBookingLoading(true)
    try {
      await api.post('/bookings', { tourId: id, bookingDate: booking.date, travelers: booking.travelers })
      toast.success('🎉 Booking confirmed! Check your dashboard.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return }
    const added = await toggleWishlist(id)
    if (added !== null) toast.success(added ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    setReviewLoading(true)
    try {
      const res = await api.post('/reviews', { tourId: id, ...review })
      setReviews(r => [res.data.review, ...r])
      setReview({ rating: 5, comment: '' })
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Loader size="lg" text="Loading tour..." /></div>
  if (!tour) return null

  const wishlisted = isInWishlist(id)
  const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-orange-500 mt-6 mb-4 transition-colors">
          <FiArrowLeft /> Back to Tours
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 h-80 md:h-96">
            <img
              src={tour.images?.[activeImg] || fallback}
              alt={tour.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = fallback }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {(tour.images?.slice(1, 3) || [fallback, fallback]).map((img, i) => (
              <div key={i} className="h-36 md:h-[calc(50%-6px)] cursor-pointer overflow-hidden"
                onClick={() => setActiveImg(i + 1)}>
                <img src={img || fallback} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e => { e.target.src = fallback }} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title Row */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-orange-100 text-orange-700 capitalize">{tour.category}</span>
                  <span className="badge bg-slate-100 text-slate-600 capitalize">{tour.difficulty}</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{tour.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                  <FiMapPin size={14} />
                  <span>{tour.location}, {tour.country}</span>
                </div>
              </div>
              <button onClick={handleWishlist}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <FiHeart className={wishlisted ? 'fill-current' : ''} /> {wishlisted ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: FiClock, label: 'Duration', value: `${tour.duration} Days` },
                { icon: FiUsers, label: 'Group Size', value: `Max ${tour.maxGroupSize}` },
                { icon: FiStar, label: 'Rating', value: `${tour.rating || 'N/A'} (${tour.numReviews})` },
                { icon: FiMapPin, label: 'Country', value: tour.country },
              ].map(s => (
                <div key={s.label} className="card p-4 text-center">
                  <s.icon className="mx-auto mb-1 text-orange-500" />
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
              {['overview', 'itinerary', 'includes', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-6">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{tour.description}</p>
                {tour.highlights?.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-4">Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <span className="text-orange-500 mt-0.5">✦</span> {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="animate-fade-in space-y-4">
                {tour.itinerary?.map((day, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {day.day}
                      </div>
                      {i < tour.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-orange-200 dark:bg-orange-900 mt-2" />}
                    </div>
                    <div className="card p-4 flex-1 mb-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{day.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'includes' && (
              <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-emerald-600 flex items-center gap-2 mb-3"><FiCheckCircle /> Included</h3>
                  <ul className="space-y-2">
                    {tour.included?.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                        <span className="text-emerald-500">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-500 flex items-center gap-2 mb-3"><FiXCircle /> Not Included</h3>
                  <ul className="space-y-2">
                    {tour.excluded?.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                        <span className="text-red-400">✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fade-in space-y-6">
                {/* Write review */}
                {user && (
                  <form onSubmit={handleReview} className="card p-5 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Write a Review</h3>
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map(r => (
                        <button key={r} type="button" onClick={() => setReview(rv => ({ ...rv, rating: r }))}
                          className={`text-2xl transition-transform hover:scale-110 ${r <= review.rating ? 'text-amber-400' : 'text-slate-300'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={review.comment}
                      onChange={e => setReview(rv => ({ ...rv, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      rows={3}
                      className="input resize-none"
                      required
                    />
                    <button type="submit" disabled={reviewLoading} className="btn-primary flex items-center gap-2">
                      <FiSend size={14} /> {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
                {/* Reviews list */}
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No reviews yet. Be the first!</p>
                ) : reviews.map(r => (
                  <div key={r._id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white flex items-center justify-center font-bold">
                          {r.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{r.user?.name}</div>
                          <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-slate-400 text-sm">Starting from</span>
                  <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                    ₹{tour.price?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-400 text-sm">per person</span>
                </div>
                {tour.rating > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                      <FiStar className="fill-current" /> {tour.rating}
                    </div>
                    <div className="text-xs text-slate-400">{tour.numReviews} reviews</div>
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    <FiCalendar className="inline mr-1" /> Select Date
                  </label>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    <FiUsers className="inline mr-1" /> Travelers
                  </label>
                  <select value={booking.travelers} onChange={e => setBooking(b => ({ ...b, travelers: Number(e.target.value) }))} className="input">
                    {Array.from({ length: Math.min(tour.maxGroupSize, 10) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <span>₹{tour.price?.toLocaleString('en-IN')} × {booking.travelers}</span>
                    <span>₹{(tour.price * booking.travelers)?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-orange-600">₹{(tour.price * booking.travelers)?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button type="submit" disabled={bookingLoading} className="btn-primary w-full justify-center">
                  {bookingLoading ? 'Booking...' : '🎯 Book Now'}
                </button>

                {!user && (
                  <p className="text-center text-sm text-slate-500">
                    <Link to="/login" className="text-orange-500 hover:underline">Login</Link> to book this tour
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
