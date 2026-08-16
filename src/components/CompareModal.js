// src/components/CompareModal.js
// Destination Comparison Tool (Side-by-side comparison)

import { TourismApiService } from '../services/tourismApi.js';

let compareState = {
  destId1: 'taj-mahal',
  destId2: 'brihadeeswarar-temple'
};

export function setCompareTargets(id1, id2) {
  if (id1) compareState.destId1 = id1;
  if (id2) compareState.destId2 = id2;
}

export function renderCompareModal() {
  const all = TourismApiService.getAllDestinations();
  const d1 = TourismApiService.getPlaceById(compareState.destId1) || all[0];
  const d2 = TourismApiService.getPlaceById(compareState.destId2) || all[1] || all[0];

  return `
    <div class="modal-backdrop fade-in" onclick="if(event.target === this) window.closeModal();">
      <div class="modal-container scale-up" style="max-width: 960px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: var(--radius-xl); background: var(--bg-card); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-xl);">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-rounded" style="color: var(--color-primary); font-size: 28px;">compare_arrows</span>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0; color: var(--text-primary); font-family: var(--font-heading);">
                Destination Comparison Tool
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                Compare entry fees, timings, crowd levels, best visiting windows, and category specs side-by-side.
              </p>
            </div>
          </div>
          <button onclick="window.closeModal()" class="modal-close-btn" style="position: static;">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <!-- Destination Selectors Bar -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div>
            <label style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); display: block; margin-bottom: 4px;">SELECT DESTINATION 1</label>
            <select onchange="window.handleCompareChange(1, this.value)" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-weight: 700;">
              ${all.map(p => `<option value="${p.id}" ${p.id === d1.id ? 'selected' : ''}>${p.name} (${p.city})</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); display: block; margin-bottom: 4px;">SELECT DESTINATION 2</label>
            <select onchange="window.handleCompareChange(2, this.value)" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-primary); font-weight: 700;">
              ${all.map(p => `<option value="${p.id}" ${p.id === d2.id ? 'selected' : ''}>${p.name} (${p.city})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Comparison Table / Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          
          <!-- Column 1 -->
          <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden;">
            <img src="${d1.imageUrl}" alt="${d1.name}" style="width: 100%; height: 180px; object-fit: cover;" />
            <div style="padding: 16px;">
              <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: var(--text-primary);">${d1.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">📍 ${d1.city}, ${d1.state} (${d1.country})</p>

              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">⭐ Rating: <strong>${d1.rating}</strong> (${d1.reviewsCount}+)</div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🎟 Ticket: <strong>${d1.ticketInfo?.isFree ? 'FREE' : `₹${d1.ticketInfo?.adult}`}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🕒 Timings: <strong>${d1.openingTime} – ${d1.closingTime}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">👥 Crowd Level: <strong>${d1.crowdLevel}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">⏱ Visit Duration: <strong>${d1.avgVisitDuration}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🌤 Best Season: <strong>${d1.bestSeason || 'Oct - Mar'}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🏛 Category: <strong>${d1.category}</strong></div>
              </div>

              <button class="btn btn-primary" onclick="window.openMonumentDetail('${d1.id}')" style="width: 100%; margin-top: 16px; border-radius: var(--radius-full); font-weight: 800;">
                Explore Details
              </button>
            </div>
          </div>

          <!-- Column 2 -->
          <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden;">
            <img src="${d2.imageUrl}" alt="${d2.name}" style="width: 100%; height: 180px; object-fit: cover;" />
            <div style="padding: 16px;">
              <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: var(--text-primary);">${d2.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">📍 ${d2.city}, ${d2.state} (${d2.country})</p>

              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">⭐ Rating: <strong>${d2.rating}</strong> (${d2.reviewsCount}+)</div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🎟 Ticket: <strong>${d2.ticketInfo?.isFree ? 'FREE' : `₹${d2.ticketInfo?.adult}`}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🕒 Timings: <strong>${d2.openingTime} – ${d2.closingTime}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">👥 Crowd Level: <strong>${d2.crowdLevel}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">⏱ Visit Duration: <strong>${d2.avgVisitDuration}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🌤 Best Season: <strong>${d2.bestSeason || 'Oct - Mar'}</strong></div>
                <div style="padding: 8px; background: var(--bg-card); border-radius: 6px;">🏛 Category: <strong>${d2.category}</strong></div>
              </div>

              <button class="btn btn-primary" onclick="window.openMonumentDetail('${d2.id}')" style="width: 100%; margin-top: 16px; border-radius: var(--radius-full); font-weight: 800;">
                Explore Details
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

window.handleCompareChange = (slot, id) => {
  if (slot === 1) compareState.destId1 = id;
  if (slot === 2) compareState.destId2 = id;
  if (window.renderApp) window.renderApp();
};
