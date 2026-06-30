import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import TourCard from '../components/TourCard'
import { TourCardSkeleton } from '../components/Loader'
import useWishlistStore from '../store/wishlistStore'

export default function Wishlist() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const { wishlistIds } = useWishlistStore()

  useEffect(() => {
    api.get('/wishlist')
      .then(r => setTours(r.data.wishlist.tours || []))
      .finally(() => setLoading(false))
  }, [wishlistIds.length])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">My Wishlist ❤️</h1>
          <p className="text-orange-100">{tours.length} tours saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => <TourCardSkeleton key={i} />)}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">💝</div>
            <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-3">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8">Explore tours and save the ones you love</p>
            <Link to="/tours" className="btn-primary">Browse Tours</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => <TourCard key={tour._id} tour={tour} />)}
          </div>
        )}
      </div>
    </div>
  )
}
