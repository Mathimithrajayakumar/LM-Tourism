// src/services/storage.js
// Local storage helpers — used for guests and as offline fallback.
// Firestore is the source of truth when a user is logged in.

const KEYS = {
  FAVORITES:            'lm_tourism_favorites',
  THEME:                'lm_tourism_theme',
  USER:                 'lm_tourism_user',
  LANGUAGE:             'lm_tourism_language',
  NOTIFICATIONS:        'lm_tourism_notifications',
  REMEMBER_ME:          'lm_tourism_remember_me',
};

export const StorageService = {
  // ─── Favourites (guest / offline fallback) ────────────────────────────────
  getFavorites() {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setFavorites(arr) {
    if (!Array.isArray(arr)) return;
    const unique = Array.from(new Set(arr));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(unique));
  },

  toggleFavorite(id) {
    if (!id) return this.getFavorites();
    const favs  = this.getFavorites();
    const index = favs.indexOf(id);
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(id);
    }
    const unique = Array.from(new Set(favs));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(unique));
    return unique;
  },

  isFavorite(id) {
    if (!id) return false;
    return this.getFavorites().includes(id);
  },

  // ─── Theme ────────────────────────────────────────────────────────────────
  getTheme() {
    return localStorage.getItem(KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(KEYS.THEME, theme);
    document.body.className = `theme-${theme}`;
  },

  // ─── User (legacy guest profile) ─────────────────────────────────────────
  getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : { name: 'Explorer', email: 'guest@lmtourism.app', isGuest: true };
    } catch {
      return { name: 'Explorer', email: 'guest@lmtourism.app', isGuest: true };
    }
  },

  setUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem(KEYS.USER);
  },

  // ─── Language ─────────────────────────────────────────────────────────────
  getLanguage() {
    return localStorage.getItem(KEYS.LANGUAGE) || 'en';
  },

  setLanguage(lang) {
    localStorage.setItem(KEYS.LANGUAGE, lang);
  },

  // ─── Notifications ────────────────────────────────────────────────────────
  getNotifications() {
    const val = localStorage.getItem(KEYS.NOTIFICATIONS);
    return val === null ? true : val === 'true';
  },

  setNotifications(enabled) {
    localStorage.setItem(KEYS.NOTIFICATIONS, String(enabled));
  },

  // ─── Remember Me ──────────────────────────────────────────────────────────
  getRememberMe() {
    return localStorage.getItem(KEYS.REMEMBER_ME) === 'true';
  },

  setRememberMe(val) {
    localStorage.setItem(KEYS.REMEMBER_ME, String(val));
  },
};
