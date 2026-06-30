import { create } from 'zustand'
import api from '../utils/api'

const useWishlistStore = create((set, get) => ({
  wishlistIds: [],
  loading: false,

  fetchWishlist: async () => {
    try {
      const res = await api.get('/wishlist')
      const ids = res.data.wishlist.tours?.map(t => t._id || t) || []
      set({ wishlistIds: ids })
    } catch {}
  },

  toggleWishlist: async (tourId) => {
    try {
      const res = await api.post('/wishlist/toggle', { tourId })
      const ids = res.data.wishlist.tours?.map(t => t._id || t) || []
      set({ wishlistIds: ids })
      return res.data.added
    } catch {
      return null
    }
  },

  isInWishlist: (tourId) => {
    return get().wishlistIds.includes(tourId)
  }
}))

export default useWishlistStore
