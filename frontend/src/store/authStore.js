import { create } from 'zustand';
import { authApi } from '../api/auth';

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] ||
                  err.response?.data?.detail ||
                  (typeof err.response?.data === 'string' ? err.response?.data : 'Ошибка авторизации');
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(userData);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      let msg = 'Ошибка регистрации';
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const firstKey = Object.keys(err.response.data)[0];
          const val = err.response.data[firstKey];
          msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
        } else {
          msg = err.response.data;
        }
      }
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    if (!localStorage.getItem('access_token')) return;
    try {
      const user = await authApi.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (err) {
      // Handled by client interceptor if 401
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await authApi.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.email?.[0] || 'Ошибка обновления профиля';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },
}));

// Listen for global logout event from client.js
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().logout();
  });
}
