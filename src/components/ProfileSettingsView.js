// src/components/ProfileSettingsView.js
import { StorageService } from '../services/storage.js';
import { t, LANGUAGES }   from '../services/i18n.js';

export function renderProfileSettingsView(currentUser = null, totalMonuments = 0) {
  const theme             = StorageService.getTheme();
  const currentLang       = currentUser?.preferredLanguage || StorageService.getLanguage() || 'en';
  const notificationsOn   = currentUser?.notificationsEnabled !== false;
  const bookmarkCount     = (currentUser?.bookmarks || []).length;
  const aiChatCount       = currentUser?.aiChatCount || 0;

  return `
    <div style="padding: 16px;">
      <!-- Profile Header Card -->
      <div style="background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: var(--radius-lg); padding: 28px 24px; text-align: center; box-shadow: var(--shadow-md); margin-bottom: 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 12px auto; display: flex; align-items: center; justify-content: center; font-size: 40px; border: 2px solid rgba(255,255,255,0.3);">
          <span class="material-symbols-rounded" style="font-size: 48px;">person</span>
        </div>
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700;">${currentUser?.name || 'Explorer'}</h2>
        <p style="opacity: 0.85; font-size: 0.9rem;">${currentUser?.email || ''}</p>
        <span style="display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;">
          ${currentUser?.isGuest ? 'Guest Explorer Mode' : t('verified_traveler')}
        </span>

        <!-- Stats Row -->
        <div style="display: flex; justify-content: space-around; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px;">
          <div>
            <div style="font-weight: 800; font-size: 1.25rem;">${bookmarkCount}</div>
            <div style="font-size: 0.75rem; opacity: 0.8;">${t('favourites_stat')}</div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.25rem;">${totalMonuments}</div>
            <div style="font-size: 0.75rem; opacity: 0.8;">${t('monuments_stat')}</div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.25rem;">${aiChatCount}</div>
            <div style="font-size: 0.75rem; opacity: 0.8;">${t('ai_chats_stat')}</div>
          </div>
        </div>
      </div>

      <!-- Settings Section -->
      <h3 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 12px;">${t('app_preferences')}</h3>
      
      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px;">
        
        <!-- Theme Toggle -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="material-symbols-rounded" style="color: var(--color-primary);">dark_mode</span>
            <div>
              <div style="font-weight: 600; font-size: 0.95rem;">${t('dark_theme')}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${t('dark_theme_desc')}</div>
            </div>
          </div>
          <button class="chip ${theme === 'dark' ? 'active' : ''}" onclick="window.toggleTheme()" style="padding: 6px 16px; min-width:52px;">
            ${theme === 'dark' ? t('on') : t('off')}
          </button>
        </div>

        <!-- Language Selector -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.openLanguageModal()">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="material-symbols-rounded" style="color: var(--color-primary);">language</span>
            <div>
              <div style="font-weight: 600; font-size: 0.95rem;">${t('language')}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${(LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]).nativeLabel} (${(LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]).label})</div>
            </div>
          </div>
          <button class="chip active" onclick="event.stopPropagation(); window.openLanguageModal()" style="padding: 6px 16px; font-weight: 700;">
            ${t('select_language')}
          </button>
        </div>

        <!-- Notifications Toggle -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="material-symbols-rounded" style="color: var(--color-primary);">notifications</span>
            <div>
              <div style="font-weight: 600; font-size: 0.95rem;">${t('notifications')}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${t('notifications_desc')}</div>
            </div>
          </div>
          <button class="chip ${notificationsOn ? 'active' : ''}" onclick="window.toggleNotifications()" style="padding: 6px 16px; min-width:52px;">
            ${notificationsOn ? t('on') : t('off')}
          </button>
        </div>

        <!-- Logout -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="material-symbols-rounded" style="color: var(--color-danger);">logout</span>
            <div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--color-danger);">${t('logout')}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Sign out of your account</div>
            </div>
          </div>
          <button
            class="chip"
            onclick="window.logout()"
            style="padding: 6px 16px; color: var(--color-danger); border-color: var(--color-danger);"
          >
            ${t('logout')}
          </button>
        </div>

      </div>

      <!-- About & Version -->
      <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 16px 0;">
        <p>LM Tourism Web v2.0.0</p>
        <p style="margin-top: 4px;">Explore History Through AI and AR</p>
      </div>
    </div>
  `;
}
