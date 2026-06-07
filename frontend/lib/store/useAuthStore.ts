import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  admin: { _id: string; name: string; email: string } | null;
  login: (data: { token: string; _id: string; name: string; email: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      login: (data) => set({ token: data.token, admin: { _id: data._id, name: data.name, email: data.email } }),
      logout: () => {
        set({ token: null, admin: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminInfo');
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'adminInfo',
      partialize: (state) => ({ token: state.token, admin: state.admin }),
    }
  )
);
