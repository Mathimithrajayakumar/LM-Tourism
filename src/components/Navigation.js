// src/components/Navigation.js — Global LM Tourism Platform Navigation
import { t, getLanguageObj } from '../services/i18n.js';

export function renderHeader(currentTab, isDarkMode) {
  const currentLang = getLanguageObj();

  return `
    <header class="app-header">
      <a href="#" class="brand-logo" onclick="event.preventDefault(); window.navigateTo('home');">
        <div class="brand-icon">
          <span class="material-symbols-rounded">public</span>
        </div>
        <span class="brand-title">LM Tourism</span>
      </a>

      <nav class="desktop-nav">
        <button class="nav-link ${currentTab === 'home' ? 'active' : ''}" onclick="window.navigateTo('home')">
          <span class="material-symbols-rounded">home</span> ${t('nav_home') || 'Home'}
        </button>
        <button class="nav-link ${currentTab === 'explore' ? 'active' : ''}" onclick="window.navigateTo('explore')">
          <span class="material-symbols-rounded">explore</span> ${t('nav_explore') || 'Explore'}
        </button>
        <button class="nav-link ${currentTab === 'planner' ? 'active' : ''}" onclick="window.navigateTo('planner')">
          <span class="material-symbols-rounded">event_note</span> Trip Planner
        </button>
        <button class="nav-link ${currentTab === 'chatbot' ? 'active' : ''}" onclick="window.navigateTo('chatbot')">
          <span class="material-symbols-rounded">smart_toy</span> AI Guide
        </button>
        <button class="nav-link ${currentTab === 'favorites' ? 'active' : ''}" onclick="window.navigateTo('favorites')">
          <span class="material-symbols-rounded">favorite</span> ${t('nav_favourites') || 'Saved'}
        </button>
        <button class="nav-link ${currentTab === 'profile' ? 'active' : ''}" onclick="window.navigateTo('profile')">
          <span class="material-symbols-rounded">person</span> ${t('nav_profile') || 'Profile'}
        </button>
      </nav>

      <div class="header-actions">
        <!-- AI Assistant Quick Launch Button -->
        <button class="btn" onclick="window.navigateTo('chatbot')" style="background: linear-gradient(135deg, #2563eb, #8b5cf6); color: white; border: none; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 4px;">
          <span class="material-symbols-rounded" style="font-size: 16px;">smart_toy</span>
          <span>AI Guide</span>
        </button>

        <!-- Language Selector Button -->
        <button class="icon-btn" onclick="window.openLanguageModal()" title="${t('select_language') || 'Language'}" style="display: flex; align-items: center; gap: 4px; padding: 6px 10px; width: auto; border-radius: var(--radius-full);">
          <span class="material-symbols-rounded" style="font-size: 20px;">language</span>
          <span style="font-size: 0.8rem; font-weight: 700;">${currentLang.nativeLabel}</span>
        </button>

        <button class="icon-btn" onclick="window.toggleTheme()" title="Toggle Theme">
          <span class="material-symbols-rounded">${isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>
    </header>
  `;
}

export function renderBottomNav(currentTab) {
  return `
    <nav class="bottom-nav">
      <button class="bottom-tab ${currentTab === 'home' ? 'active' : ''}" onclick="window.navigateTo('home')">
        <span class="material-symbols-rounded">home</span>
        <span>${t('nav_home') || 'Home'}</span>
      </button>
      <button class="bottom-tab ${currentTab === 'explore' ? 'active' : ''}" onclick="window.navigateTo('explore')">
        <span class="material-symbols-rounded">explore</span>
        <span>${t('nav_explore') || 'Explore'}</span>
      </button>
      <button class="bottom-tab ${currentTab === 'planner' ? 'active' : ''}" onclick="window.navigateTo('planner')">
        <span class="material-symbols-rounded">event_note</span>
        <span>Planner</span>
      </button>
      <button class="bottom-tab ${currentTab === 'chatbot' ? 'active' : ''}" onclick="window.navigateTo('chatbot')">
        <span class="material-symbols-rounded">smart_toy</span>
        <span>AI Guide</span>
      </button>
      <button class="bottom-tab ${currentTab === 'favorites' ? 'active' : ''}" onclick="window.navigateTo('favorites')">
        <span class="material-symbols-rounded">favorite</span>
        <span>${t('nav_favourites') || 'Saved'}</span>
      </button>
      <button class="bottom-tab ${currentTab === 'profile' ? 'active' : ''}" onclick="window.navigateTo('profile')">
        <span class="material-symbols-rounded">person</span>
        <span>${t('nav_profile') || 'Profile'}</span>
      </button>
    </nav>
  `;
}
