// src/components/EmergencyView.js
// Emergency & Tourist Safety Information Center for Tamil Nadu

import { EMERGENCY_CONTACTS } from '../data/tamilNaduData.js';

export function renderEmergencyView() {
  return `
    <div class="emergency-view fade-in" style="padding: 16px; max-width: 1000px; margin: 0 auto 100px;">
      
      <!-- Banner -->
      <div style="background: linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #b45309 100%); border-radius: var(--radius-xl); padding: 24px; color: white; margin-bottom: 24px; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span class="material-symbols-rounded" style="font-size: 40px; color: #fef08a;">medical_services</span>
          <div>
            <h1 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 0;">
              Emergency & Tourist Safety Support
            </h1>
            <p style="font-size: 0.9rem; opacity: 0.95;">
              Important helpline numbers, police contacts, government hospital directories, and tourist assistance.
            </p>
          </div>
        </div>
      </div>

      <!-- Emergency Hotlines Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-card); border: 2px solid #ef4444; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span class="material-symbols-rounded" style="color: #dc2626;">headset_mic</span>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">TN TOURISM HELPLINE</div>
          </div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #dc2626;">
            1800-425-31111
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">24/7 Toll-Free Tourist Support</div>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-card); border: 2px solid #3b82f6; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span class="material-symbols-rounded" style="color: #2563eb;">local_police</span>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">POLICE CONTROL ROOM</div>
          </div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #2563eb;">
            100
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Immediate Police Emergency</div>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-card); border: 2px solid #10b981; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span class="material-symbols-rounded" style="color: #059669;">airport_shuttle</span>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">AMBULANCE & MEDICAL</div>
          </div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #059669;">
            108
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Emergency Medical Services</div>
        </div>

        <div style="padding: 16px; border-radius: var(--radius-lg); background: var(--bg-card); border: 2px solid #ec4899; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span class="material-symbols-rounded" style="color: #db2777;">female</span>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">WOMEN HELPLINE</div>
          </div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #db2777;">
            1091
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Women Tourist Safety</div>
        </div>
      </div>

      <!-- District Government Hospital Directory -->
      <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); padding: 20px; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
        <h2 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: #ef4444;">local_hospital</span>
          <span>District Government Hospitals & Medical Centers</span>
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
          ${EMERGENCY_CONTACTS.hospitals.map(h => `
            <div style="padding: 12px 14px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--color-primary);">${h.city}</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${h.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-top: 4px;">📞 ${h.phone}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tourist Tips & Advice -->
      <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); padding: 20px; box-shadow: var(--shadow-sm);">
        <h2 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: #f59e0b;">info</span>
          <span>Essential Safety & Travel Guidelines</span>
        </h2>

        <ul style="margin: 0; padding-left: 20px; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>Temple Dress Code:</strong> Modest attire (traditional dhotis/sarees/salwars) is mandatory in major temples like Meenakshi Amman and Brihadeeswarar.</li>
          <li><strong>Ocean & Waterfall Caution:</strong> Always respect warning signboards and avoid bathing in deep current sea pockets at Marina or Dhanushkodi.</li>
          <li><strong>Ghat Road Driving:</strong> When driving in hill stations like Ooty (36 hairpin bends) or Kolli Hills (70 bends), keep left and use horn around blind curves.</li>
        </ul>
      </div>

    </div>
  `;
}
