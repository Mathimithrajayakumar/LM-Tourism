// src/components/FavoritesView.js
import { StorageService } from '../services/storage.js';
import { t }              from '../services/i18n.js';

export function renderFavoritesView(monuments = [], currentUser = null) {
  const bookmarkIds    = StorageService.getFavorites();
  const savedMonuments = monuments.filter(m => bookmarkIds.includes(m.id));

  return `
    <div style="padding-top: 16px;">
      <h1 class="section-title" style="margin-top: 0;">${t('my_favourites')}</h1>
      <p style="padding: 0 20px 16px 20px; font-size: 0.9rem; color: var(--text-secondary);">
        ${savedMonuments.length} ${savedMonuments.length !== 1 ? t('saved_sites') + 's' : t('saved_sites')} in your collection
      </p>

      ${savedMonuments.length === 0 ? `
        <div style="text-align: center; padding: 64px 20px; color: var(--text-muted);">
          <span class="material-symbols-rounded" style="font-size: 64px; color: var(--color-primary); margin-bottom: 12px;">favorite</span>
          <h2>${t('no_favourites')}</h2>
          <p style="margin: 8px 0 24px 0;">Explore monuments and tap ♡ to save your favorite locations here.</p>
          <button class="chip active" onclick="window.navigateTo('explore')" style="padding: 10px 24px; font-size: 0.95rem;">
            ${t('explore_monuments')}
          </button>
        </div>
      ` : `
        <div class="monuments-grid">
          ${savedMonuments.map(m => `
            <div class="grid-card" onclick="window.openMonumentDetail('${m.id}')">
              <div class="grid-card-image">
                <img src="${m.imageUrl}" alt="${m.name}" loading="lazy" />
                <button class="fav-btn active" onclick="event.stopPropagation(); window.toggleFavorite('${m.id}');">
                  <span class="material-symbols-rounded" style="font-variation-settings:'FILL' 1;">favorite</span>
                </button>
              </div>
              <div class="grid-card-body">
                <h3 class="grid-card-title">${m.name}</h3>
                <p class="grid-card-desc">${m.description}</p>
                <div class="grid-card-footer">
                  <span>📍 ${m.city}, ${m.state}</span>
                  <span style="color: #f59e0b; font-weight: 700;">★ ${m.rating}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}
