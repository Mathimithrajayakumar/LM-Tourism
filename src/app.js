// src/app.js — Global LM Tourism Platform with Regional Tamil Nadu Module
// Main application entry point supporting Worldwide Monuments & Regional Tamil Nadu Experience.

import { renderHeader, renderBottomNav } from './components/Navigation.js';
import { renderHomeView }                from './components/HomeView.js';
import { renderExploreView, setExploreCountry, setExploreRegion, setExploreCategory, setExploreCity, setExploreSearch, resetExploreFilters } from './components/ExploreView.js';
import { renderStateSelectorView }       from './components/StateSelectorView.js';
import { renderTNDashboardView, setTNCategory, setTNCity, setTNSearch } from './components/TNDashboardView.js';
import { renderTripPlannerView }         from './components/TripPlannerView.js';
import { renderAiChatbotView }           from './components/AiChatbotView.js';
import { renderEmergencyView }           from './components/EmergencyView.js';
import { renderFavoritesView }           from './components/FavoritesView.js';
import { renderProfileSettingsView }     from './components/ProfileSettingsView.js';
import { renderPlaceDetailModal, setPlaceDetailTab } from './components/PlaceDetailModal.js';
import { renderMonumentDetailModal, setDetailTab } from './components/MonumentDetailModal.js';
import { renderCompareModal, setCompareTargets } from './components/CompareModal.js';

import {
  renderBookingModal,
  setBookingTarget,
  resetBookingState,
  updateBookingField,
  updateBookingFieldSilent,
  adjustAdults,
  adjustChildren,
  goToBookingStep,
  validateTouristDetails,
  setPaymentMethod,
  updatePaymentField,
  fillSampleUpi,
  processMockPayment,
  retryPayment,
} from './components/BookingModal.js';
import {
  render3dArModal,
  resetModal,
  toggleAudioGuide
} from './components/MonumentDetailModal.js';

import { renderAuthView }                from './components/AuthView.js';
import { StorageService }                from './services/storage.js';
import { onAuthChange, signOut }         from './services/auth.js';
import { fetchAllMonuments }             from './services/monuments.js';
import { TourismApiService }             from './services/tourismApi.js';
import { updateProfile, toggleBookmark, addSearchHistory } from './services/userProfile.js';
import { t, setLanguage, getLanguage, renderLanguageModal, LANGUAGES } from './services/i18n.js';

// ─── Application State ────────────────────────────────────────────────────────
export const appState = {
  currentUser: null,           // null = not logged in; object = authenticated user
  monuments:   [],             // Loaded global monuments + regional sites
  isLoading:   true,           // True while auth & dataset are resolving
  language:    StorageService.getLanguage() || 'en',
  currentTab:  'home',         // 'home' | 'explore' | 'tn' | 'state' | 'planner' | 'chatbot' | 'emergency' | 'favorites' | 'profile'
  activeModal: null,           // 'detail' | 'ar' | 'booking' | 'language' | null
  selectedPlaceId: null,
  selectedMonumentId: null,
  selectedAttractionId: null,
  currentArMonumentName: 'Taj Mahal',
};

// Expose appState to window for cross-module access
window.__appState = appState;

// Sync i18n language from stored preference on start
setLanguage(appState.language);

// ─── Core Render Loop ─────────────────────────────────────────────────────────
export function renderApp() {
  const appEl     = document.getElementById('app');
  const isDarkMode = StorageService.getTheme() === 'dark';

  // ── Loading Screen ──────────────────────────────────────────────────────────
  if (appState.isLoading) {
    appEl.innerHTML = `
      <div class="loading-screen">
        <div class="brand-icon" style="width:64px;height:64px;border-radius:20px;font-size:36px;">
          <span class="material-symbols-rounded" style="font-size:36px;">account_balance</span>
        </div>
        <p class="brand-title" style="font-size:1.5rem; margin-top:16px; font-weight:800;">LM Tourism</p>
        <div class="loading-dots" style="margin-top:24px;">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    return;
  }

  // ── Not Authenticated → Auth Screen ────────────────────────────────────────
  if (!appState.currentUser) {
    appEl.innerHTML = `
      ${renderHeader(appState.currentTab, isDarkMode)}
      <main style="flex:1;">
        ${renderAuthView()}
      </main>
    `;
    return;
  }

  // ── Authenticated → Main App View Switch ───────────────────────────────────
  let bodyContent = '';
  switch (appState.currentTab) {
    case 'home':
      bodyContent = renderHomeView(appState.monuments, appState.currentUser);
      break;
    case 'explore':
      bodyContent = renderExploreView(appState.monuments);
      break;
    case 'tn':
      bodyContent = renderTNDashboardView(appState.monuments);
      break;
    case 'state':
      bodyContent = renderStateSelectorView();
      break;
    case 'planner':
      bodyContent = renderTripPlannerView();
      break;
    case 'chatbot':
      bodyContent = renderAiChatbotView();
      break;
    case 'emergency':
      bodyContent = renderEmergencyView();
      break;
    case 'favorites':
      bodyContent = renderFavoritesView(appState.monuments, appState.currentUser);
      break;
    case 'profile':
      bodyContent = renderProfileSettingsView(appState.currentUser, appState.monuments.length);
      break;
    default:
      bodyContent = renderHomeView(appState.monuments, appState.currentUser);
  }

  // ── Modal Layer ─────────────────────────────────────────────────────────────

  let modalContent = '';
  if (appState.activeModal === 'detail') {
    const targetId = appState.selectedMonumentId || appState.selectedPlaceId;
    modalContent = renderMonumentDetailModal(targetId, appState.monuments, appState.currentUser);
  } else if (appState.activeModal === 'ar') {
    const selectedMon = appState.monuments.find(m => m.id === appState.selectedPlaceId || m.id === appState.selectedMonumentId)
      || appState.monuments.find(m => m.name === appState.currentArMonumentName)
      || appState.monuments[0];
    modalContent = render3dArModal(selectedMon || appState.currentArMonumentName);
  } else if (appState.activeModal === 'booking' && appState.selectedAttractionId) {
    modalContent = renderBookingModal(appState.selectedAttractionId);
  } else if (appState.activeModal === 'language') {
    modalContent = renderLanguageModal(appState.langSearchQuery || '');
  } else if (appState.activeModal === 'compare') {
    modalContent = renderCompareModal();
  }

  appEl.innerHTML = `
    ${renderHeader(appState.currentTab, isDarkMode)}
    <main style="flex:1;">
      ${bodyContent}
    </main>
    ${renderBottomNav(appState.currentTab)}
    ${modalContent}
  `;
}

window.renderApp = renderApp;

// ─── Compare Destinations Modal Window Handler ──────────────────────────────
window.openCompareModal = (id1 = 'taj-mahal', id2 = 'brihadeeswarar-temple') => {
  setCompareTargets(id1, id2);
  appState.activeModal = 'compare';
  renderApp();
};


// ─── Navigation Handlers ──────────────────────────────────────────────────────
window.navigateTo = (tab, searchQuery = '') => {
  appState.currentTab = tab;
  appState.activeModal = null; // Ensure modal is closed when navigating between tabs
  if (tab === 'explore') {
    if (searchQuery) {
      setExploreSearch(searchQuery);
      if (appState.currentUser?.uid) {
        addSearchHistory(appState.currentUser.uid, searchQuery).then(updated => {
          if (appState.currentUser) appState.currentUser.searchHistory = updated;
        });
      }
    } else {
      resetExploreFilters();
    }
  }
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.selectState = (stateId) => {
  const stateNameMap = {
    'tamilnadu': 'Tamil Nadu',
    'rajasthan': 'Rajasthan',
    'kerala': 'Kerala',
    'karnataka': 'Karnataka',
    'maharashtra': 'Maharashtra',
    'uttar-pradesh': 'Uttar Pradesh',
    'delhi': 'Delhi',
    'goa': 'Goa'
  };
  const sName = stateNameMap[stateId] || 'Tamil Nadu';
  setExploreCountry('India');
  setExploreRegion(sName);
  appState.currentTab = 'explore';
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ─── Explore Filters ──────────────────────────────────────────────────────────
window.setExploreCategory = (cat) => { setExploreCategory(cat); renderApp(); };
window.setExploreCity     = (city) => { setExploreCity(city); renderApp(); };
window.updateExploreSearch = (q)   => { setExploreSearch(q); renderApp(); };

// ─── TN Module Filters ────────────────────────────────────────────────────────
window.setTNCategory = (cat) => { setTNCategory(cat); renderApp(); };
window.setTNCity     = (city) => { setTNCity(city); renderApp(); };
window.updateTNSearch = (q)   => { setTNSearch(q); renderApp(); };
window.resetTNFilters = ()    => { setTNCategory('all'); setTNCity('All Cities'); setTNSearch(''); renderApp(); };

// ─── Modal Controls ────────────────────────────────────────────────────────────
window.openMonumentDetail = (id) => {
  appState.selectedMonumentId = id;
  appState.selectedPlaceId    = id;
  appState.activeModal        = 'detail';
  renderApp();
};

window.setDetailTab = (tab) => {
  setDetailTab(tab);
  setPlaceDetailTab(tab);
  renderApp();
};

window.openPlaceDetailModal = (id) => {
  appState.selectedPlaceId    = id;
  appState.selectedMonumentId = id;
  appState.activeModal        = 'detail';
  setDetailTab('about');
  setPlaceDetailTab('overview');
  renderApp();
};

window.openBookingModal = (targetId) => {
  setBookingTarget(targetId);
  appState.selectedAttractionId = targetId;
  appState.activeModal          = 'booking';
  renderApp();
};

window.openArModal = (placeIdOrName = null) => {
  let m = null;
  if (placeIdOrName) {
    m = appState.monuments.find(item => item.id === placeIdOrName || item.name === placeIdOrName);
  }
  if (!m && (appState.selectedPlaceId || appState.selectedMonumentId)) {
    m = appState.monuments.find(item => item.id === appState.selectedPlaceId || item.id === appState.selectedMonumentId);
  }
  if (!m && appState.monuments.length > 0) {
    m = appState.monuments[0];
  }
  if (m) {
    appState.selectedPlaceId = m.id;
    appState.selectedMonumentId = m.id;
    appState.currentArMonumentName = m.name;
  }
  appState.activeModal = 'ar';
  renderApp();
};

window.openAiGuideModal = () => {
  if (appState.selectedMonumentId || appState.selectedPlaceId) {
    appState.activeModal = 'detail';
    setDetailTab('ai');
  } else if (appState.monuments.length > 0) {
    appState.selectedMonumentId = appState.monuments[0].id;
    appState.activeModal        = 'detail';
    setDetailTab('ai');
  }
  renderApp();
};

window.closeModal = () => {
  appState.activeModal = null;
  resetModal();
  resetBookingState();
  renderApp();
};

// ─── Theme & Language ─────────────────────────────────────────────────────────
window.toggleTheme = () => {
  const next = StorageService.getTheme() === 'dark' ? 'light' : 'dark';
  StorageService.setTheme(next);
  if (appState.currentUser?.uid) {
    updateProfile(appState.currentUser.uid, { theme: next }).catch(() => {});
  }
  renderApp();
};

window.openLanguageModal = () => {
  appState.activeModal = 'language';
  appState.langSearchQuery = '';
  renderApp();
};

window.filterLanguageModal = (query) => {
  appState.langSearchQuery = query;
  renderApp();
  setTimeout(() => {
    const el = document.getElementById('lang-modal-search');
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, 10);
};

window.changeLanguage = (code) => {
  appState.language = code;
  setLanguage(code);
  StorageService.setLanguage(code);
  if (appState.currentUser) {
    appState.currentUser.preferredLanguage = code;
    if (appState.currentUser?.uid) {
      updateProfile(appState.currentUser.uid, { preferredLanguage: code }).catch(() => {});
    }
  }
  if (appState.activeModal === 'language') {
    appState.activeModal = null;
  }
  renderApp();
};

// ─── Booking Handlers ─────────────────────────────────────────────────────────
window.updateBookingField = (field, value) => { updateBookingField(field, value); renderApp(); };
window.updateBookingFieldSilent = (field, value) => { updateBookingFieldSilent(field, value); };
window.adjustAdults = (delta) => { adjustAdults(delta); renderApp(); };
window.adjustChildren = (delta) => { adjustChildren(delta); renderApp(); };
window.goToBookingStep = (stepNum) => { goToBookingStep(stepNum); renderApp(); };
window.validateAndGoToSummary = () => { validateTouristDetails(); renderApp(); };
window.setPaymentMethod = (method) => { setPaymentMethod(method); renderApp(); };
window.updatePaymentField = (field, value) => { updatePaymentField(field, value); };
window.fillSampleUpi = (sampleId) => { fillSampleUpi(sampleId); renderApp(); };
window.processMockPayment = (itemData) => { processMockPayment(itemData); };
window.retryPayment = () => { retryPayment(); renderApp(); };
window.startRazorpayPayment = (itemData) => { processMockPayment(itemData); };

// ─── Audio Guide ──────────────────────────────────────────────────────────────
window.toggleAudioGuide = (text) => {
  toggleAudioGuide(text);
  renderApp();
};

// ─── Favorites ────────────────────────────────────────────────────────────────
window.toggleFavorite = async (id) => {
  if (!id) return;
  const updatedFavs = StorageService.toggleFavorite(id);
  if (appState.currentUser) {
    appState.currentUser.bookmarks = updatedFavs;
    if (appState.currentUser.uid) {
      const isBookmarked = updatedFavs.includes(id);
      try {
        await toggleBookmark(appState.currentUser.uid, id, !isBookmarked);
      } catch (err) {
        console.warn('[app] Bookmark sync notice:', err);
      }
    }
  }
  renderApp();
};

// ─── Logout ───────────────────────────────────────────────────────────────────
window.logout = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error('[app] Logout error:', err);
  }
};

// ─── Initialization ───────────────────────────────────────────────────────────
async function initApp() {
  StorageService.setTheme(StorageService.getTheme());
  const initialLang = StorageService.getLanguage() || 'en';
  appState.language = initialLang;
  setLanguage(initialLang);

  // Initialize dataset & default guest user immediately to avoid blank screen
  try {
    appState.monuments = TourismApiService.getAllDestinations();
  } catch (e) {
    console.error('[app] Initial dataset import error:', e);
  }

  appState.currentUser = {
    uid: 'guest_explorer',
    name: 'Global Explorer',
    email: 'explorer@lmtourism.org',
    bookmarks: StorageService.getFavorites()
  };

  appState.isLoading = false;
  renderApp();

  onAuthChange(async (user) => {
    if (user) {
      const localFavs  = StorageService.getFavorites();
      const userFavs   = user.bookmarks || [];
      const mergedFavs = Array.from(new Set([...localFavs, ...userFavs]));

      StorageService.setFavorites(mergedFavs);
      user.bookmarks = mergedFavs;
      appState.currentUser = user;

      const lang = user.preferredLanguage || StorageService.getLanguage();
      appState.language = lang;
      setLanguage(lang);

      StorageService.setTheme(user.theme || StorageService.getTheme());

      try {
        const globalMons = await fetchAllMonuments();
        const allDestinations = TourismApiService.getAllDestinations();
        const existingIds = new Set(globalMons.map(m => m.id));
        const extraDest = allDestinations.filter(p => !existingIds.has(p.id));
        appState.monuments = [...globalMons, ...extraDest];
      } catch (err) {
        console.warn('[app] Remote monuments fetch fallback:', err);
        appState.monuments = TourismApiService.getAllDestinations();
      }
    }
    appState.isLoading = false;
    renderApp();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

