// src/components/TNDashboardView.js
// Dedicated Tamil Nadu Tourism Module View (India -> Tamil Nadu -> Tamil Nadu Tourism)

import { TAMIL_NADU_CATEGORIES, TAMIL_NADU_CITIES } from '../data/tamilNaduData.js';
import { TourismApiService } from '../services/tourismApi.js';
import { getLanguage, t } from '../services/i18n.js';

export let currentTNCategory = 'all';
export let currentTNCity = 'All Cities';
export let currentTNSearch = '';

export function setTNCategory(cat) { currentTNCategory = cat; }
export function setTNCity(city) { currentTNCity = city; }
export function setTNSearch(q) { currentTNSearch = q; }

export function renderTNDashboardView(monuments = []) {
  const currentLang = getLanguage();
  const places = TourismApiService.filterPlaces({
    category: currentTNCategory,
    city: currentTNCity,
    searchQuery: currentTNSearch
  });

  return `
    <div class="tn-dashboard fade-in" style="padding: 16px; max-width: 1200px; margin: 0 auto 100px;">
      
      <!-- Breadcrumb Navigation -->
      <div style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">
        <span style="cursor: pointer;" onclick="window.navigateTo('home')">LM Tourism</span>
        <span>/</span>
        <span style="cursor: pointer;" onclick="window.navigateTo('explore')">India</span>
        <span>/</span>
        <span style="color: var(--color-primary);">Tamil Nadu Tourism</span>
      </div>

      <!-- Top State Banner (Only inside TN module) -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #b45309 100%); border-radius: var(--radius-xl); padding: 24px 20px; color: white; margin-bottom: 24px; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="material-symbols-rounded" style="color: #fbbf24; font-size: 24px;">temple_hindu</span>
              <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #fef08a;">
                State Tourism Module — India
              </span>
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 1.9rem; font-weight: 800; margin: 0;">
              ${currentLang === 'ta' ? 'தமிழ்நாடு சுற்றுலா — ஆன்மீக & பாரம்பரிய மண்' : 'Tamil Nadu Tourism — Land of Temples & Heritage'}
            </h1>
            <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 4px; max-width: 700px;">
              Explore Dravidian temples, hill stations, beaches, waterfalls, estimated crowd patterns, ticket booking & AI trip planner.
            </p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn" onclick="window.navigateTo('planner')" style="background: #f59e0b; color: #1e1b4b; font-weight: 800; padding: 10px 18px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">
              <span class="material-symbols-rounded">auto_awesome</span>
              <span>AI Trip Planner</span>
            </button>
            <button class="btn" onclick="window.navigateTo('chatbot')" style="background: rgba(255,255,255,0.15); color: white; font-weight: 700; padding: 10px 16px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.3);">
              <span class="material-symbols-rounded">chat</span>
              <span>TN AI Guide</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Action Navigation Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; overflow-x: auto; gap: 12px; padding: 12px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 24px; box-shadow: var(--shadow-sm);">
        <button onclick="window.setTNCategory('all')" class="chip ${currentTNCategory === 'all' ? 'active' : ''}" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-weight: 700;">
          <span class="material-symbols-rounded" style="font-size: 18px;">explore</span>
          <span>Explore All Places (${places.length})</span>
        </button>
        <button onclick="window.navigateTo('planner')" class="chip" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary);">
          <span class="material-symbols-rounded" style="font-size: 18px;">route</span>
          <span>AI Trip Planner</span>
        </button>
        <button onclick="window.navigateTo('chatbot')" class="chip" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-weight: 700; background: rgba(16,185,129,0.1); color: #059669;">
          <span class="material-symbols-rounded" style="font-size: 18px;">smart_toy</span>
          <span>TN AI Chatbot</span>
        </button>
        <button onclick="window.navigateTo('emergency')" class="chip" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-weight: 700; background: rgba(239,68,68,0.1); color: #dc2626;">
          <span class="material-symbols-rounded" style="font-size: 18px;">medical_services</span>
          <span>Emergency & Helpline</span>
        </button>
      </div>

      <!-- Search & City Filter Bar -->
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
        <div style="flex: 1; min-width: 260px; position: relative;">
          <span class="material-symbols-rounded" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 20px;">search</span>
          <input 
            type="text" 
            placeholder="${currentLang === 'ta' ? 'இடங்கள், கோவில்கள், அருவிகளைத் தேடுங்கள்...' : 'Search Tamil Nadu places, temples, waterfalls, hill stations...'}"
            value="${currentTNSearch}"
            oninput="window.updateTNSearch(this.value)"
            style="width: 100%; padding: 12px 14px 12px 42px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-size: 0.95rem; box-shadow: var(--shadow-sm);"
          />
        </div>

        <select 
          onchange="window.setTNCity(this.value)"
          style="padding: 12px 16px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-size: 0.9rem; font-weight: 600; cursor: pointer; min-width: 160px;"
        >
          ${TAMIL_NADU_CITIES.map(c => `
            <option value="${c}" ${c === currentTNCity ? 'selected' : ''}>${c}</option>
          `).join('')}
        </select>
      </div>

      <!-- 10 Category Filter Pills -->
      <div style="display: flex; align-items: center; gap: 10px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px; scrollbar-width: none;">
        ${TAMIL_NADU_CATEGORIES.map(cat => {
          const isActive = cat.id === currentTNCategory;
          const catName = currentLang === 'ta' ? cat.nameTa : currentLang === 'hi' ? cat.nameHi : cat.name;
          return `
            <button 
              onclick="window.setTNCategory('${cat.id}')"
              class="chip ${isActive ? 'active' : ''}"
              style="display: flex; align-items: center; gap: 8px; padding: 10px 18px; font-weight: 700; white-space: nowrap; border-radius: var(--radius-full); transition: all 0.2s ease;"
            >
              <span class="material-symbols-rounded" style="font-size: 20px;">${cat.icon}</span>
              <span>${catName}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Header title & Places Count -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">
          ${currentTNCategory === 'all' ? 'Tamil Nadu Tourist Places' : TAMIL_NADU_CATEGORIES.find(c=>c.id===currentTNCategory)?.name}
        </h2>
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">
          Showing ${places.length} places
        </span>
      </div>

      <!-- Places Cards Grid -->
      ${places.length === 0 ? `
        <div style="text-align: center; padding: 48px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <span class="material-symbols-rounded" style="font-size: 48px; color: var(--text-muted); margin-bottom: 12px;">search_off</span>
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 4px;">No places found</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">Try adjusting your category filter, city, or search term.</p>
          <button class="btn btn-secondary" onclick="window.resetTNFilters()">Reset Filters</button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${places.map(place => {
            const crowdBadge = TourismApiService.getCrowdBadge(place.crowdLevel, currentLang);
            const displayName = currentLang === 'ta' ? (place.nameTa || place.name) : place.name;
            const isFree = place.tickets?.isFree || place.tickets?.adult === 0;

            return `
              <div 
                class="place-card" 
                style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; flex-direction: column;"
              >
                <!-- Image Header -->
                <div style="position: relative; height: 200px; overflow: hidden; cursor: pointer;" onclick="window.openPlaceDetailModal('${place.id}')">
                  <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" />
                  <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);"></div>

                  <!-- Category Tag -->
                  <div style="position: absolute; top: 12px; left: 12px;">
                    <span style="background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: white; padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                      ${place.category}
                    </span>
                  </div>

                  <!-- Estimated Crowd Level Badge -->
                  <div style="position: absolute; top: 12px; right: 12px;">
                    <span title="Estimated visitor pattern based on historical trends" style="background: ${crowdBadge.bg}; color: ${crowdBadge.color}; padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                      <span class="material-symbols-rounded" style="font-size: 14px;">${crowdBadge.icon}</span>
                      <span>${crowdBadge.label} (Est.)</span>
                    </span>
                  </div>

                  <!-- Title overlay -->
                  <div style="position: absolute; bottom: 12px; left: 14px; right: 14px; color: white;">
                    <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
                      ${displayName}
                    </h3>
                    <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; opacity: 0.95;">
                      <span class="material-symbols-rounded" style="font-size: 14px; color: #fbbf24;">location_on</span>
                      <span>${place.city}, ${place.district}</span>
                    </div>
                  </div>
                </div>

                <!-- Card Body -->
                <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <!-- Timings & Ticket Info Row -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 12px; font-size: 0.8rem;">
                      <div>
                        <div style="color: var(--text-muted); font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Timings</div>
                        <div style="font-weight: 700; color: var(--text-primary); margin-top: 2px;">
                          ${place.openingTime} - ${place.closingTime}
                        </div>
                      </div>
                      <div>
                        <div style="color: var(--text-muted); font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Ticket Price</div>
                        <div style="font-weight: 800; color: #059669; margin-top: 2px;">
                          ${isFree ? 'FREE ENTRY' : `₹${place.tickets?.adult || 0} / person`}
                        </div>
                      </div>
                    </div>

                    <!-- Short Description -->
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${currentLang === 'ta' && place.descriptionTa ? place.descriptionTa : place.description}
                    </p>
                  </div>

                  <!-- Action Buttons Row -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                    <button 
                      class="btn btn-secondary" 
                      onclick="window.openPlaceDetailModal('${place.id}')"
                      style="border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; padding: 8px; display: flex; align-items: center; justify-content: center; gap: 4px;"
                    >
                      <span class="material-symbols-rounded" style="font-size: 16px;">info</span>
                      <span>Details & Map</span>
                    </button>

                    ${place.tickets?.bookingWebsite ? `
                      <a 
                        href="${place.tickets.bookingWebsite}" 
                        target="_blank" 
                        rel="noopener"
                        class="btn btn-primary" 
                        style="border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; padding: 8px; display: flex; align-items: center; justify-content: center; gap: 4px; text-decoration: none;"
                      >
                        <span class="material-symbols-rounded" style="font-size: 16px;">open_in_new</span>
                        <span>Book Ticket</span>
                      </a>
                    ` : `
                      <button 
                        class="btn btn-secondary" 
                        onclick="window.openPlaceDetailModal('${place.id}')"
                        style="border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 700; padding: 8px; display: flex; align-items: center; justify-content: center; opacity: 0.8;"
                        title="Online booking unavailable — check at venue"
                      >
                        <span>Check at Venue</span>
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}
