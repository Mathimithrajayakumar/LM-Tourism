import { StorageService }          from '../services/storage.js';
import { t, getVoiceLangCode }   from '../services/i18n.js';
import { incrementAiChatCount }    from '../services/userProfile.js';
import { ATTRACTIONS }             from '../data/attractions.js';
import { MONUMENTS }               from '../data/monuments.js';
import { TourismApiService }       from '../services/tourismApi.js';
import { fetchAiGuideResponse, setActiveAiDestination, sendChatMessageToAi, getAiChatMessages, isAiThinking } from '../services/aiService.js';
import { renderCrowdVisualization } from './CrowdVisualization.js';
import {
  isSpeechRecognitionSupported,
  requestMicrophonePermission,
  startVoiceRecognition,
  stopVoiceRecognition
} from '../services/voiceService.js';
import {
  initArViewer,
  destroyArViewer,
  resetArCameraView,
  zoomArCamera,
  toggleAutoRotate
} from './ArViewer.js';

window.reset3dView = () => resetArCameraView();
window.zoom3dView = (delta) => zoomArCamera(delta);
window.toggle3dSpin = () => toggleAutoRotate();
window.retry3dViewer = () => {
  const root = document.getElementById('ar-viewer-root');
  const monId = window.__appState?.selectedMonumentId;
  const m = (window.__appState?.monuments || []).find(item => item.id === monId);
  if (root && m) initArViewer(m.id, root, m);
};

let activeTab          = 'about';
let chatMessages       = [];
let ttsState           = 'idle'; // 'idle' | 'playing' | 'paused'
let currentMonumentId  = null;
let isAiLoading        = false;
let isVoiceListening   = false;
let voiceError         = null;

// ─── TTS Engine ───────────────────────────────────────────────────────────────
let _utterance = null;
let _currentTtsText = null;

function _ttsPlay(text) {
  if (!window.speechSynthesis || !text) return;

  if (ttsState === 'paused' && _currentTtsText === text) {
    _ttsResume();
    return;
  }

  window.speechSynthesis.cancel();
  _currentTtsText = text;

  _utterance = new SpeechSynthesisUtterance(text);
  _utterance.rate  = 0.9;
  _utterance.pitch = 1.0;
  _utterance.lang  = getVoiceLangCode();

  _utterance.onstart  = () => { ttsState = 'playing'; if (window.renderApp) window.renderApp(); };
  _utterance.onpause  = () => { ttsState = 'paused'; if (window.renderApp) window.renderApp(); };
  _utterance.onresume = () => { ttsState = 'playing'; if (window.renderApp) window.renderApp(); };
  _utterance.onend    = () => { ttsState = 'idle'; _currentTtsText = null; if (window.renderApp) window.renderApp(); };
  _utterance.onerror  = () => { ttsState = 'idle'; _currentTtsText = null; if (window.renderApp) window.renderApp(); };

  window.speechSynthesis.speak(_utterance);
  ttsState = 'playing';
  if (window.renderApp) window.renderApp();
}

function _ttsPause() {
  if (window.speechSynthesis && (ttsState === 'playing' || window.speechSynthesis.speaking)) {
    window.speechSynthesis.pause();
    ttsState = 'paused';
    if (window.renderApp) window.renderApp();
  }
}

function _ttsResume() {
  if (window.speechSynthesis) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (!window.speechSynthesis.speaking && _currentTtsText) {
      _ttsPlay(_currentTtsText);
      return;
    }
    ttsState = 'playing';
    if (window.renderApp) window.renderApp();
  }
}

function _ttsStop(skipRender = false) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  ttsState = 'idle';
  _currentTtsText = null;
  if (!skipRender && window.renderApp) window.renderApp();
}

window._ttsPause  = _ttsPause;
window._ttsResume = _ttsResume;
window._ttsStop   = _ttsStop;

// ─── Main Render ──────────────────────────────────────────────────────────────
export function renderMonumentDetailModal(monumentId, monuments = [], currentUser = null) {
  let m = TourismApiService.getPlaceById(monumentId)
    || (monuments || []).find(item => item.id === monumentId || item.name === monumentId)
    || (MONUMENTS || []).find(item => item.id === monumentId || item.name === monumentId)
    || (ATTRACTIONS || []).find(item => item.id === monumentId || item.name === monumentId)
    || (TourismApiService.getAllDestinations() || []).find(item => item.id === monumentId || (item.name && item.name.toLowerCase().includes(String(monumentId).toLowerCase())));

  if (!m && monuments.length > 0) m = monuments[0];
  if (!m) return '';

  if (currentMonumentId !== monumentId) {
    currentMonumentId = monumentId;
    setActiveAiDestination(m);
    _ttsStop(true);
    stopVoiceRecognition();
    isVoiceListening = false;
    voiceError = null;
    chatMessages = [
      { sender: 'ai', text: `🏛️ Greetings! I am your AI Tour Guide for **${m.name}** in ${m.city}, ${m.state || m.country}.\n\nAsk me anything about its history, architectural features, optimal visiting hours, crowd levels, ticket prices, or fun facts!` }
    ];
  }

  const bookmarks = StorageService.getFavorites();
  const isFav     = bookmarks.includes(m.id);

  const ttsText = `${m.name}. Located in ${m.city}, ${m.state || m.country}. ${m.description} ${m.history || ''}`;
  const nearbyPlaces = TourismApiService.getNearbyDestinations(m, 4);

  return `
    <div class="modal-backdrop fade-in" style="position: fixed; inset: 0; z-index: 1000; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px;" onclick="if(event.target === this) window.closeModal();">
      <div class="modal-container scale-up" style="max-width: 920px; width: 100%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius-xl); border: 1px solid #cbd5e1; background: #ffffff !important; color: #0f172a !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        
        <!-- Modal Header with Image Banner -->
        <div style="position: relative; height: 260px; min-height: 260px; overflow: hidden;">
          <img src="${m.imageUrl}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.88) 0%, transparent 60%);"></div>

          <!-- Close Button -->
          <button 
            onclick="window.closeModal()" 
            style="position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); z-index: 10;"
          >
            <span class="material-symbols-rounded">close</span>
          </button>

          <!-- UNESCO & Category Badges -->
          <div style="position: absolute; top: 16px; left: 16px; display: flex; gap: 8px;">
            ${m.unescoStatus ? `
              <span style="background: #f59e0b; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; backdrop-filter: blur(4px);">
                <span class="material-symbols-rounded" style="font-size: 14px;">account_balance</span>
                <span>UNESCO World Heritage</span>
              </span>
            ` : ''}
            <span style="background: rgba(255,255,255,0.25); color: white; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; backdrop-filter: blur(4px);">
              ${m.category}
            </span>
          </div>

          <!-- Header info overlay -->
          <div style="position: absolute; bottom: 16px; left: 20px; right: 20px; color: white;">
            <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;">
              <div>
                <h2 style="font-size: 1.7rem; font-weight: 800; font-family: var(--font-heading); margin-bottom: 2px; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                  ${m.name}
                </h2>
                <p style="font-size: 0.9rem; opacity: 0.95; margin: 0; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
                  📍 ${m.city}, ${m.state} (${m.country}) | ⭐ ${m.rating} (${m.reviewsCount}+ reviews)
                </p>
              </div>

              <!-- Favorite Button -->
              <button 
                class="fav-btn ${isFav ? 'active' : ''}" 
                style="position: static; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(6px); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;" 
                onclick="event.stopPropagation(); window.toggleFavorite('${m.id}');"
              >
                <span class="material-symbols-rounded" style="font-variation-settings:'FILL' ${isFav ? 1 : 0}; font-size: 22px; color: ${isFav ? '#ef4444' : 'white'};">favorite</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Key Stats Row -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: center; padding: 10px 16px;">
          <div style="border-right: 1px solid #e2e8f0; padding: 4px;">
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rating</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #d97706; margin-top: 2px;">⭐ ${m.rating}</div>
          </div>
          <div style="border-right: 1px solid #e2e8f0; padding: 4px;">
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Ticket</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #059669; margin-top: 2px;">${m.ticketInfo?.isFree ? 'FREE' : `₹${m.ticketInfo?.adult}`}</div>
          </div>
          <div style="border-right: 1px solid #e2e8f0; padding: 4px;">
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Opens</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #2563eb; margin-top: 2px;">${m.openingTime}</div>
          </div>
          <div style="padding: 4px;">
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Crowd</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #d97706; margin-top: 2px;">${m.crowdLevel}</div>
          </div>
        </div>

        <!-- Action Pills Bar -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 16px; background: #ffffff; border-bottom: 1px solid #e2e8f0; scrollbar-width: none;">
          <button class="btn btn-primary" onclick="window.openBookingModal('${m.id}')" style="border-radius: var(--radius-full); font-weight: 800; font-size: 0.825rem; padding: 6px 16px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; background: #2563eb; color: white;">
            <span class="material-symbols-rounded" style="font-size: 16px;">confirmation_number</span>
            <span>Book Tickets</span>
          </button>

          ${ttsState === 'idle' ? `
            <button class="btn btn-secondary" onclick="window.toggleAudioGuide(${JSON.stringify(ttsText)})" style="border-radius: var(--radius-full); font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;">
              <span class="material-symbols-rounded" style="font-size: 16px;">volume_up</span>
              <span>Listen Guide</span>
            </button>
          ` : ttsState === 'playing' ? `
            <button class="btn" onclick="window.pauseAudioGuide()" style="border-radius: var(--radius-full); background: #f59e0b; color: white; font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
              <span class="material-symbols-rounded" style="font-size: 16px;">pause_circle</span>
              <span>Pause Audio</span>
            </button>
          ` : `
            <button class="btn" onclick="window.toggleAudioGuide(${JSON.stringify(ttsText)})" style="border-radius: var(--radius-full); background: #10b981; color: white; font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
              <span class="material-symbols-rounded" style="font-size: 16px;">play_circle</span>
              <span>Resume</span>
            </button>
          `}

          <button class="btn" onclick="window.setDetailTab('ai')" style="border-radius: var(--radius-full); background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #bfdbfe;">
            <span class="material-symbols-rounded" style="font-size: 16px; color: #2563eb;">smart_toy</span>
            <span>Ask AI Guide</span>
          </button>

          <button class="btn" onclick="window.openArModal('${m.id}')" style="border-radius: var(--radius-full); background: #fdf2f8; color: #db2777; font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #fbcfe8;">
            <span class="material-symbols-rounded" style="font-size: 16px;">view_in_ar</span>
            <span>3D AR View</span>
          </button>

          <button class="btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('${m.name} ${m.city} ${m.country}'), '_blank')" style="border-radius: var(--radius-full); background: #ecfdf5; color: #047857; font-weight: 700; font-size: 0.825rem; padding: 6px 14px; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #a7f3d0;">
            <span class="material-symbols-rounded" style="font-size: 16px;">directions</span>
            <span>Map Directions</span>
          </button>
        </div>

        <!-- Detail Tabs Navigation Bar -->
        <div style="display: flex; border-bottom: 1px solid #cbd5e1; background: #f1f5f9; overflow-x: auto; scrollbar-width: none;">
          <button onclick="window.setDetailTab('about')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'about' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'about' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'about' ? '#2563eb' : '#475569'}; white-space: nowrap;">Overview</button>
          <button onclick="window.setDetailTab('history')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'history' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'history' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'history' ? '#2563eb' : '#475569'}; white-space: nowrap;">History</button>
          <button onclick="window.setDetailTab('architecture')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'architecture' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'architecture' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'architecture' ? '#2563eb' : '#475569'}; white-space: nowrap;">${m.categoryDetails?.type === 'heritage' ? 'Architecture' : 'Highlights'}</button>
          <button onclick="window.setDetailTab('visitor')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'visitor' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'visitor' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'visitor' ? '#2563eb' : '#475569'}; white-space: nowrap;">Timings & Crowd</button>
          <button onclick="window.setDetailTab('besttime')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'besttime' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'besttime' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'besttime' ? '#2563eb' : '#475569'}; white-space: nowrap;">Best Time</button>
          <button onclick="window.setDetailTab('tickets')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'tickets' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'tickets' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'tickets' ? '#2563eb' : '#475569'}; white-space: nowrap;">Tickets</button>
          <button onclick="window.setDetailTab('see')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'see' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'see' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'see' ? '#2563eb' : '#475569'}; white-space: nowrap;">Things to See</button>
          <button onclick="window.setDetailTab('nearby')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'nearby' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'nearby' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'nearby' ? '#2563eb' : '#475569'}; white-space: nowrap;">Nearby</button>
          <button onclick="window.setDetailTab('tips')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'tips' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'tips' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'tips' ? '#2563eb' : '#475569'}; white-space: nowrap;">Travel Tips</button>
          <button onclick="window.setDetailTab('ai')" style="flex: 1; padding: 12px 14px; border: none; background: ${activeTab === 'ai' ? '#ffffff' : 'transparent'}; font-weight: 800; font-size: 0.825rem; cursor: pointer; border-bottom: 3px solid ${activeTab === 'ai' ? '#2563eb' : 'transparent'}; color: ${activeTab === 'ai' ? '#2563eb' : '#475569'}; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
            <span class="material-symbols-rounded" style="font-size: 16px; color: #2563eb;">smart_toy</span>
            <span>AI Guide</span>
          </button>
        </div>

        <!-- Scrollable Body Content -->
        <div style="flex: 1; overflow-y: auto; padding: 20px; background: #ffffff; color: #0f172a;">
          ${renderTabBodyContent(m, activeTab, nearbyPlaces)}
        </div>

      </div>
    </div>
  `;
}

function renderTabBodyContent(m, tab, nearbyPlaces) {
  // 1. OVERVIEW TAB
  if (tab === 'about') {
    return `
      <div style="display: flex; flex-direction: column; gap: 18px; color: #0f172a;">
        <!-- Detailed Story Description -->
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a; font-family: var(--font-heading);">About Destination</h4>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin-bottom: 12px;">
            ${m.description}
          </p>
        </div>

        <!-- Why Famous Callout Card -->
        <div style="padding: 16px; border-radius: var(--radius-lg); background: #eff6ff; border: 1px solid #bfdbfe;">
          <h4 style="font-size: 1rem; font-weight: 800; color: #1d4ed8; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded">stars</span>
            <span>Why ${m.name} is Famous</span>
          </h4>
          <p style="font-size: 0.9rem; color: #1e3a8a; line-height: 1.5; margin: 0;">
            ${m.whyFamous}
          </p>
        </div>

        <!-- Cultural & Historical Significance -->
        <div style="padding: 16px; border-radius: var(--radius-lg); background: #f5f3ff; border: 1px solid #ddd6fe;">
          <h4 style="font-size: 1rem; font-weight: 800; color: #6d28d9; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="color: #7c3aed;">history_edu</span>
            <span>Cultural &amp; Historical Significance</span>
          </h4>
          <p style="font-size: 0.9rem; color: #4c1d95; line-height: 1.5; margin: 0;">
            ${m.culturalSignificance}
          </p>
        </div>

        <!-- Key Highlights Grid -->
        <div>
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 10px; color: #0f172a;">Important Highlights</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            ${m.importantHighlights.map(h => `
              <div style="padding: 12px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0; font-size: 0.875rem; color: #0f172a; display: flex; align-items: flex-start; gap: 8px;">
                <span class="material-symbols-rounded" style="color: #10b981; font-size: 18px; margin-top: 2px;">check_circle</span>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Duration, Best Season & Traveler Suitability ("Best for:") -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 4px;">
          <div style="padding: 14px; background: #f8fafc; border-radius: var(--radius-lg); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">RECOMMENDED DURATION</div>
            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-top: 4px;">⏱️ ${m.avgVisitDuration}</div>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: var(--radius-lg); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">BEST SEASON TO VISIT</div>
            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-top: 4px;">🌤️ ${m.bestSeason || 'October to March'}</div>
          </div>
        </div>

        <!-- Traveller Suitability ("Best for:") -->
        <div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Best Suitable For:</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${m.suitableTravellerTypes.map(t => `
              <span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 16px; font-weight: 700; font-size: 0.8rem; border: 1px solid #bfdbfe;">
                🏷️ ${t}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 2. HISTORY TAB & TIMELINE
  if (tab === 'history') {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px; color: #0f172a;">
        <div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Historical Background</h4>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">
            ${m.history}
          </p>
        </div>

        <!-- Timeline Flowchart -->
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="color: #2563eb;">timeline</span>
            <span>Historical Timeline &amp; Key Eras</span>
          </h4>

          <div style="display: flex; flex-direction: column; gap: 12px; position: relative; padding-left: 20px; border-left: 3px solid #2563eb;">
            ${m.historyTimeline.map((item, idx) => `
              <div style="position: relative; padding: 12px 16px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
                <div style="position: absolute; left: -28px; top: 16px; width: 14px; height: 14px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff;"></div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase;">
                  ${item.era}
                </div>
                <div style="font-size: 0.9rem; color: #0f172a; margin-top: 4px; line-height: 1.4;">
                  ${item.detail}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 3. ARCHITECTURE / CULTURE TAB (Category-Adaptive)
  if (tab === 'architecture') {
    const c = m.categoryDetails || {};
    if (c.type === 'heritage') {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px; color: #0f172a;">
          <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="color: #2563eb;">architecture</span>
              <span>Architectural Style &amp; Construction</span>
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem; color: #334155;">
              <div><strong style="color: #0f172a;">Style:</strong> ${c.architecturalStyle || m.architecture}</div>
              <div><strong style="color: #0f172a;">Built By:</strong> ${c.builtBy || m.builtBy}</div>
              <div><strong style="color: #0f172a;">Era / Year:</strong> ${c.constructionEra || m.builtYear || m.year}</div>
              <div><strong style="color: #0f172a;">Materials:</strong> ${c.materials}</div>
            </div>
          </div>

          <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Key Sculptures &amp; Artwork</h4>
            <p style="font-size: 0.9rem; color: #334155; margin: 0;">${c.sculpturesArtwork}</p>
          </div>

          <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Engineering Feats &amp; Design Highlights</h4>
            <p style="font-size: 0.9rem; color: #334155; margin: 0;">${c.engineeringFeats}</p>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display: flex; flex-direction: column; gap: 16px; color: #0f172a;">
          <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="color: #10b981;">thermostat</span>
              <span>Weather &amp; Natural Atmosphere</span>
            </h4>
            <p style="font-size: 0.9rem; color: #334155; margin: 0;">${c.weatherInfo}</p>
          </div>

          <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
            <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: #0f172a;">Top Activities &amp; Viewpoints</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: #334155;">
              ${(c.topActivities || []).map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  }

  // 4. VISITOR INFORMATION & CROWD DENSITY TAB
  if (tab === 'visitor') {
    return `
      <div style="display: flex; flex-direction: column; gap: 18px; color: #0f172a;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">OPENING HOURS</div>
            <div style="font-size: 1rem; font-weight: 800; color: #059669; margin-top: 4px;">${m.openingTime} – ${m.closingTime}</div>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">DAYS OPEN</div>
            <div style="font-size: 1rem; font-weight: 800; color: #2563eb; margin-top: 4px;">${m.daysOpen}</div>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">PEAK HOURS TO AVOID</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #dc2626; margin-top: 4px;">${m.peakHours}</div>
          </div>
        </div>

        <!-- Crowd Density Chart -->
        <div style="padding: 18px; border-radius: var(--radius-lg); background: #ffffff; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h4 style="font-size: 1rem; font-weight: 800; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="color: #f59e0b;">group</span>
              <span>Visitor Crowd Density Pattern</span>
            </h4>
            <span style="font-size: 0.75rem; font-weight: 700; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 12px;">
              ℹ️ Estimated crowd pattern
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
            ${m.crowdByTime.map(item => {
              const lvl = item.level.toLowerCase();
              const pct = lvl === 'high' ? 90 : lvl === 'medium' ? 55 : 25;
              const color = lvl === 'high' ? '#ef4444' : lvl === 'medium' ? '#f59e0b' : '#10b981';
              return `
                <div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem;">
                  <span style="width: 70px; font-weight: 700; color: #475569;">${item.time}</span>
                  <div style="flex: 1; height: 10px; border-radius: 5px; background: #e2e8f0; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 5px;"></div>
                  </div>
                  <span style="width: 80px; font-weight: 800; color: ${color}; text-align: right;">${item.level}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 5. SMART BEST TIME TO VISIT TAB
  if (tab === 'besttime') {
    const b = m.bestTimeToVisitReasoning || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 18px; color: #0f172a;">
        <div style="padding: 18px; border-radius: var(--radius-lg); background: #f0fdf4; border: 1px solid #bbf7d0;">
          <div style="font-size: 0.8rem; font-weight: 800; color: #166534; text-transform: uppercase;">RECOMMENDED VISITING WINDOW</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #14532d; margin-top: 4px;">
            🕒 ${b.recommendedWindow || m.lowCrowdHours}
          </div>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px; color: #0f172a;">Why Visit During This Window?</h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${(b.reasons || []).map(r => `
              <div style="padding: 12px 16px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 700; color: #0f172a;">
                <span class="material-symbols-rounded" style="color: #10b981;">task_alt</span>
                <span>${r}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 6. TICKETS & PRICING MATRIX TAB
  if (tab === 'tickets') {
    const t = m.ticketInfo || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 18px; color: #0f172a;">
        <div style="padding: 16px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="color: #059669;">confirmation_number</span>
              <span>Ticket Pricing Matrix</span>
            </h4>
            <span style="font-size: 0.75rem; font-weight: 800; background: ${t.isFree ? '#d1fae5' : '#dbeafe'}; color: ${t.isFree ? '#065f46' : '#1e40af'}; padding: 3px 10px; border-radius: 12px;">
              ${t.isFree ? 'Free Admission' : `${t.priceType} Rates`}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px;">
            <div style="padding: 12px; background: #ffffff; border-radius: var(--radius-md); text-align: center; border: 1px solid #cbd5e1;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">ADULT</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #059669; margin-top: 2px;">${t.isFree ? 'FREE' : `₹${t.adult}`}</div>
            </div>
            <div style="padding: 12px; background: #ffffff; border-radius: var(--radius-md); text-align: center; border: 1px solid #cbd5e1;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">CHILD</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #059669; margin-top: 2px;">${t.isFree ? 'FREE' : `₹${t.child}`}</div>
            </div>
            <div style="padding: 12px; background: #ffffff; border-radius: var(--radius-md); text-align: center; border: 1px solid #cbd5e1;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">SENIOR / STUDENT</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #2563eb; margin-top: 2px;">${t.isFree ? 'FREE' : `₹${t.senior}`}</div>
            </div>
            <div style="padding: 12px; background: #ffffff; border-radius: var(--radius-md); text-align: center; border: 1px solid #cbd5e1;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b;">FOREIGN VISITOR</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #8b5cf6; margin-top: 2px;">${t.isFree ? 'FREE' : `₹${t.foreigner}`}</div>
            </div>
          </div>
        </div>

        <!-- Additional Fees -->
        <div style="padding: 14px; border-radius: var(--radius-lg); background: #f8fafc; border: 1px solid #e2e8f0;">
          <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Additional Charges &amp; Add-ons</div>
          <div style="display: flex; gap: 16px; font-size: 0.85rem; color: #334155;">
            <span>📷 Camera Fee: <strong>₹${t.cameraFee}</strong></span>
            <span>🅿️ Parking: <strong>₹${t.parkingFee}</strong></span>
            <span>👨‍🏫 Guided Tour: <strong>₹${t.guideFee}</strong></span>
          </div>
        </div>

        <button class="btn btn-primary" onclick="window.openBookingModal('${m.id}')" style="padding: 14px; border-radius: var(--radius-full); font-weight: 800; font-size: 1rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #2563eb; color: white;">
          <span class="material-symbols-rounded">confirmation_number</span>
          <span>Book Tickets for ${m.name}</span>
        </button>
      </div>
    `;
  }

  // 7. THINGS TO SEE & DO TAB
  if (tab === 'see') {
    return `
      <div style="display: flex; flex-direction: column; gap: 18px; color: #0f172a;">
        <div>
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 10px; color: #0f172a;">Must-See Highlights &amp; Structures</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${m.thingsToSee.map(spot => `
              <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0; font-size: 0.9rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-rounded" style="color: #2563eb;">photo_camera</span>
                <span>${spot}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 10px; color: #0f172a;">Recommended Activities</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${m.thingsToDo.map(act => `
              <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0; font-size: 0.9rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-rounded" style="color: #10b981;">explore</span>
                <span>${act}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 8. NEARBY PLACES TAB
  if (tab === 'nearby') {
    return `
      <div style="display: flex; flex-direction: column; gap: 14px; color: #0f172a;">
        <h4 style="font-size: 1rem; font-weight: 800; color: #0f172a;">Geographically Nearby Destinations</h4>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${nearbyPlaces.map(p => `
            <div style="display: flex; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 10px; align-items: center;">
              <img src="${p.imageUrl}" alt="${p.name}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
              <div style="flex: 1; min-width: 0;">
                <h5 style="margin: 0 0 2px 0; font-size: 0.95rem; color: #0f172a; font-weight: 800;">${p.name}</h5>
                <p style="margin: 0; font-size: 0.8rem; color: #475569;">📍 ${p.city} ${p.distanceKm ? `(${p.distanceKm} km away)` : ''}</p>
              </div>
              <button class="btn btn-primary" onclick="window.openMonumentDetail('${p.id}')" style="padding: 6px 14px; font-size: 0.8rem; border-radius: var(--radius-full); background: #2563eb; color: white;">
                View Details
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 9. TRAVEL TIPS TAB
  if (tab === 'tips') {
    const t = m.travelTips || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 12px; color: #0f172a;">
        <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
          <strong style="color: #2563eb;">👕 Clothing &amp; Attire:</strong> ${t.wear}
        </div>
        <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
          <strong style="color: #d97706;">🎒 What to Carry:</strong> ${t.carry}
        </div>
        <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
          <strong style="color: #059669;">📸 Photography Guidelines:</strong> ${t.photography}
        </div>
        <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
          <strong style="color: #7c3aed;">☸️ Cultural Etiquette:</strong> ${t.etiquette}
        </div>
        <div style="padding: 14px; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #e2e8f0;">
          <strong style="color: #db2777;">♿ Accessibility &amp; Facilities:</strong> ${t.accessibility}
        </div>
      </div>
    `;
  }

  // 10. AI GUIDE TAB
  if (tab === 'ai') {
    return `
      <div style="display: flex; flex-direction: column; gap: 12px; color: #0f172a;">
        <div style="margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; background: #eff6ff; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid #bfdbfe;">
          <span style="font-size: 0.825rem; color: #1e3a8a;">
            Context: <strong>${m.name} (${m.city}, ${m.state || m.country})</strong>
          </span>
          <button type="button" class="chip ${isVoiceListening ? 'active' : ''}" style="padding: 4px 10px; font-size: 0.75rem; background: ${isVoiceListening ? '#ef4444' : '#2563eb'}; color: white; border: none; cursor: pointer;" onclick="${isVoiceListening ? "window.stopVoiceInput()" : `window.startVoiceInput('${m.id}')`}">
            <span class="material-symbols-rounded" style="font-size: 16px;">${isVoiceListening ? 'mic_off' : 'mic'}</span>
            ${isVoiceListening ? 'Stop Listening' : 'Voice Input'}
          </button>
        </div>

        <!-- Dynamic Suggested Prompts -->
        <div style="display: flex; gap: 6px; overflow-x: auto; margin-bottom: 6px; scrollbar-width: none;">
          <button type="button" class="chip" onclick="window.sendPresetAiMsg('${m.id}', 'What is the complete history of ${m.name}?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; cursor: pointer;">
            📜 History of ${m.name}?
          </button>
          <button type="button" class="chip" onclick="window.sendPresetAiMsg('${m.id}', 'What should I see first at ${m.name}?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; cursor: pointer;">
            🌟 What should I see first?
          </button>
          <button type="button" class="chip" onclick="window.sendPresetAiMsg('${m.id}', 'When is the best time to visit ${m.name}?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; cursor: pointer;">
            🕒 Best time to visit?
          </button>
        </div>

        <div class="ai-chat-box" id="ai-chat-scroll" style="min-height: 220px; max-height: 300px; overflow-y: auto; padding: 12px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid #cbd5e1; display: flex; flex-direction: column; gap: 10px;">
          ${getAiChatMessages().map(msg => `
            <div class="chat-bubble ${msg.sender}" style="max-width: 85%; padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.875rem; line-height: 1.5; ${msg.sender === 'user' ? 'align-self: flex-end; background: #2563eb; color: white;' : msg.sender === 'ai' ? 'align-self: flex-start; background: #ffffff; border: 1px solid #cbd5e1; color: #0f172a;' : 'align-self: flex-start; background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5;'}">
              ${msg.sender === 'user' ? msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') : msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}
            </div>
          `).join('')}

          ${isAiThinking() ? `
            <div class="chat-bubble ai" style="align-self: flex-start; background: #ffffff; border: 1px solid #cbd5e1; color: #64748b; padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-rounded" style="animation: spin 1s linear infinite; font-size: 18px; color: #2563eb;">sync</span>
              <span>Consulting LM Tourism AI Assistant for ${m.name}...</span>
            </div>
          ` : ''}
        </div>

        <form onsubmit="event.preventDefault(); window.sendAiChatMessage('${m.id}');" style="display: flex; gap: 8px; margin-top: 8px;">
          <input id="ai-chat-input" type="text" placeholder="Ask AI Guide anything about ${m.name}..." style="flex: 1; padding: 10px 16px; border-radius: var(--radius-full); border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-size: 0.9rem;" ${isAiThinking() ? 'disabled' : ''} />
          <button type="submit" class="btn btn-primary" style="padding: 0 20px; font-weight: 700; border-radius: var(--radius-full); background: #2563eb; color: white;" ${isAiThinking() ? 'disabled' : ''}>Send</button>
        </form>

      </div>
    `;
  }

  // Default Fallback
  return `<div>Overview for ${m.name}</div>`;
}

export function setDetailTab(tab) {
  activeTab = tab;
  if (tab !== 'ai') return;
  setTimeout(() => {
    const box = document.getElementById('ai-chat-scroll');
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);
}

export function toggleAudioGuide(text) {
  if (!text) {
    _ttsStop();
    return;
  }

  if (ttsState === 'idle') {
    _ttsPlay(text);
  } else if (ttsState === 'paused') {
    _ttsResume();
  } else {
    _ttsPause();
  }
}

export function resetModal() {
  currentMonumentId = null;
  activeTab         = 'about';
  chatMessages      = [];
  _ttsStop();
  stopVoiceRecognition();
  destroyArViewer();
  isVoiceListening  = false;
  voiceError        = null;
  isAiLoading       = false;
}

// ─── AI CHAT MESSAGING ────────────────────────────────────────────────────────
export async function sendAiMessage(monumentId, text, uid = null, monuments = []) {
  if (!text || !text.trim() || isAiLoading) return;

  const m = monuments.find(item => item.id === monumentId)
    || (window.__appState?.monuments || []).find(item => item.id === monumentId);

  const userText = text.trim();
  chatMessages.push({ sender: 'user', text: userText });
  isAiLoading = true;
  if (window.renderApp) window.renderApp();

  if (uid) {
    incrementAiChatCount(uid).catch(() => {});
  }

  try {
    const aiReply = await fetchAiGuideResponse(m, userText, chatMessages);
    chatMessages.push({ sender: 'ai', text: aiReply });
    // Speak AI response if voice mode was used
    _ttsPlay(aiReply);
  } catch (err) {
    console.error('[AI Message Error]:', err);
    chatMessages.push({ sender: 'error', text: `Sorry, I encountered an issue getting details for ${m ? m.name : 'this monument'}. Please try again.` });
  } finally {
    isAiLoading = false;
    if (window.renderApp) window.renderApp();
    setTimeout(() => {
      const box = document.getElementById('ai-chat-scroll');
      if (box) box.scrollTop = box.scrollHeight;
    }, 60);
  }
}

// ─── VOICE INPUT HANDLERS ─────────────────────────────────────────────────────
export async function startVoiceInput(monumentId) {
  voiceError = null;

  if (!isSpeechRecognitionSupported()) {
    voiceError = 'Voice Speech Recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.';
    if (window.renderApp) window.renderApp();
    return;
  }

  const perm = await requestMicrophonePermission();
  if (!perm.granted) {
    voiceError = 'Microphone access denied. Please allow microphone permissions in browser settings to use voice search.';
    if (window.renderApp) window.renderApp();
    return;
  }

  isVoiceListening = true;
  if (window.renderApp) window.renderApp();

  startVoiceRecognition({
    onStart: () => {
      isVoiceListening = true;
      if (window.renderApp) window.renderApp();
    },
    onResult: (transcript) => {
      isVoiceListening = false;
      if (window.renderApp) window.renderApp();
      // Send speech-to-text to monument AI
      sendAiMessage(monumentId, transcript, window.__appState?.currentUser?.uid, window.__appState?.monuments);
    },
    onError: (errMsg) => {
      isVoiceListening = false;
      voiceError = errMsg;
      if (window.renderApp) window.renderApp();
    },
    onEnd: () => {
      isVoiceListening = false;
      if (window.renderApp) window.renderApp();
    }
  });
}

export function stopVoiceInput() {
  stopVoiceRecognition();
  isVoiceListening = false;
  if (window.renderApp) window.renderApp();
}

// ─── 3D AR VIEW MODAL ─────────────────────────────────────────────────────────
// Renders the full-screen AR shell. The actual 3D / WebXR content is injected
// into #ar-viewer-root by ArViewer.js after the DOM is ready.
export function render3dArModal(monumentObjOrName) {
  const m = typeof monumentObjOrName === 'object'
    ? monumentObjOrName
    : (window.__appState?.monuments || []).find(item => item.id === monumentObjOrName || item.name === monumentObjOrName);

  const name    = m ? m.name    : (monumentObjOrName || 'Monument');
  const city    = m ? m.city    : 'Heritage Site';
  const country = m ? (m.state || m.country) : 'Location';
  const imageUrl = m ? m.imageUrl : '';
  const year    = m ? (m.year > 0 ? `${m.year} CE` : 'Ancient Era') : 'Ancient Era';
  const rating  = m ? m.rating  : '4.8';
  const history = m ? (m.history || m.description || '') : '';

  // Boot AR viewer after the HTML is in the DOM
  setTimeout(() => {
    const root = document.getElementById('ar-viewer-root');
    if (root && m) {
      initArViewer(m.id, root, m);
    }
  }, 80);

  return `
    <div class="ar-modal-backdrop" onclick="if(event.target === this) window.closeModal();">
      <div class="ar-modal-container">

        <!-- HUD Header -->
        <div class="ar-hud-header">
          <div class="ar-status-pill">
            <span class="ar-status-dot scanning"></span>
            <span>Loading ${name} AR experience…</span>
          </div>
          <button class="ar-close-btn" onclick="window.closeModal()">
            <span class="material-symbols-rounded">close</span>
            Exit AR
          </button>
        </div>

        <!-- AR / 3D Viewer Root — ArViewer.js mounts here -->
        <div class="ar-viewport" id="ar-viewport">
          <div id="ar-viewer-root" style="position:absolute;inset:0;overflow:hidden;"></div>

          <!-- Bottom info card always visible as overlay -->
          <div class="ar-info-overlay-card">
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="ar-thumb-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />` : ''}
            <div style="flex:1;min-width:0;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <h3 style="font-size:1.1rem;margin:0;color:white;font-family:var(--font-display);line-height:1.2;">${name}</h3>
                <span style="color:#f59e0b;font-weight:700;font-size:0.85rem;white-space:nowrap;">★ ${rating}</span>
              </div>
              <p style="font-size:0.8rem;color:#cbd5e1;margin:3px 0 6px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📍 ${city}, ${country} • Built ${year}</p>
              ${history ? `<p style="font-size:0.75rem;color:#94a3b8;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${history}</p>` : ''}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

window.showAiChatTab = (monumentId) => {
  setDetailTab('ai');
  if (window.renderApp) window.renderApp();
};

window.sendAiChatMessage = (monumentId) => {
  const input = document.getElementById('ai-chat-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  const m = TourismApiService.getPlaceById(monumentId);
  sendChatMessageToAi(text, m);
};

window.sendPresetAiMsg = (monumentId, text) => {
  const input = document.getElementById('ai-chat-input');
  if (input) input.value = text;
  window.sendAiChatMessage(monumentId);
};


window.startVoiceInput = (monumentId) => startVoiceInput(monumentId);
window.stopVoiceInput = () => stopVoiceInput();

window.pauseAudioGuide = _ttsPause;
window.resumeAudioGuide = _ttsResume;
window.stopAudioGuide = _ttsStop;
window.toggleAudioGuide = toggleAudioGuide;

