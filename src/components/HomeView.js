// src/components/HomeView.js — Global LM Tourism Worldwide Platform Homepage
import { StorageService } from '../services/storage.js';
import { t } from '../services/i18n.js';

export function renderHomeView(monuments = [], currentUser = null) {
  const featured  = monuments.filter(m => m.isFeatured);
  const popular   = [...monuments].sort((a, b) => b.rating - a.rating);
  const bookmarks = StorageService.getFavorites();
  const recentSearches = currentUser?.searchHistory || [];

  return `
    <!-- Global Hero Banner -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-tagline">
          <span class="material-symbols-rounded" style="font-size: 16px;">public</span>
          Worldwide Tourism &amp; Heritage Platform
        </div>
        <h1 class="hero-title">${t('hero_title') || 'Explore World Architectural Wonders'}</h1>
        <p class="hero-subtitle">${t('hero_subtitle') || 'Discover world heritage sites, estimated crowd levels, opening timings, 3D AR models, and AI tour guides.'}</p>
        
        <form onsubmit="event.preventDefault(); const q = this.querySelector('input').value; if(q.trim()) window.navigateTo('explore', q);" class="search-box-large">
          <span class="material-symbols-rounded" style="color: #64748b;">search</span>
          <input type="text" placeholder="${t('search_placeholder') || 'Search monuments, cities, states, or countries (e.g. Taj Mahal, Paris, Jaipur, Eiffel Tower)...'}" id="home-search-input" />
          <button type="submit">
            ${t('search_btn') || 'Explore'}
            <span class="material-symbols-rounded" style="font-size: 18px;">arrow_forward</span>
          </button>
        </form>

        <!-- Recent Searches -->
        ${recentSearches.length > 0 ? `
          <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="font-size:0.75rem; color:rgba(255,255,255,0.6); font-weight:600;">${t('recent_searches') || 'Recent'}:</span>
            ${recentSearches.slice(0, 5).map(q => `
              <button
                class="chip"
                style="background:rgba(255,255,255,0.15); color:white; border-color:rgba(255,255,255,0.25); font-size:0.75rem; padding:4px 12px;"
                onclick="window.navigateTo('explore', '${q.replace(/'/g, "\\'")}')"
              >${q}</button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>

    <!-- Quick Action Tools Grid -->
    <h2 class="section-title" style="margin-top: 24px;">${t('quick_actions') || 'Quick Tools'}</h2>
    <div class="quick-actions-grid">
      <div class="action-card" onclick="window.navigateTo('explore')">
        <div class="action-icon" style="background: linear-gradient(135deg, #2563eb, #3b82f6);">
          <span class="material-symbols-rounded">explore</span>
        </div>
        <span class="action-label">${t('nav_explore') || 'Explore All'}</span>
      </div>

      <div class="action-card" onclick="window.navigateTo('planner')">
        <div class="action-icon" style="background: linear-gradient(135deg, #4c1d95, #6d28d9);">
          <span class="material-symbols-rounded">auto_awesome</span>
        </div>
        <span class="action-label">AI Planner</span>
      </div>

      <div class="action-card" onclick="window.openCompareModal()">
        <div class="action-icon" style="background: linear-gradient(135deg, #059669, #10b981);">
          <span class="material-symbols-rounded">compare_arrows</span>
        </div>
        <span class="action-label">Compare</span>
      </div>

      <div class="action-card" onclick="window.openArModal()">
        <div class="action-icon" style="background: linear-gradient(135deg, #8b5cf6, #a855f7);">
          <span class="material-symbols-rounded">view_in_ar</span>
        </div>
        <span class="action-label">3D AR Scan</span>
        <span class="action-badge">3D</span>
      </div>

      <div class="action-card" onclick="window.navigateTo('chatbot')">
        <div class="action-icon" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
          <span class="material-symbols-rounded">smart_toy</span>
        </div>
        <span class="action-label">AI Guide</span>
      </div>

      <div class="action-card" onclick="window.navigateTo('favorites')">
        <div class="action-icon" style="background: linear-gradient(135deg, #ec4899, #f43f5e);">
          <span class="material-symbols-rounded">favorite</span>
        </div>
        <span class="action-label">${t('nav_favourites') || 'Saved'}</span>
      </div>
    </div>


    <!-- Featured Monuments Carousel (Worldwide Wonders) -->
    <div class="section-title" style="margin-top: 24px;">
      <span>${t('featured') || 'World Architectural Wonders'}</span>
      <button class="chip" onclick="window.navigateTo('explore')">${t('see_all') || 'See All'}</button>
    </div>
    
    <div class="monuments-carousel">
      ${featured.length === 0 ? `
        <div style="padding:20px;color:var(--text-muted);font-size:0.9rem;">Loading featured monuments...</div>
      ` : featured.map(m => {
        const crowdDot = m.crowdLevel === 'Low' ? '🟢' : m.crowdLevel === 'High' ? '🔴' : '🟡';
        return `
          <div class="featured-card" onclick="window.openMonumentDetail('${m.id}')">
            <img src="${m.imageUrl}" alt="${m.name}" loading="lazy" />
            <div class="card-overlay">
              <div style="display: flex; gap: 6px;">
                ${m.unescoStatus ? `<span class="badge-unesco">UNESCO</span>` : `<span></span>`}
                <span style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700;">
                  ${crowdDot} ${m.crowdLevel || 'Medium'} Crowd
                </span>
              </div>
              <div>
                <h3 class="card-title">${m.name}</h3>
                <div class="card-meta">
                  <span>📍 ${m.city}, ${m.state || m.country}</span>
                  <span class="card-rating">★ ${m.rating}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Regional & State Explorer Cards Spotlight -->
    <div style="margin: 28px 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: #2563eb;">public</span>
          <span>Explore Regional &amp; State Destinations</span>
        </h2>
        <button class="chip" onclick="window.navigateTo('state')" style="font-weight: 700;">View All States</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        
        <!-- India Hub Card -->
        <div 
          onclick="window.navigateTo('state')"
          style="border-radius: var(--radius-lg); background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #b45309 100%); color: white; padding: 18px; cursor: pointer; position: relative; overflow: hidden; box-shadow: var(--shadow-md);"
        >
          <div style="font-size: 0.75rem; font-weight: 800; background: rgba(245,158,11,0.3); color: #fbbf24; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 6px;">
            COUNTRY ➔ INDIA
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px;">India State Hubs</h3>
          <p style="font-size: 0.825rem; opacity: 0.9; margin-bottom: 12px; line-height: 1.4;">
            Tamil Nadu, Rajasthan, Kerala, Karnataka, Maharashtra, Delhi &amp; more.
          </p>
          <span style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; display: inline-flex; align-items: center; gap: 4px;">
            <span>Explore 17 Indian States</span>
            <span class="material-symbols-rounded" style="font-size: 14px;">arrow_forward</span>
          </span>
        </div>

        <!-- Tamil Nadu Card -->
        <div 
          onclick="window.navigateTo('tn')"
          style="border-radius: var(--radius-lg); background: linear-gradient(135deg, #7c2d12 0%, #d97706 100%); color: white; padding: 18px; cursor: pointer; position: relative; overflow: hidden; box-shadow: var(--shadow-md);"
        >
          <div style="font-size: 0.75rem; font-weight: 800; background: rgba(255,255,255,0.2); color: white; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 6px;">
            INDIA ➔ TAMIL NADU
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px;">Tamil Nadu Experience</h3>
          <p style="font-size: 0.825rem; opacity: 0.9; margin-bottom: 12px; line-height: 1.4;">
            Chola Temples, Marina Beach, Ooty Hills, and crowd estimations.
          </p>
          <span style="font-size: 0.75rem; font-weight: 800; color: white; display: inline-flex; align-items: center; gap: 4px;">
            <span>Enter Tamil Nadu Module</span>
            <span class="material-symbols-rounded" style="font-size: 14px;">arrow_forward</span>
          </span>
        </div>

        <!-- France Card Teaser -->
        <div 
          onclick="window.setExploreCountry('France'); window.navigateTo('explore');"
          style="border-radius: var(--radius-lg); background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; padding: 18px; cursor: pointer; position: relative; overflow: hidden; box-shadow: var(--shadow-md);"
        >
          <div style="font-size: 0.75rem; font-weight: 800; background: rgba(99,102,241,0.3); color: #a5b4fc; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 6px;">
            COUNTRY ➔ FRANCE
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px;">France &amp; Europe</h3>
          <p style="font-size: 0.825rem; opacity: 0.9; margin-bottom: 12px; line-height: 1.4;">
            Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and Arc de Triomphe.
          </p>
          <span style="font-size: 0.75rem; font-weight: 800; color: #a5b4fc; display: inline-flex; align-items: center; gap: 4px;">
            <span>Explore France Heritage</span>
            <span class="material-symbols-rounded" style="font-size: 14px;">arrow_forward</span>
          </span>
        </div>

      </div>
    </div>

    <!-- Popular Global Destinations -->
    <h2 class="section-title" style="margin-top: 28px;">${t('popular') || 'Popular Global Destinations'}</h2>
    <div class="monuments-grid">
      ${popular.slice(0, 6).map(m => {
        const isFav = bookmarks.includes(m.id);
        const crowdDot = m.crowdLevel === 'Low' ? '🟢' : m.crowdLevel === 'High' ? '🔴' : '🟡';
        return `
          <div class="grid-card" onclick="window.openMonumentDetail('${m.id}')">
            <div class="grid-card-image">
              <img src="${m.imageUrl}" alt="${m.name}" loading="lazy" />
              <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.toggleFavorite('${m.id}');">
                <span class="material-symbols-rounded" style="font-variation-settings:'FILL' ${isFav ? 1 : 0};">favorite</span>
              </button>
              <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 700;">
                ${crowdDot} ${m.crowdLevel || 'Medium'} Crowd
              </span>
            </div>
            <div class="grid-card-body">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <h3 class="grid-card-title" style="margin: 0;">${m.name}</h3>
                <span style="color: #f59e0b; font-weight: 700; font-size: 0.85rem;">★ ${m.rating}</span>
              </div>
              <p class="grid-card-desc">${m.description}</p>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">
                <span>📍 ${m.city}, ${m.country}</span>
                <span style="font-weight: 700; color: var(--color-primary);">🕐 ${m.openingTime ? m.openingTime.split(' ')[0] : '06:00 AM'}</span>
              </div>

              <div style="margin-top: 10px;">
                <button 
                  class="chip active" 
                  style="width: 100%; justify-content: center; padding: 6px 12px; font-size: 0.8rem; font-weight: 700;"
                  onclick="event.stopPropagation(); window.openBookingModal('${m.id}');"
                >
                  <span class="material-symbols-rounded" style="font-size: 16px;">confirmation_number</span>
                  Book Ticket ($${m.entryFee || 25})
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
