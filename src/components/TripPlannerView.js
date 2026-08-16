// src/components/TripPlannerView.js — Global AI Personalized Trip Planner
import { generatePersonalizedTripPlan } from '../services/aiService.js';

export let tripPlanResult = null;

const COUNTRIES_LIST = ['India', 'France', 'Italy', 'USA', 'Japan', 'Egypt', 'UK', 'Australia', 'Spain', 'UAE'];

const REGIONS_MAP = {
  'India': ['Tamil Nadu', 'Rajasthan', 'Kerala', 'Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Delhi', 'Goa'],
  'France': ['Paris / Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Normandy'],
  'Japan': ['Kyoto', 'Tokyo', 'Osaka', 'Hokkaido'],
  'USA': ['New York', 'California', 'Florida'],
  'Egypt': ['Cairo & Giza', 'Luxor', 'Alexandria'],
  'Italy': ['Rome / Lazio', 'Tuscany', 'Veneto'],
  'UK': ['London / England', 'Scotland'],
  'Australia': ['Sydney / NSW', 'Victoria']
};

export function renderTripPlannerView() {
  return `
    <div class="trip-planner-view fade-in" style="padding: 16px; max-width: 1000px; margin: 0 auto 100px;">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); border-radius: var(--radius-xl); padding: 28px 20px; color: white; margin-bottom: 24px; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center; color: #fbbf24;">
            <span class="material-symbols-rounded" style="font-size: 28px;">auto_awesome</span>
          </div>
          <div>
            <h1 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 0;">
              AI Personalized Trip Planner
            </h1>
            <p style="font-size: 0.9rem; opacity: 0.9;">
              Custom day-by-day itineraries with opening-hour awareness, crowd recommendations, ticket pricing &amp; travel times.
            </p>
          </div>
        </div>
      </div>

      <!-- Planner Form Card -->
      <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); padding: 24px; box-shadow: var(--shadow-sm); margin-bottom: 32px;">
        <h2 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 20px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: var(--color-primary);">tune</span>
          <span>Customize Your Trip Parameters</span>
        </h2>

        <form onsubmit="window.handleGenerateTripPlan(event)" style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Row 1: Country & Region -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Destination Country
              </label>
              <select 
                id="planner-country" 
                onchange="window.handlePlannerCountryChange(this.value)"
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              >
                ${COUNTRIES_LIST.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                State / Region
              </label>
              <select 
                id="planner-region" 
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              >
                ${REGIONS_MAP['India'].map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Row 2: Days, Budget, Starting Location -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Number of Days (1 - 14 Days)
              </label>
              <input 
                type="number" 
                id="planner-days" 
                min="1" 
                max="14" 
                value="3" 
                required
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Total Budget
              </label>
              <input 
                type="number" 
                id="planner-budget" 
                step="100" 
                min="100" 
                value="5000" 
                required
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Starting Location (City)
              </label>
              <input 
                type="text" 
                id="planner-start" 
                value="Chennai" 
                placeholder="e.g. Chennai, Paris, Tokyo..."
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              />
            </div>
          </div>

          <!-- Row 3: Companion & Style -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Travel Companion
              </label>
              <select 
                id="planner-companion" 
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              >
                <option value="Family" selected>Family with Kids/Elders</option>
                <option value="Solo">Solo Traveler</option>
                <option value="Friends">Friends Group</option>
                <option value="Couple">Couple / Romantic</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Preferred Travel Style
              </label>
              <select 
                id="planner-style" 
                style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;"
              >
                <option value="Budget">Budget / Backpacker</option>
                <option value="Moderate" selected>Moderate / Comfortable</option>
                <option value="Luxury">Luxury / Premium</option>
              </select>
            </div>
          </div>

          <!-- Row 4: Interests Multi-Select -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px;">
              Select Your Interests (Multi-select)
            </label>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;" id="planner-interests-container">
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Heritage & Forts" checked style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip active">🏛️ Heritage &amp; Forts</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Temples & Shrines" checked style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip active">🛕 Temples &amp; Shrines</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Beaches & Coastal" checked style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip active">🏖️ Beaches &amp; Coastal</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Mountains & Hills" style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip">⛰️ Mountains &amp; Hills</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Museums & Art" style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip">🖼️ Museums &amp; Art</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Food & Cuisine" style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip">🍜 Food &amp; Cuisine</span>
              </label>
              <label class="interest-chip" style="cursor: pointer;">
                <input type="checkbox" value="Photography & Hidden Gems" style="display: none;" onchange="this.nextElementSibling.classList.toggle('active', this.checked)"/>
                <span class="chip">📸 Photography &amp; Hidden Gems</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            style="padding: 14px; border-radius: var(--radius-md); font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;"
          >
            <span class="material-symbols-rounded">auto_awesome</span>
            <span>Generate Custom AI Itinerary</span>
          </button>

        </form>
      </div>

      <!-- Result Container -->
      <div id="planner-result-container">
        ${tripPlanResult ? renderTripPlanResult(tripPlanResult) : ''}
      </div>

    </div>
  `;
}

export function renderTripPlanResult(plan) {
  const symbol = plan.currencySymbol || '₹';

  return `
    <div class="plan-results scale-up" style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); padding: 24px; box-shadow: var(--shadow-md);">
      
      <!-- Summary Bar -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="material-symbols-rounded" style="color: #10b981;">task_alt</span>
            <span style="font-size: 0.8rem; font-weight: 700; color: #059669; text-transform: uppercase;">AI Generated Itinerary</span>
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0 0 2px 0;">
            ${plan.numDays}-Day ${plan.region} Trip starting from ${plan.startCity}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            Country: <strong>${plan.country}</strong> | Style: ${plan.style} | Companion: ${plan.companion}
          </p>
        </div>

        <div style="padding: 12px 18px; border-radius: var(--radius-lg); background: ${plan.isWithinBudget ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border: 1px solid ${plan.isWithinBudget ? '#10b981' : '#ef4444'}; text-align: right;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">ESTIMATED TOTAL EXPENSE</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: ${plan.isWithinBudget ? '#059669' : '#dc2626'};">
            ${symbol}${plan.totalEstimatedCost} <span style="font-size: 0.8rem; color: var(--text-muted);">/ ${symbol}${plan.budget} target</span>
          </div>
          <div style="font-size: 0.75rem; font-weight: 700; color: ${plan.isWithinBudget ? '#059669' : '#dc2626'}; margin-top: 2px;">
            ${plan.isWithinBudget ? '✅ Within Your Target Budget' : '⚠️ Exceeds Budget slightly'}
          </div>
        </div>
      </div>

      <!-- Day-by-Day Timeline -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${plan.itinerary.map(day => `
          <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-secondary);">
            <div style="padding: 12px 18px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0;">
                🗓️ ${day.title}
              </h4>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">
                Day Spend: ~${symbol}${day.estimatedDayExpense}
              </span>
            </div>

            <div style="padding: 16px; display: flex; flex-direction: column; gap: 14px;">
              ${day.schedule.map(s => `
                <div style="display: flex; gap: 14px; align-items: flex-start; padding: 12px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div style="font-size: 0.8rem; font-weight: 800; color: var(--color-primary); background: rgba(37,99,235,0.1); padding: 4px 8px; border-radius: 6px; white-space: nowrap;">
                    ${s.time}
                  </div>

                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                      <h5 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin: 0;">
                        ${s.place.name}
                      </h5>
                      <span style="font-size: 0.8rem; font-weight: 700; color: #059669;">
                        ${s.cost === 0 ? 'Free Activity' : `Ticket: ${symbol}${s.cost}`}
                      </span>
                    </div>

                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
                      ${s.activity}
                    </p>

                    ${s.place.id ? `
                      <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary" onclick="window.openMonumentDetail('${s.place.id}')" style="font-size: 0.75rem; padding: 4px 10px; border-radius: 4px;">
                          View Details
                        </button>
                        <button class="btn btn-primary" onclick="window.openBookingModal('${s.place.id}')" style="font-size: 0.75rem; padding: 4px 10px; border-radius: 4px;">
                          Book Ticket
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

const DEFAULT_START_CITIES = {
  'India': 'Chennai',
  'France': 'Paris',
  'Japan': 'Kyoto',
  'USA': 'New York',
  'Egypt': 'Cairo',
  'Italy': 'Rome',
  'UK': 'London',
  'Australia': 'Sydney',
  'Spain': 'Madrid',
  'UAE': 'Dubai'
};

const DEFAULT_COUNTRY_BUDGETS = {
  'India': 5000,
  'USA': 2000,
  'UK': 1500,
  'France': 1500,
  'Italy': 1500,
  'Spain': 1200,
  'Japan': 150000,
  'Egypt': 15000,
  'UAE': 5000,
  'Australia': 2000
};

window.handlePlannerCountryChange = (c) => {
  const regSelect = document.getElementById('planner-region');
  if (regSelect) {
    const list = REGIONS_MAP[c] || ['All Regions'];
    regSelect.innerHTML = list.map(r => `<option value="${r}">${r}</option>`).join('');
  }
  const startInput = document.getElementById('planner-start');
  if (startInput && DEFAULT_START_CITIES[c]) {
    startInput.value = DEFAULT_START_CITIES[c];
  }
  const budgetInput = document.getElementById('planner-budget');
  if (budgetInput && DEFAULT_COUNTRY_BUDGETS[c]) {
    budgetInput.value = DEFAULT_COUNTRY_BUDGETS[c];
  }
};

window.handleGenerateTripPlan = (e) => {
  e.preventDefault();
  const country   = document.getElementById('planner-country')?.value || 'India';
  const region    = document.getElementById('planner-region')?.value || 'Tamil Nadu';
  const days      = document.getElementById('planner-days')?.value || 3;
  const budget    = document.getElementById('planner-budget')?.value || 5000;
  const startCity = document.getElementById('planner-start')?.value || 'Chennai';
  const companion = document.getElementById('planner-companion')?.value || 'Family';
  const style     = document.getElementById('planner-style')?.value || 'Moderate';

  const container = document.getElementById('planner-interests-container');
  const checkboxes = container ? container.querySelectorAll('input[type="checkbox"]:checked') : [];
  const interests = Array.from(checkboxes).map(cb => cb.value);

  tripPlanResult = generatePersonalizedTripPlan({
    days,
    budget,
    country,
    region,
    startCity,
    interests,
    companion,
    style
  });

  const resContainer = document.getElementById('planner-result-container');
  if (resContainer) {
    resContainer.innerHTML = renderTripPlanResult(tripPlanResult);
    resContainer.scrollIntoView({ behavior: 'smooth' });
  }
};
