// src/components/PlaceDetailModal.js
// Comprehensive Place Detail View Modal for Tamil Nadu Places

import { TourismApiService } from '../services/tourismApi.js';
import { getLanguage, t } from '../services/i18n.js';
import { fetchAiGuideResponse } from '../services/aiService.js';
import { renderCrowdVisualization } from './CrowdVisualization.js';

export let activePlaceDetailTab = 'overview'; // 'overview' | 'crowd' | 'tickets' | 'reach' | 'ai' | 'nearby'

export function setPlaceDetailTab(tab) {
  activePlaceDetailTab = tab;
}

export function renderPlaceDetailModal(placeId) {
  const place = TourismApiService.getPlaceById(placeId)
    || (TourismApiService.getAllDestinations() || []).find(item => item.id === placeId || (item.name && item.name.toLowerCase().includes(String(placeId).toLowerCase())));
  if (!place) return '';

  const currentLang = getLanguage();
  const crowdBadge = TourismApiService.getCrowdBadge(place.crowdLevel, currentLang);
  const displayName = currentLang === 'ta' ? (place.nameTa || place.name) : place.name;
  const description = currentLang === 'ta' && place.descriptionTa ? place.descriptionTa : place.description;

  return `
    <div class="modal-backdrop fade-in" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px;">
      <div 
        class="modal-content scale-up" 
        style="background: #ffffff; color: #0f172a; border-radius: var(--radius-xl); border: 1px solid #cbd5e1; max-width: 850px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);"
      >
        <!-- Modal Header with Image Banner -->
        <div style="position: relative; height: 240px; min-height: 240px; overflow: hidden;">
          <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);"></div>

          <!-- Close Button -->
          <button 
            onclick="window.closeModal()" 
            style="position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;"
          >
            <span class="material-symbols-rounded">close</span>
          </button>

          <!-- AR 3D View Launcher if available -->
          ${place.hasAr3d ? `
            <button 
              onclick="window.openArModal('${place.id}')"
              style="position: absolute; top: 16px; left: 16px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(236,72,153,0.4);"
            >
              <span class="material-symbols-rounded" style="font-size: 16px;">view_in_ar</span>
              <span>Launch 3D / AR View</span>
            </button>
          ` : ''}

          <!-- Header info overlay -->
          <div style="position: absolute; bottom: 16px; left: 20px; right: 20px; color: white;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                ${place.category}
              </span>
              <span style="background: ${crowdBadge.bg}; color: ${crowdBadge.color}; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800;">
                👥 ${crowdBadge.label}
              </span>
            </div>

            <h2 style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-heading); margin-bottom: 2px;">
              ${displayName}
            </h2>
            <p style="font-size: 0.85rem; opacity: 0.9;">
              📍 ${place.city}, ${place.district} District | Rating ⭐ ${place.rating} (${place.reviewsCount || 500}+ reviews)
            </p>
          </div>
        </div>

        <!-- Navigation Tabs inside Modal -->
        <div style="display: flex; border-bottom: 1px solid var(--border-subtle); background: var(--bg-secondary); overflow-x: auto;">
          <button 
            onclick="window.setPlaceDetailTab('overview')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'overview' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'overview' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap;"
          >
            Overview & Audio
          </button>
          <button 
            onclick="window.setPlaceDetailTab('crowd')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'crowd' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'crowd' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap;"
          >
            Timings & Crowd
          </button>
          <button 
            onclick="window.setPlaceDetailTab('tickets')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'tickets' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'tickets' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap;"
          >
            Ticket Pricing
          </button>
          <button 
            onclick="window.setPlaceDetailTab('reach')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'reach' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'reach' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap;"
          >
            How to Reach
          </button>
          <button 
            onclick="window.setPlaceDetailTab('nearby')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'nearby' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'nearby' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap;"
          >
            Map & Nearby
          </button>
          <button 
            onclick="window.setPlaceDetailTab('ai')"
            style="flex: 1; padding: 12px 16px; border: none; background: transparent; font-weight: 700; font-size: 0.85rem; cursor: pointer; border-bottom: 3px solid ${activePlaceDetailTab === 'ai' ? 'var(--color-primary)' : 'transparent'}; color: ${activePlaceDetailTab === 'ai' ? 'var(--color-primary)' : 'var(--text-muted)'}; white-space: nowrap; display: flex; align-items: center; justify-content: center; gap: 4px;"
          >
            <span class="material-symbols-rounded" style="font-size: 16px; color: #3b82f6;">smart_toy</span>
            <span>AI Guide</span>
          </button>
        </div>

        <!-- Modal Body Content Scrollable -->
        <div style="flex: 1; overflow-y: auto; padding: 20px;">
          ${renderPlaceTabContent(place, activePlaceDetailTab, currentLang)}
        </div>

        <!-- Modal Footer Actions Bar -->
        <div style="padding: 16px 20px; border-top: 1px solid var(--border-subtle); background: var(--bg-card); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
          <button 
            class="btn btn-secondary" 
            onclick="window.toggleAudioGuide('${place.audioGuideText || description}')"
            style="border-radius: var(--radius-full); font-weight: 700; padding: 10px 16px; display: flex; align-items: center; gap: 6px;"
          >
            <span class="material-symbols-rounded">volume_up</span>
            <span>Listen Audio Guide</span>
          </button>

          <div style="display: flex; gap: 10px;">
            <button 
              class="btn" 
              onclick="window.openGoogleMaps('${place.name}', ${place.locationCoords?.lat}, ${place.locationCoords?.lng})"
              style="background: rgba(59,130,246,0.1); color: var(--color-primary); border-radius: var(--radius-full); font-weight: 700; padding: 10px 16px; display: flex; align-items: center; gap: 6px;"
            >
              <span class="material-symbols-rounded">directions</span>
              <span>Navigate Map</span>
            </button>
            <button 
              class="btn btn-primary" 
              onclick="window.openBookingModal('${place.id}')"
              style="border-radius: var(--radius-full); font-weight: 800; padding: 10px 20px; display: flex; align-items: center; gap: 6px;"
            >
              <span class="material-symbols-rounded">confirmation_number</span>
              <span>Book Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPlaceTabContent(place, tab, lang) {
  if (tab === 'crowd') {
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${renderCrowdVisualization(place)}

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 6px;">🌤️ Best Season & Climate</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; margin: 0;">
            <strong>Best Time to Visit:</strong> ${place.bestTime || 'October to March'}<br/>
            <strong>Best Season:</strong> ${place.bestSeason || 'Winter Season'}
          </p>
        </div>
      </div>
    `;
  }

  if (tab === 'tickets') {
    const t = place.tickets || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="padding: 20px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: #059669;">confirmation_number</span>
            <span>Ticket Booking & Admission Fees</span>
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
            <div style="padding: 14px; background: var(--bg-card); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">ADULT TICKET</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #059669; margin-top: 4px;">
                ${t.isFree || t.adult === 0 ? 'FREE' : `₹${t.adult}`}
              </div>
            </div>

            <div style="padding: 14px; background: var(--bg-card); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">CHILDREN (UNDER 15)</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #059669; margin-top: 4px;">
                ${t.isFree || t.child === 0 ? 'FREE' : `₹${t.child}`}
              </div>
            </div>

            <div style="padding: 14px; background: var(--bg-card); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">FOREIGN VISITORS</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #3b82f6; margin-top: 4px;">
                ${t.isFree ? 'FREE' : t.foreigner ? `₹${t.foreigner}` : 'Standard'}
              </div>
            </div>
          </div>

          ${t.bookingWebsite ? `
            <div style="text-align: center; padding: 16px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.85rem; font-weight: 700; color: #059669; margin-bottom: 8px;">
                ✅ ${t.bookingStatusText || 'Official E-Ticket Portal Available'}
              </div>
              <a href="${t.bookingWebsite}" target="_blank" rel="noopener" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full); font-weight: 800; text-decoration: none;">
                <span class="material-symbols-rounded">open_in_new</span>
                <span>Open Official Booking Website</span>
              </a>
            </div>
          ` : `
            <div style="text-align: center; padding: 16px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle); color: var(--text-muted); font-size: 0.9rem; font-weight: 700;">
              ℹ️ Online booking unavailable — check ticket counter at venue.
            </div>
          `}
        </div>
      </div>
    `;
  }

  if (tab === 'reach') {
    const h = place.howToReach || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: #3b82f6;">flight_takeoff</span>
            <span>By Air</span>
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${h.air || 'Nearest airport connects via major Tamil Nadu flights.'}</p>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: #f59e0b;">train</span>
            <span>By Train</span>
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${h.rail || 'Direct trains available from Southern Railway routes.'}</p>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: #10b981;">directions_bus</span>
            <span>By Road</span>
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${h.road || 'Well connected via Tamil Nadu SETC & State Highways.'}</p>
        </div>
      </div>
    `;
  }

  if (tab === 'nearby') {
    const n = place.nearby || {};
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: #ef4444; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded">medical_services</span>
            <span>Nearby Emergency & Hospitals</span>
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);">
            ${(n.hospitals || ["Govt General Hospital", "District Emergency Hub"]).map(h=>`<li>${h}</li>`).join('')}
            <li>Police Contact: ${n.police || "100 / Local Station"}</li>
          </ul>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="color: #f59e0b;">restaurant</span>
            <span>Nearby Popular Restaurants</span>
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);">
            ${(n.restaurants || ["Local Authentic Mess", "Saravana Bhavan"]).map(r=>`<li>${r}</li>`).join('')}
          </ul>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="color: #3b82f6;">hotel</span>
            <span>Recommended Hotels & Stays</span>
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);">
            ${(n.hotels || ["Hotel Tamil Nadu", "Heritage Resort"]).map(h=>`<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  if (tab === 'ai') {
    if (!window.__placeChatHistory) window.__placeChatHistory = {};
    const msgs = window.__placeChatHistory[place.id] || [
      {
        sender: 'ai',
        text: `🏛️ **Welcome to ${place.name} AI Heritage Assistant!**\n\nI am your dedicated AI guide for **${place.name}** in ${place.city}. Ask me anything about its history, architecture, optimal visiting hours, crowd levels, ticket booking, or how to get here!`
      }
    ];

    return `
      <div style="display: flex; flex-direction: column; gap: 14px; height: 380px;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: white; padding: 12px 16px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: white;">
              <span class="material-symbols-rounded" style="font-size: 18px;">smart_toy</span>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 0.9rem;">Ask AI about ${place.name}</div>
              <div style="font-size: 0.75rem; color: #a7f3d0;">Powered by Google Gemini 1.5 Flash AI</div>
            </div>
          </div>
        </div>

        <!-- Quick Questions Chips -->
        <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          <button class="chip" onclick="window.sendPresetPlaceAiMsg('${place.id}', 'When is the best time to visit ${place.name}?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: var(--bg-secondary); border: 1px solid var(--border-subtle); cursor: pointer;">
            🕒 Best visiting time?
          </button>
          <button class="chip" onclick="window.sendPresetPlaceAiMsg('${place.id}', 'Who built ${place.name} and what is its history?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: var(--bg-secondary); border: 1px solid var(--border-subtle); cursor: pointer;">
            👑 Builder & History?
          </button>
          <button class="chip" onclick="window.sendPresetPlaceAiMsg('${place.id}', 'What is the ticket price for ${place.name}?')" style="white-space: nowrap; font-size: 0.75rem; font-weight: 700; background: var(--bg-secondary); border: 1px solid var(--border-subtle); cursor: pointer;">
            🎟️ Ticket fees?
          </button>
        </div>

        <!-- Chat messages scroll box -->
        <div id="place-ai-chat-box" style="flex: 1; overflow-y: auto; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); padding: 12px; display: flex; flex-direction: column; gap: 12px;">
          ${msgs.map(m => `
            <div style="display: flex; gap: 8px; justify-content: ${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
              ${m.sender === 'ai' ? `
                <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-rounded" style="font-size: 16px;">smart_toy</span>
                </div>
              ` : ''}
              <div style="max-width: 85%; padding: 10px 14px; border-radius: var(--radius-md); background: ${m.sender === 'user' ? 'var(--color-primary)' : 'var(--bg-secondary)'}; color: ${m.sender === 'user' ? 'white' : 'var(--text-primary)'}; font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap;">
                ${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Input Bar -->
        <div style="display: flex; gap: 8px;">
          <input 
            type="text" 
            id="place-ai-input-${place.id}" 
            placeholder="Ask AI anything about ${place.name}..."
            onkeydown="if(event.key === 'Enter') window.handleSendPlaceAiMsg('${place.id}')"
            style="flex: 1; padding: 10px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-size: 0.85rem;"
          />
          <button 
            class="btn btn-primary" 
            onclick="window.handleSendPlaceAiMsg('${place.id}')"
            style="border-radius: var(--radius-full); padding: 0 16px; font-weight: 800; font-size: 0.85rem;"
          >
            Send
          </button>
        </div>
      </div>
    `;
  }

  // Default 'overview' tab
  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px; color: var(--text-primary);">About & History</h4>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
          ${place.description}
        </p>
        ${place.history ? `
          <div style="padding: 14px; border-radius: var(--radius-md); background: var(--bg-secondary); border-left: 4px solid var(--color-primary); font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
            <strong>Historical Significance:</strong> ${place.history}
          </div>
        ` : ''}
      </div>

      ${place.builtBy ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BUILT BY / DYNASTY</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
              ${place.builtBy}
            </div>
          </div>
          <div style="padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CONSTRUCTION ERA</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
              ${place.builtYear || 'Historical Period'}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

window.sendPresetPlaceAiMsg = (placeId, text) => {
  const input = document.getElementById(`place-ai-input-${placeId}`);
  if (input) input.value = text;
  window.handleSendPlaceAiMsg(placeId);
};

window.handleSendPlaceAiMsg = async (placeId) => {
  const input = document.getElementById(`place-ai-input-${placeId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  if (!window.__placeChatHistory) window.__placeChatHistory = {};
  if (!window.__placeChatHistory[placeId]) {
    window.__placeChatHistory[placeId] = [
      {
        sender: 'ai',
        text: `🏛️ Ask me anything about this place!`
      }
    ];
  }

  const msgs = window.__placeChatHistory[placeId];
  msgs.push({ sender: 'user', text });

  const loadingIndex = msgs.length;
  msgs.push({ sender: 'ai', text: '⚡ *Consulting LM Tourism AI Assistant...*' });

  if (window.renderApp) window.renderApp();

  setTimeout(() => {
    const box = document.getElementById('place-ai-chat-box');
    if (box) box.scrollTop = box.scrollHeight;
  }, 10);

  const place = TourismApiService.getPlaceById(placeId);
  const response = await fetchAiGuideResponse(place, text, msgs.slice(0, loadingIndex));

  msgs[loadingIndex] = { sender: 'ai', text: response };
  if (window.renderApp) window.renderApp();

  setTimeout(() => {
    const box = document.getElementById('place-ai-chat-box');
    if (box) box.scrollTop = box.scrollHeight;
  }, 10);
};

// Navigation helper for map
window.openGoogleMaps = (name, lat, lng) => {
  if (lat && lng) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' Tamil Nadu')}`, '_blank');
  }
};
