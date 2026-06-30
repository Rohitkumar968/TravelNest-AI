import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/login', { email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed'
          set({ error: msg, isLoading: false })
          return { success: false, message: msg }
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/signup', { name, email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.message || 'Signup failed'
          set({ error: msg, isLoading: false })
          return { success: false, message: msg }
        }
      },

      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },

      updateProfile: async (data) => {
        try {
          const res = await api.put('/auth/profile', data)
          set({ user: res.data.user })
          return { success: true }
        } catch (err) {
          return { success: false, message: err.response?.data?.message }
        }
      },

      initAuth: () => {
        const { token } = get()
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      }
    }),
    {
      name: 'travelnest-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export default useAuthStore
