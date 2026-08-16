// src/components/CrowdVisualization.js
// Reusable Visitor Information & Crowd Level Visualization Component for LM Tourism

/**
 * Renders a full Crowd Information & Visitor Timing block
 * @param {Object} data - Contains crowdLevel, crowdByTime, bestVisitingTimeWindow, avoidPeakTime, openingTime, closingTime, daysOpen, closedDay
 */
export function renderCrowdVisualization(data = {}) {
  const crowdLevel = data.crowdLevel || 'Medium'; // 'Low' | 'Medium' | 'High'
  const isLow    = crowdLevel.toLowerCase() === 'low';
  const isHigh   = crowdLevel.toLowerCase() === 'high';
  
  // Badge styling
  const badgeBg    = isLow ? '#d1fae5' : isHigh ? '#fee2e2' : '#fef3c7';
  const badgeColor = isLow ? '#065f46' : isHigh ? '#991b1b' : '#92400e';
  const badgeDot   = isLow ? '🟢' : isHigh ? '🔴' : '🟡';
  const badgeLabel = isLow ? 'Low Crowd' : isHigh ? 'High Crowd' : 'Medium Crowd';

  // Slider position (percentage)
  const meterPercent = isLow ? 25 : isHigh ? 85 : 55;

  // Hourly Crowd Breakdown data (fallback if missing)
  const defaultHourly = [
    { time: '06:00 AM', level: 'Low',    icon: '🟢' },
    { time: '08:00 AM', level: 'Low',    icon: '🟢' },
    { time: '10:00 AM', level: 'Medium', icon: '🟡' },
    { time: '12:00 PM', level: 'High',   icon: '🔴' },
    { time: '02:00 PM', level: 'High',   icon: '🔴' },
    { time: '04:00 PM', level: 'Medium', icon: '🟡' },
    { time: '06:00 PM', level: 'Medium', icon: '🟡' },
    { time: '08:00 PM', level: 'Low',    icon: '🟢' },
  ];

  const hourlyList = (data.crowdByTime && data.crowdByTime.length > 0) ? data.crowdByTime : defaultHourly;

  const opening   = data.openingTime || '06:00 AM';
  const closing   = data.closingTime || '08:00 PM';
  const daysOpen  = data.daysOpen    || 'Open Daily';
  const closedDay = data.closedDay   || 'None';

  const bestWindow  = data.bestVisitingTimeWindow || data.suggestedVisitTime || '06:00 AM – 09:00 AM';
  const avoidWindow = data.avoidPeakTime || data.peakHours || '11:00 AM – 02:00 PM';

  return `
    <div class="crowd-vis-container" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px; margin-top: 16px;">
      
      <!-- Section Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: #2563eb;">groups</span>
          <span>Visitor Timings & Crowd Density</span>
        </h4>
        <span style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.8rem; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 6px;">
          <span>${badgeDot}</span>
          <span>Estimated Crowd: ${badgeLabel}</span>
        </span>
      </div>

      <!-- Opening Timings Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px;">
        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">
            🕐 Opening Hours
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">
            ${opening} – ${closing}
          </div>
        </div>

        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">
            🗓️ Days & Closure
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">
            ${daysOpen} ${closedDay !== 'None' ? `<span style="color:#ef4444; font-size:0.85rem;">(Closed: ${closedDay})</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Crowd Level Meter (LOW ────●────── HIGH) -->
      <div style="background: var(--bg-card); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px;">
          <span>🟢 LOW CROWD</span>
          <span>🟡 MEDIUM CROWD</span>
          <span>🔴 HIGH CROWD</span>
        </div>

        <!-- Progress bar track -->
        <div style="position: relative; height: 10px; background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%); border-radius: 5px; margin: 10px 0 14px;">
          <div style="position: absolute; top: -6px; left: calc(${meterPercent}% - 11px); width: 22px; height: 22px; border-radius: 50%; background: var(--bg-card); border: 3px solid ${badgeColor}; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: left 0.3s ease;"></div>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">
          ℹ️ <em>Typical crowd pattern based on historical visitor distribution.</em>
        </div>
      </div>

      <!-- Best Time to Visit Recommendations -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px;">
        <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); padding: 12px 14px; border-radius: var(--radius-md);">
          <div style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span class="material-symbols-rounded" style="font-size: 16px;">star</span>
            <span>Recommended Visit Window</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: #065f46;">
            ⭐ ${bestWindow}
          </div>
          <div style="font-size: 0.75rem; color: #047857; margin-top: 2px;">
            Enjoy shorter lines and pleasant lighting for photography.
          </div>
        </div>

        <div style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); padding: 12px 14px; border-radius: var(--radius-md);">
          <div style="font-size: 0.75rem; font-weight: 800; color: #dc2626; text-transform: uppercase; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span class="material-symbols-rounded" style="font-size: 16px;">warning</span>
            <span>Avoid Peak Hours</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: #991b1b;">
            ⚠️ ${avoidWindow}
          </div>
          <div style="font-size: 0.75rem; color: #b91c1c; margin-top: 2px;">
            Expect longest wait times and largest tour groups.
          </div>
        </div>
      </div>

      <!-- Crowd by Time (Hourly Schedule Grid) -->
      <div>
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span class="material-symbols-rounded" style="font-size: 18px; color: #6366f1;">bar_chart</span>
          <span>Crowd Expectation by Time of Day</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px;">
          ${hourlyList.map(h => {
            const hLvl = (h.level || 'Low').toLowerCase();
            const hBg  = hLvl === 'low' ? 'rgba(16,185,129,0.12)' : hLvl === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)';
            const hColor = hLvl === 'low' ? '#059669' : hLvl === 'high' ? '#dc2626' : '#d97706';
            const hDot   = hLvl === 'low' ? '🟢' : hLvl === 'high' ? '🔴' : '🟡';

            return `
              <div style="background: ${hBg}; border: 1px solid ${hColor}33; border-radius: var(--radius-md); padding: 8px 10px; text-align: center;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">${h.time}</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: ${hColor}; margin-top: 2px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span>${hDot}</span>
                  <span>${h.level}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}
