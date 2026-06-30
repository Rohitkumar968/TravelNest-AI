import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiClock, FiStar, FiUsers } from 'react-icons/fi'
import useWishlistStore from '../store/wishlistStore'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  adventure: 'bg-emerald-100 text-emerald-700',
  cultural: 'bg-purple-100 text-purple-700',
  beach: 'bg-sky-100 text-sky-700',
  mountain: 'bg-slate-100 text-slate-700',
  city: 'bg-amber-100 text-amber-700',
  wildlife: 'bg-lime-100 text-lime-700',
  religious: 'bg-rose-100 text-rose-700',
}

export default function TourCard({ tour }) {
  const { isInWishlist, toggleWishlist } = useWishlistStore()
  const { user } = useAuthStore()
  const wishlisted = isInWishlist(tour._id)

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to save tours'); return }
    const added = await toggleWishlist(tour._id)
    if (added !== null) toast.success(added ? '❤️ Added to wishlist' : 'Removed from wishlist')
  }

  const imgSrc = tour.images?.[0] || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80`

  return (
    <Link to={`/tours/${tour._id}`} className="card group overflow-hidden block hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imgSrc}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge capitalize ${CATEGORY_COLORS[tour.category] || 'bg-gray-100 text-gray-700'}`}>
            {tour.category}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            wishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-red-500 hover:text-white'
          }`}
        >
          <FiHeart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="glass-dark text-white text-sm font-bold px-3 py-1 rounded-lg">
            ₹{tour.price?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {tour.title}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-3">
          <FiMapPin size={13} />
          <span className="line-clamp-1">{tour.location}, {tour.country}</span>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {tour.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <FiClock size={13} /> {tour.duration}D
            </span>
            <span className="flex items-center gap-1">
              <FiUsers size={13} /> {tour.maxGroupSize}
            </span>
          </div>
          {tour.rating > 0 && (
            <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
              <FiStar size={13} className="fill-current" /> {tour.rating}
              <span className="text-slate-400 font-normal">({tour.numReviews})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
