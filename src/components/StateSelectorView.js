// src/components/StateSelectorView.js
// Destination Explorer — Indian States & Regions Explorer

import { t } from '../services/i18n.js';

export const STATES_DATA = [
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    tagline: "Experience Ancient Chola Temples, Misty Hills & 1,000 Km Coastline",
    placesCount: "350+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Dravidian Temples", "UNESCO Monuments", "Hill Stations", "Tamil Heritage"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    tagline: "Land of Kings — Forts, Palaces & Thar Desert Heritage",
    placesCount: "280+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Amber Fort", "Hawa Mahal", "Pink City", "Desert Safari"]
  },
  {
    id: "kerala",
    name: "Kerala",
    tagline: "God's Own Country — Emerald Backwaters, Hills & Ayurveda",
    placesCount: "190+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Fort Kochi", "Alleppey Backwaters", "Munnar Tea Hills"]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    tagline: "One State, Many Worlds — Hampi Heritage & Mysore Palaces",
    placesCount: "210+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Hampi Ruins", "Virupaksha", "Mysore Palace", "Coorg"]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    tagline: "Gateway of India, Ancient Cave Temples & Western Ghats",
    placesCount: "240+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Gateway of India", "Ajanta Caves", "Ellora Caves", "Mumbai"]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    tagline: "Heartland of India — Taj Mahal, Agra Fort & Spiritual Varanasi",
    placesCount: "300+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Taj Mahal", "Agra Fort", "Varanasi Ghats", "Sarnath"]
  },
  {
    id: "delhi",
    name: "Delhi Capital Region",
    tagline: "Capital City of Empires — Red Fort, Qutub Minar & Humayun Tomb",
    placesCount: "150+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Qutub Minar", "Red Fort", "India Gate", "Humayun's Tomb"]
  },
  {
    id: "goa",
    name: "Goa",
    tagline: "Golden Sands, Portuguese Heritage Churches & Coastal Nightlife",
    placesCount: "110+ Destinations",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    highlights: ["Basilica of Bom Jesus", "Calangute Beach", "Fort Aguada"]
  }
];

export function renderStateSelectorView() {
  return `
    <div class="state-selector-container fade-in" style="padding: 24px 16px 100px; max-width: 1200px; margin: 0 auto;">
      <!-- Hero Banner Header -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #d97706 100%); border-radius: var(--radius-xl); padding: 32px 24px; color: white; margin-bottom: 32px; box-shadow: var(--shadow-lg); text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -40px; top: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        
        <span class="material-symbols-rounded" style="font-size: 56px; margin-bottom: 8px; color: #fbbf24;">map</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; margin-bottom: 8px;">
          ${t('nav_state') || 'Select State & Regional Tourism Hub'}
        </h1>
        <p style="font-size: 1.05rem; opacity: 0.95; max-width: 650px; margin: 0 auto 16px;">
          Discover Indian states, heritage monuments, estimated crowd levels, ticket prices, and AI trip planning.
        </p>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0;">
          Indian State &amp; Regional Hubs
        </h2>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); background: rgba(37,99,235,0.1); padding: 4px 12px; border-radius: 20px;">
          ${STATES_DATA.length} Active Hubs
        </span>
      </div>

      <!-- State Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        ${STATES_DATA.map(state => `
          <div 
            class="state-card active-state-card"
            onclick="window.selectState('${state.id}')"
            style="border-radius: var(--radius-lg); background: var(--bg-card); border: 2px solid var(--border-subtle); overflow: hidden; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative;"
            onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--color-primary)';"
            onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-subtle)';"
          >
            <div style="height: 170px; position: relative; overflow: hidden;">
              <img src="${state.imageUrl}" alt="${state.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);"></div>
              
              <div style="position: absolute; top: 12px; right: 12px;">
                <span class="chip" style="background: #10b981; color: white; font-weight: 700; font-size: 0.75rem; padding: 4px 10px;">
                  ACTIVE HUB
                </span>
              </div>

              <div style="position: absolute; bottom: 12px; left: 16px; right: 16px; color: white;">
                <h3 style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); margin: 0 0 2px 0;">${state.name}</h3>
                <div style="font-size: 0.8rem; color: #fbbf24; font-weight: 600;">${state.placesCount}</div>
              </div>
            </div>

            <div style="padding: 16px;">
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
                ${state.tagline}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                ${state.highlights.map(h => `
                  <span style="font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; background: var(--bg-secondary); color: var(--text-muted); font-weight: 600;">
                    ${h}
                  </span>
                `).join('')}
              </div>

              <button 
                class="btn btn-primary" 
                style="width: 100%; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;"
              >
                <span>Explore ${state.name}</span>
                <span class="material-symbols-rounded" style="font-size: 18px;">arrow_forward</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
