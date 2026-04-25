import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      setAuth: (user, token) => set({ user, token }),
      setProfile: (profile) => set({ profile }),
      logout: () => set({ user: null, token: null, profile: null }),
    }),
    { name: 'empowerher-auth' }
  )
)

export default useAuthStore
