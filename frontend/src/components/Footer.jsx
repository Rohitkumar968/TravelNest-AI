import { Link } from 'react-router-dom'
import { MdFlightTakeoff } from 'react-icons/md'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
                <MdFlightTakeoff className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Travel<span className="text-gradient">Nest</span> AI
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              AI-powered travel planning that transforms your dream destinations into unforgettable journeys.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {[['Tours', '/tours'], ['AI Trip Planner', '/ai-planner'], ['Wishlist', '/wishlist'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Top Destinations</h4>
            <ul className="space-y-2">
              {['Manali', 'Goa', 'Kerala', 'Rajasthan', 'Bali', 'Dubai', 'Switzerland', 'Thailand'].map(place => (
                <li key={place}>
                  <Link to={`/tours?search=${place}`} className="text-slate-400 hover:text-orange-400 transition-colors text-sm">{place}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>📍 123 Travel Street, Mohali, India</li>
              <li>📞 +91 62993 94952</li>
              <li>✉️ rohit@travelnest.ai</li>
              <li>🕐 Mon–Sat: 9 AM – 8 PM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <p>© 2026 TravelNest AI. All rights reserved.</p>
          <p>Rohit@travelnest.ai</p>
          <p>Made with ❤️ for explorers worldwide</p>
        </div>
      </div>
    </footer>
  )
}
