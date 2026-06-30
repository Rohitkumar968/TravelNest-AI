import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin, FiArrowRight, FiStar, FiShield, FiHeadphones } from 'react-icons/fi'
import { MdFlightTakeoff, MdBeachAccess, MdLandscape } from 'react-icons/md'
import { GiForestCamp, GiTempleGate } from 'react-icons/gi'
import api from '../utils/api'
import TourCard from '../components/TourCard'
import { TourCardSkeleton } from '../components/Loader'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&q=90',
]

const CATEGORIES = [
  { label: 'Beach', icon: MdBeachAccess, value: 'beach', color: 'from-sky-400 to-blue-500' },
  { label: 'Mountain', icon: MdLandscape, value: 'mountain', color: 'from-slate-500 to-slate-700' },
  { label: 'Adventure', icon: GiForestCamp, value: 'adventure', color: 'from-emerald-400 to-green-600' },
  { label: 'Cultural', icon: GiTempleGate, value: 'cultural', color: 'from-purple-400 to-indigo-600' },
]

const STATS = [
  { label: 'Happy Travelers', value: '50,000+' },
  { label: 'Tour Packages', value: '200+' },
  { label: 'Destinations', value: '80+' },
  { label: 'Years Experience', value: '10+' },
]

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tours/featured').then(r => setFeatured(r.data.tours)).finally(() => setLoading(false))
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/tours?search=${encodeURIComponent(search)}`)
  }

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
          </div>
        ))}

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Travel Planning
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
            Discover Your Next
            <br />
            <span className="text-gradient">Dream Destination</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in">
            Let our AI travel assistant plan the perfect trip for you — from itineraries to hidden gems.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto animate-slide-up">
            <div className="flex-1 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/95 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 font-body text-base"
              />
            </div>
            <button type="submit" className="btn-primary py-4 px-8 flex items-center gap-2 justify-center whitespace-nowrap">
              <FiSearch size={18} /> Explore Tours
            </button>
          </form>

          {/* Hero Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? 'w-8 bg-orange-400' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-display text-3xl md:text-4xl font-bold">{s.value}</div>
              <div className="text-orange-100 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle">Find the perfect adventure for your travel style</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.value}
                to={`/tours?category=${cat.value}`}
                className="group relative overflow-hidden rounded-2xl p-8 text-center text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <Icon size={40} className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold text-lg">{cat.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== FEATURED TOURS ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Tours</h2>
              <p className="section-subtitle">Handpicked destinations loved by our travelers</p>
            </div>
            <Link to="/tours" className="btn-outline hidden md:flex items-center gap-2">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(6).fill(0).map((_, i) => <TourCardSkeleton key={i} />)
              : featured.map(tour => <TourCard key={tour._id} tour={tour} />)
            }
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link to="/tours" className="btn-primary inline-flex items-center gap-2">
              View All Tours <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose TravelNest AI?</h2>
          <p className="section-subtitle">We make travel planning effortless and enjoyable</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: MdFlightTakeoff, title: 'AI Trip Planning', desc: 'Our Groq-powered AI creates personalized itineraries based on your budget, interests, and travel style.', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
            { icon: FiShield, title: 'Trusted & Safe', desc: 'All tours are verified by our expert team. Travel with confidence knowing every detail is taken care of.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
            { icon: FiHeadphones, title: '24/7 Support', desc: 'Our travel experts and AI assistant are available round the clock to help you with anything you need.', color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/20' },
          ].map(f => (
            <div key={f.title} className="card p-8 text-center group hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 mx-4 md:mx-8 lg:mx-16 mb-10 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-5 right-10 w-20 h-20 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ready to Explore the World?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Let our AI plan your perfect trip. Just tell us your dream — we'll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/ai-planner" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
              ✨ Plan with AI
            </Link>
            <Link to="/tours" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Browse Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
