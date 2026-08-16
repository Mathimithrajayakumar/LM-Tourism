// src/components/AuthView.js
// Authentication UI — Login, Sign-up, Forgot Password.
// Uses existing CSS design tokens (no new colours or fonts).
// Three internal modes toggled by `authMode` state variable.

import { signIn, signUp, sendPasswordReset, getAuthErrorMessage } from '../services/auth.js';
import { t } from '../services/i18n.js';

// ─── Internal state ───────────────────────────────────────────────────────────
let authMode   = 'login';   // 'login' | 'signup' | 'forgot'
let authError  = '';
let authSuccess = '';
let isLoading  = false;

export function setAuthMode(mode) {
  authMode   = mode;
  authError  = '';
  authSuccess = '';
  isLoading  = false;
}

// ─── Render ───────────────────────────────────────────────────────────────────
export function renderAuthView() {
  return `
    <div class="auth-backdrop">
      <div class="auth-card">

        <!-- Brand Logo -->
        <div style="text-align:center; margin-bottom:28px;">
          <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:8px;">
            <div class="brand-icon">
              <span class="material-symbols-rounded">account_balance</span>
            </div>
            <span class="brand-title" style="font-size:1.4rem;">LM Tourism</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted);">AI & AR Heritage Explorer</p>
        </div>

        ${authMode === 'login'  ? renderLoginForm()  : ''}
        ${authMode === 'signup' ? renderSignupForm() : ''}
        ${authMode === 'forgot' ? renderForgotForm() : ''}

      </div>
    </div>
  `;
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function renderLoginForm() {
  return `
    <div>
      <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; margin-bottom:4px;">${t('welcome_back')}</h2>
      <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:24px;">${t('sign_in_desc')}</p>

      ${authError ? `<div class="auth-error"><span class="material-symbols-rounded" style="font-size:18px;">error</span>${authError}</div>` : ''}

      <form id="auth-login-form" onsubmit="event.preventDefault(); window._authHandleLogin();" style="display:flex; flex-direction:column; gap:16px;">

        <div class="auth-field">
          <label class="auth-label">${t('email')}</label>
          <input
            id="auth-login-email"
            type="email"
            class="auth-input"
            placeholder="you@email.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">${t('password')}</label>
          <div style="position:relative;">
            <input
              id="auth-login-password"
              type="password"
              class="auth-input"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              style="padding-right:48px;"
            />
            <button type="button" class="auth-eye-btn" onclick="window._authTogglePwd('auth-login-password', this)" title="Show/hide password">
              <span class="material-symbols-rounded" style="font-size:20px;">visibility</span>
            </button>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.875rem; color:var(--text-secondary);">
            <input id="auth-remember-me" type="checkbox" style="width:16px; height:16px; accent-color:var(--color-primary); cursor:pointer;" />
            ${t('remember_me')}
          </label>
          <button type="button" style="font-size:0.875rem; color:var(--color-primary); font-weight:600;" onclick="window._authSetMode('forgot')">${t('forgot_password')}</button>
        </div>

        <button type="submit" class="auth-submit-btn" id="auth-login-submit" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? `<span class="auth-spinner"></span> ${t('loading')}` : t('sign_in_btn')}
        </button>

      </form>

      <p style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
        ${t('no_account')}
        <button type="button" style="color:var(--color-primary); font-weight:700; margin-left:4px;" onclick="window._authSetMode('signup')">${t('create_account')}</button>
      </p>
    </div>
  `;
}

// ─── Sign-up Form ─────────────────────────────────────────────────────────────
function renderSignupForm() {
  return `
    <div>
      <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; margin-bottom:4px;">${t('create_account')}</h2>
      <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:24px;">Join ChronosAR to explore India's heritage.</p>

      ${authError ? `<div class="auth-error"><span class="material-symbols-rounded" style="font-size:18px;">error</span>${authError}</div>` : ''}

      <form id="auth-signup-form" onsubmit="event.preventDefault(); window._authHandleSignup();" style="display:flex; flex-direction:column; gap:16px;">

        <div class="auth-field">
          <label class="auth-label">${t('full_name')}</label>
          <input id="auth-signup-name" type="text" class="auth-input" placeholder="Your full name" autocomplete="name" required />
        </div>

        <div class="auth-field">
          <label class="auth-label">${t('email')}</label>
          <input id="auth-signup-email" type="email" class="auth-input" placeholder="you@email.com" autocomplete="email" required />
        </div>

        <div class="auth-field">
          <label class="auth-label">${t('password')}</label>
          <div style="position:relative;">
            <input id="auth-signup-password" type="password" class="auth-input" placeholder="Min. 6 characters" autocomplete="new-password" required minlength="6" style="padding-right:48px;" />
            <button type="button" class="auth-eye-btn" onclick="window._authTogglePwd('auth-signup-password', this)" title="Show/hide password">
              <span class="material-symbols-rounded" style="font-size:20px;">visibility</span>
            </button>
          </div>
        </div>

        <div class="auth-field">
          <label class="auth-label">${t('confirm_password')}</label>
          <div style="position:relative;">
            <input id="auth-signup-confirm" type="password" class="auth-input" placeholder="Repeat password" autocomplete="new-password" required minlength="6" style="padding-right:48px;" />
            <button type="button" class="auth-eye-btn" onclick="window._authTogglePwd('auth-signup-confirm', this)" title="Show/hide password">
              <span class="material-symbols-rounded" style="font-size:20px;">visibility</span>
            </button>
          </div>
        </div>

        <button type="submit" class="auth-submit-btn" id="auth-signup-submit" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? `<span class="auth-spinner"></span> ${t('loading')}` : t('sign_up_btn')}
        </button>

      </form>

      <p style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
        ${t('has_account')}
        <button type="button" style="color:var(--color-primary); font-weight:700; margin-left:4px;" onclick="window._authSetMode('login')">${t('sign_in_btn')}</button>
      </p>
    </div>
  `;
}

// ─── Forgot Password Form ─────────────────────────────────────────────────────
function renderForgotForm() {
  return `
    <div>
      <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; margin-bottom:4px;">${t('reset_password')}</h2>
      <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:24px;">Enter your email and we'll send you a reset link.</p>

      ${authError   ? `<div class="auth-error"><span class="material-symbols-rounded" style="font-size:18px;">error</span>${authError}</div>`    : ''}
      ${authSuccess ? `<div class="auth-success"><span class="material-symbols-rounded" style="font-size:18px;">check_circle</span>${authSuccess}</div>` : ''}

      <form id="auth-forgot-form" onsubmit="event.preventDefault(); window._authHandleForgot();" style="display:flex; flex-direction:column; gap:16px;">

        <div class="auth-field">
          <label class="auth-label">${t('email')}</label>
          <input id="auth-forgot-email" type="email" class="auth-input" placeholder="you@email.com" autocomplete="email" required />
        </div>

        <button type="submit" class="auth-submit-btn" id="auth-forgot-submit" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? `<span class="auth-spinner"></span> ${t('loading')}` : 'Send Reset Link'}
        </button>

      </form>

      <p style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
        <button type="button" style="color:var(--color-primary); font-weight:700;" onclick="window._authSetMode('login')">
          <span class="material-symbols-rounded" style="font-size:16px; vertical-align:middle;">arrow_back</span>
          Back to Sign In
        </button>
      </p>
    </div>
  `;
}

// ─── Event Handlers (attached to window for inline HTML use) ──────────────────

window._authSetMode = (mode) => {
  setAuthMode(mode);
  if (window.renderApp) window.renderApp();
};

window._authTogglePwd = (inputId, btn) => {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  const icon = btn.querySelector('.material-symbols-rounded');
  if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
};

window._authHandleLogin = async () => {
  const email    = document.getElementById('auth-login-email')?.value?.trim();
  const password = document.getElementById('auth-login-password')?.value;
  const remember = document.getElementById('auth-remember-me')?.checked || false;

  if (!email || !password) {
    authError = 'Please fill in all fields.';
    if (window.renderApp) window.renderApp();
    return;
  }

  isLoading = true;
  authError = '';
  if (window.renderApp) window.renderApp();

  try {
    await signIn(email, password, remember);
    // onAuthStateChanged in app.js will trigger re-render with authenticated state
  } catch (err) {
    isLoading = false;
    authError = getAuthErrorMessage(err.code);
    if (window.renderApp) window.renderApp();
  }
};

window._authHandleSignup = async () => {
  const name     = document.getElementById('auth-signup-name')?.value?.trim();
  const email    = document.getElementById('auth-signup-email')?.value?.trim();
  const password = document.getElementById('auth-signup-password')?.value;
  const confirm  = document.getElementById('auth-signup-confirm')?.value;

  if (!name || !email || !password || !confirm) {
    authError = 'Please fill in all fields.';
    if (window.renderApp) window.renderApp();
    return;
  }

  if (password !== confirm) {
    authError = 'Passwords do not match. Please try again.';
    if (window.renderApp) window.renderApp();
    return;
  }

  if (password.length < 6) {
    authError = 'Password must be at least 6 characters.';
    if (window.renderApp) window.renderApp();
    return;
  }

  isLoading = true;
  authError = '';
  if (window.renderApp) window.renderApp();

  try {
    await signUp(name, email, password);
    // onAuthStateChanged will take over and re-render the app
  } catch (err) {
    isLoading = false;
    authError = getAuthErrorMessage(err.code);
    if (window.renderApp) window.renderApp();
  }
};

window._authHandleForgot = async () => {
  const email = document.getElementById('auth-forgot-email')?.value?.trim();

  if (!email) {
    authError = 'Please enter your email address.';
    if (window.renderApp) window.renderApp();
    return;
  }

  isLoading = true;
  authError = '';
  authSuccess = '';
  if (window.renderApp) window.renderApp();

  try {
    await sendPasswordReset(email);
    isLoading  = false;
    authSuccess = t('reset_sent');
    if (window.renderApp) window.renderApp();
  } catch (err) {
    isLoading = false;
    authError = getAuthErrorMessage(err.code);
    if (window.renderApp) window.renderApp();
  }
};
