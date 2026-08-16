// src/components/ExploreView.js — Global Country-First Tourism & Heritage Explorer
import { searchMonuments }             from '../services/monuments.js';
import { StorageService }              from '../services/storage.js';
import { t }                           from '../services/i18n.js';
import { DESTINATIONS, ATTRACTIONS }   from '../data/attractions.js';
import { TAMIL_NADU_PLACES }           from '../data/tamilNaduData.js';
import { TourismApiService }           from '../services/tourismApi.js';

let activeCountry  = 'All';
let activeRegion   = 'All';
let activeCategory = 'All';
let searchQuery    = '';

export function setExploreCountry(c)  { activeCountry = c; activeRegion = 'All'; }
export function setExploreRegion(r)   { activeRegion = r; }
export function setExploreCity(c)     { activeRegion = c; }
export function setExploreCategory(cat){ activeCategory = cat; }
export function setExploreSearch(q)   { searchQuery = q; }
export function resetExploreFilters()  { activeCountry = 'All'; activeRegion = 'All'; activeCategory = 'All'; searchQuery = ''; }

function getBookmarks() {
  return StorageService.getFavorites();
}

// Country-specific Regions mapping
const COUNTRY_REGIONS = {
  'India': ['All', 'Tamil Nadu', 'Rajasthan', 'Kerala', 'Karnataka', 'Maharashtra', 'Gujarat', 'Goa', 'Uttar Pradesh', 'Delhi', 'West Bengal', 'Himachal Pradesh', 'Uttarakhand', 'Odisha', 'Madhya Pradesh'],
  'USA': ['All', 'New York', 'California', 'Florida', 'Texas', 'Washington'],
  'France': ['All', 'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Normandy'],
  'Japan': ['All', 'Kyoto', 'Tokyo', 'Osaka', 'Hokkaido'],
  'Egypt': ['All', 'Cairo & Giza', 'Luxor', 'Alexandria'],
  'Italy': ['All', 'Lazio', 'Tuscany', 'Lombardy', 'Veneto'],
  'UK': ['All', 'England', 'Scotland', 'Wales'],
  'Australia': ['All', 'New South Wales', 'Victoria', 'Queensland']
};

// Country-tailored Tourism Categories mapping
const COUNTRY_CATEGORIES = {
  'India': ['All', 'Heritage & Forts', 'Temples & Spiritual', 'Beaches & Coastal', 'Hill Stations', 'Wildlife'],
  'Japan': ['All', 'Buddhist Temples', 'Shinto Shrines', 'Castles', 'Gardens & Nature'],
  'France': ['All', 'Museums & Art', 'Castles & Palaces', 'Historical Monuments', 'Architecture'],
  'Egypt': ['All', 'Pyramids & Ancient Wonders', 'Pharaonic Temples', 'Museums'],
  'USA': ['All', 'Landmarks & Monuments', 'Museums & Culture', 'Parks & Nature', 'Skyscrapers']
};

export function renderExploreView(monuments = []) {
  const bookmarks = getBookmarks();

  const countries = ['All', 'India', 'USA', 'France', 'Italy', 'Japan', 'Egypt', 'UK', 'Australia', 'Spain', 'South Korea', 'UAE', 'Switzerland', 'Turkey'];
  const regions   = COUNTRY_REGIONS[activeCountry] || ['All'];
  const categories = COUNTRY_CATEGORIES[activeCountry] || ['All', 'Monuments & Heritage', 'Temples & Spiritual', 'Beaches & Coastal', 'Hill Stations', 'Waterfalls', 'Wildlife & Sanctuaries', 'Museums & Art'];

  // Perform universal smart search and filtering via TourismApiService
  const filtered = TourismApiService.filterPlaces({
    country: activeCountry,
    category: activeCategory,
    city: activeRegion,
    searchQuery: searchQuery
  });

  let filteredAttractions = (ATTRACTIONS || []).filter(a => {
    const cMatch = activeCountry === 'All' || (a.country && a.country.toLowerCase() === activeCountry.toLowerCase());
    const rMatch = activeRegion === 'All' || (a.city && a.city.toLowerCase().includes(activeRegion.toLowerCase()));
    const catMatch = activeCategory === 'All' || (a.category && a.category.toLowerCase().includes(activeCategory.toLowerCase()));
    return cMatch && rMatch && catMatch;
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filteredAttractions = filteredAttractions.filter(a =>
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.city && a.city.toLowerCase().includes(q)) ||
      (a.country && a.country.toLowerCase().includes(q)) ||
      (a.description && a.description.toLowerCase().includes(q))
    );
  }

  return `
    <div style="padding-top: 16px; max-width: 1200px; margin: 0 auto 100px;">
      <!-- Title & Search Header -->
      <div style="padding: 0 20px; margin-bottom: 16px;">
        <h1 class="section-title" style="margin: 0 0 12px 0;">
          ${activeCountry === 'All' ? 'Explore Global Tourism Destinations' : `Explore ${activeCountry} Destinations`}
        </h1>

        <div class="search-box-large" style="box-shadow: var(--shadow-sm); border: 1px solid var(--border-subtle);">
          <span class="material-symbols-rounded" style="color: #64748b;">search</span>
          <input 
            type="text" 
            placeholder="Search monuments, cities, states, or countries (e.g. Paris, Taj Mahal, Tamil Nadu, Kyoto)..."
            value="${searchQuery}"
            oninput="window.updateExploreSearch(this.value)"
          />
          ${searchQuery ? `
            <button type="button" style="background: none; color: var(--text-muted); padding: 4px;" onclick="window.updateExploreSearch('')">
              <span class="material-symbols-rounded">close</span>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- 1. Country Selection Bar (Country-First Navigation) -->
      <div style="padding: 0 20px 6px 20px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center; justify-content: space-between;">
        <span>🌎 Select Country</span>
        ${activeCountry !== 'All' ? `<button class="chip" style="font-size:0.75rem; padding:2px 8px;" onclick="window.setExploreCountry('All')">Clear Filter</button>` : ''}
      </div>
      <div class="category-chips" style="margin-bottom: 14px;">
        ${countries.map(c => `
          <button 
            class="chip ${activeCountry === c ? 'active' : ''}" 
            onclick="window.setExploreCountry('${c}')">
            ${c === 'All' ? '🌐 All Countries' : c}
          </button>
        `).join('')}
      </div>

      <!-- 2. Country-Specific Regions / States Bar -->
      ${regions.length > 1 ? `
        <div style="padding: 0 20px 6px 20px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">
          📍 ${activeCountry} States &amp; Regions
        </div>
        <div class="category-chips" style="margin-bottom: 14px;">
          ${regions.map(r => `
            <button 
              class="chip ${activeRegion === r ? 'active' : ''}" 
              onclick="window.setExploreRegion('${r}')">
              ${r === 'All' ? `All ${activeCountry} Regions` : r}
            </button>
          `).join('')}
        </div>
      ` : ''}

      <!-- 3. Country Tourism Categories Bar -->
      <div style="padding: 0 20px 6px 20px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">
        🏷️ Experience Categories
      </div>
      <div class="category-chips" style="margin-bottom: 20px;">
        ${categories.map(cat => `
          <button 
            class="chip ${activeCategory === cat ? 'active' : ''}" 
            onclick="window.setExploreCategory('${cat}')">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Attractions Section -->
      ${filteredAttractions.length > 0 ? `
        <div style="padding: 12px 20px 8px 20px; display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-primary);">
            ${activeRegion !== 'All' ? `Experiences in ${activeRegion}` : activeCountry !== 'All' ? `Top Experiences in ${activeCountry}` : 'Top World Experiences'}
          </h2>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${filteredAttractions.length} Items</span>
        </div>

        <div class="monuments-grid" style="margin-bottom: 24px;">
          ${filteredAttractions.map(a => `
            <div class="grid-card" onclick="window.openMonumentDetail('${a.monumentId || a.id}')">
              <div class="grid-card-image">
                <img src="${a.imageUrl}" alt="${a.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
                <span class="badge-unesco" style="position: absolute; bottom: 8px; left: 8px;">📍 ${a.city}</span>
              </div>
              <div class="grid-card-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <h3 class="grid-card-title" style="margin: 0;">${a.name}</h3>
                  <span style="color: #f59e0b; font-weight: 700; font-size: 0.85rem;">★ ${a.rating}</span>
                </div>
                <p class="grid-card-desc">${a.description}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                  <span>📍 ${a.city}, ${a.country}</span>
                  <span style="font-weight: 700; color: var(--color-primary);">${a.currency || '$'}${a.price}</span>
                </div>

                <div style="margin-top: 10px;">
                  <button 
                    class="chip active" 
                    style="width: 100%; justify-content: center; padding: 6px 12px; font-size: 0.825rem; font-weight: 700;"
                    onclick="event.stopPropagation(); window.openMonumentDetail('${a.monumentId || a.id}');"
                  >
                    <span class="material-symbols-rounded" style="font-size: 16px;">info</span>
                    View Details &amp; Booking
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Monuments Section -->
      <div style="padding: 12px 20px 8px 20px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-primary);">
          Destinations &amp; Monuments (${filtered.length})
        </h2>
      </div>

      ${filtered.length === 0 ? `
        <div style="text-align: center; padding: 32px 20px; color: var(--text-muted);">
          <span class="material-symbols-rounded" style="font-size: 48px; margin-bottom: 8px;">search_off</span>
          <h3>No destinations found</h3>
          <p>Try searching for a different keyword or clearing filters.</p>
        </div>
      ` : `
        <div class="monuments-grid">
          ${filtered.map(m => {
            const isFav = bookmarks.includes(m.id);
            const crowdDot = m.crowdLevel === 'Low' ? '🟢' : m.crowdLevel === 'High' ? '🔴' : '🟡';
            const priceLabel = m.entryFee === 0 ? 'Free Entry' : `$${m.entryFee}`;

            return `
              <div class="grid-card" onclick="window.openMonumentDetail('${m.id}')">
                <div class="grid-card-image">
                  <img src="${m.imageUrl}" alt="${m.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop';" />
                  <div style="position: absolute; bottom: 8px; left: 8px; display: flex; gap: 6px;">
                    ${m.unescoStatus ? `<span class="badge-unesco">UNESCO</span>` : ''}
                    <span style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 700;">
                      ${crowdDot} ${m.crowdLevel || 'Medium'}
                    </span>
                  </div>
                  <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.toggleFavorite('${m.id}');">
                    <span class="material-symbols-rounded" style="font-variation-settings:'FILL' ${isFav ? 1 : 0};">favorite</span>
                  </button>
                </div>
                <div class="grid-card-body">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                    <h3 class="grid-card-title" style="margin: 0;">${m.name}</h3>
                    <span style="color: #f59e0b; font-weight: 700; font-size: 0.85rem;">★ ${m.rating}</span>
                  </div>
                  <p class="grid-card-desc">${m.description}</p>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                    <span>📍 ${m.city}, ${m.state || m.country}</span>
                    <span style="font-weight: 700; color: var(--color-primary);">${priceLabel}</span>
                  </div>

                  <div style="margin-top: 10px;">
                    <button 
                      class="chip active" 
                      style="width: 100%; justify-content: center; padding: 6px 12px; font-size: 0.8rem; font-weight: 700;"
                      onclick="event.stopPropagation(); window.openMonumentDetail('${m.id}');"
                    >
                      <span class="material-symbols-rounded" style="font-size: 16px;">info</span>
                      View Details &amp; Booking
                    </button>
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

window.setExploreCountry = (c) => { setExploreCountry(c); window.renderApp(); };
window.setExploreRegion  = (r) => { setExploreRegion(r);  window.renderApp(); };
window.setExploreCity    = (c) => { setExploreCity(c);    window.renderApp(); };
