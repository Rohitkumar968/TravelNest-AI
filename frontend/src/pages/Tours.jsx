import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import api from '../utils/api'
import TourCard from '../components/TourCard'
import { TourCardSkeleton } from '../components/Loader'

const CATEGORIES = ['adventure', 'cultural', 'beach', 'mountain', 'city', 'wildlife', 'religious']
const DURATIONS = [3, 5, 7, 10, 14]

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    page: 1,
  })

  const fetchTours = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.duration) params.duration = filters.duration
      params.page = filters.page
      params.limit = 9

      const res = await api.get('/tours', { params })
      setTours(res.data.tours)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch { } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchTours() }, [fetchTours])

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }))
  const clearFilters = () => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', duration: '', page: 1 })

  const activeFilters = [filters.category, filters.minPrice, filters.maxPrice, filters.duration].filter(Boolean).length

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Explore Tours</h1>
          <p className="text-orange-100">{total} amazing experiences waiting for you</p>

          {/* Search */}
          <div className="mt-6 flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations, tours..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                showFilters ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FiFilter size={16} />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">{activeFilters}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Filter Panel */}
        {showFilters && (
          <div className="card p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Filter Tours</h3>
              <button onClick={clearFilters} className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                <FiX size={14} /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Category</label>
                <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className="input capitalize">
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              {/* Min Price */}
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Min Price (₹)</label>
                <input type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} className="input" />
              </div>
              {/* Max Price */}
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Max Price (₹)</label>
                <input type="number" placeholder="Any" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} className="input" />
              </div>
              {/* Duration */}
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Max Duration (Days)</label>
                <select value={filters.duration} onChange={e => setFilter('duration', e.target.value)} className="input">
                  <option value="">Any Duration</option>
                  {DURATIONS.map(d => <option key={d} value={d}>{d} Days or less</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {(filters.category || filters.search) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <span className="badge bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 cursor-pointer" onClick={() => setFilter('search', '')}>
                🔍 "{filters.search}" <FiX size={12} className="ml-1" />
              </span>
            )}
            {filters.category && (
              <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 cursor-pointer capitalize" onClick={() => setFilter('category', '')}>
                {filters.category} <FiX size={12} className="ml-1" />
              </span>
            )}
          </div>
        )}

        {/* Tours Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => <TourCardSkeleton key={i} />)}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">No tours found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(t => <TourCard key={t._id} tour={t} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  disabled={filters.page === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:border-orange-400 transition-colors"
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilters(f => ({ ...f, page: p }))}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      p === filters.page ? 'bg-orange-500 text-white' : 'border border-slate-200 dark:border-slate-700 hover:border-orange-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  disabled={filters.page === pages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:border-orange-400 transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
