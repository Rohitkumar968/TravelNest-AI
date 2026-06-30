import { useState, useRef, useEffect } from 'react'
import { FiSend, FiZap, FiMapPin, FiDollarSign, FiCalendar, FiMessageCircle } from 'react-icons/fi'
import { MdAutoAwesome } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import api from '../utils/api'
import toast from 'react-hot-toast'

const QUICK_PROMPTS = [
  { label: '🏔️ Manali Trip', prompt: 'Plan a 5-day adventure trip to Manali under ₹15000 with itinerary' },
  { label: '🏖️ Goa Getaway', prompt: 'Plan a 4-day trip to Goa for 2 people under ₹20000' },
  { label: '🌏 Bali Escape', prompt: 'Plan a 7-day romantic trip to Bali under ₹80000 per person' },
  { label: '🕌 Rajasthan', prompt: 'Plan a 6-day royal Rajasthan tour including Jaipur, Jodhpur and Jaisalmer' },
]

export default function AIPlanner() {
  const [mode, setMode] = useState('planner') // 'planner' | 'chat'
  const [form, setForm] = useState({ location: '', budget: '', days: '', interests: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m your AI travel assistant. Ask me anything about travel — destinations, tips, budget planning, visa info, and more!' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateItinerary = async (e) => {
    e?.preventDefault()
    if (!form.location) { toast.error('Please enter a destination'); return }
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/ai/travel', form)
      setResult(res.data.response)
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickGenerate = async (prompt) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/ai/travel', { prompt })
      setResult(res.data.response)
    } catch (err) {
      toast.error('AI service error')
    } finally {
      setLoading(false)
    }
  }

  const sendChat = async (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return
    const userMsg = { role: 'user', content: chatInput }
    setMessages(m => [...m, userMsg])
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await api.post('/ai/chat', {
        messages: [...messages, userMsg].slice(-10) // last 10 messages
      })
      setMessages(m => [...m, { role: 'assistant', content: res.data.response }])
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: '❌ Sorry, I couldn\'t respond right now. Please try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <MdAutoAwesome /> Powered by Groq AI
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            AI Travel <span className="text-gradient">Planner</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Get personalized itineraries, travel tips, and recommendations powered by advanced AI.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-card gap-1">
            <button
              onClick={() => setMode('planner')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                mode === 'planner' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiZap size={16} /> Trip Planner
            </button>
            <button
              onClick={() => setMode('chat')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                mode === 'chat' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiMessageCircle size={16} /> AI Chat
            </button>
          </div>
        </div>

        {/* ===== TRIP PLANNER MODE ===== */}
        {mode === 'planner' && (
          <div className="space-y-6">
            {/* Quick prompts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_PROMPTS.map(qp => (
                <button
                  key={qp.label}
                  onClick={() => quickGenerate(qp.prompt)}
                  disabled={loading}
                  className="card p-3 text-sm text-center hover:-translate-y-0.5 transition-all duration-200 hover:border-orange-300 border border-transparent font-medium text-slate-700 dark:text-slate-300"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="card p-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Plan My Trip</h2>
              <form onSubmit={generateItinerary} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1 block">
                    <FiMapPin className="text-orange-500" size={14} /> Destination *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Manali, Bali, Switzerland, Thailand..."
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="input text-base"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1 block">
                    <FiDollarSign className="text-orange-500" size={14} /> Budget (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={form.budget}
                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1 block">
                    <FiCalendar className="text-orange-500" size={14} /> Number of Days
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    min="1" max="30"
                    value={form.days}
                    onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Interests & Preferences (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. adventure, local food, photography, history, beaches..."
                    value={form.interests}
                    onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center py-4 text-base">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating your perfect itinerary...
                      </>
                    ) : (
                      <><MdAutoAwesome size={18} /> Generate Itinerary</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className="card p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                    <MdAutoAwesome className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white">Your AI-Generated Itinerary</h3>
                    <p className="text-sm text-slate-500">Powered by Groq Llama AI</p>
                  </div>
                </div>
                <div className="ai-prose">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => { setResult(null); setForm({ location: '', budget: '', days: '', interests: '' }) }}
                    className="btn-secondary text-sm py-2.5"
                  >
                    Plan Another Trip
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(result).then(() => toast.success('Copied!'))}
                    className="btn-outline text-sm py-2.5"
                  >
                    Copy Itinerary
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CHAT MODE ===== */}
        {mode === 'chat' && (
          <div className="card overflow-hidden flex flex-col" style={{ height: '70vh' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MdAutoAwesome className="text-white" size={16} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="ai-prose text-sm">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                    <MdAutoAwesome className="text-white" size={16} />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-3 flex flex-wrap gap-2">
                {['Best time to visit Bali?', 'Budget trip to Europe?', 'Visa requirements for Thailand?', 'Hidden gems in India?'].map(q => (
                  <button key={q} onClick={() => { setChatInput(q); setTimeout(() => sendChat(), 0) }}
                    className="text-xs px-3 py-1.5 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-4">
              <form onSubmit={sendChat} className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask me anything about travel..."
                  className="input flex-1"
                  disabled={chatLoading}
                />
                <button type="submit" disabled={chatLoading || !chatInput.trim()}
                  className="btn-primary px-5 py-3 flex items-center gap-2 disabled:opacity-50">
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
