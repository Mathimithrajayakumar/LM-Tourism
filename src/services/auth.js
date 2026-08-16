// src/services/auth.js
// Clean Firebase Authentication helpers for ChronosAR.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase.js';
import { createProfile, getProfile } from './userProfile.js';
import { StorageService } from './storage.js';

// ─── Auth Error Code → Human-Readable Messages ───────────────────────────────
const AUTH_ERRORS = {
  'auth/email-already-in-use':    'An account with this email already exists. Please sign in instead.',
  'auth/invalid-email':           'Please enter a valid email address.',
  'auth/weak-password':           'Password must be at least 6 characters.',
  'auth/user-not-found':          'No account found with this email address.',
  'auth/wrong-password':          'Incorrect password. Please try again.',
  'auth/invalid-credential':      'Incorrect email or password. Please try again.',
  'auth/too-many-requests':       'Too many failed attempts. Please wait a moment and try again.',
  'auth/network-request-failed':  'Network error. Please check your connection.',
  'auth/user-disabled':           'This account has been disabled. Please contact support.',
};

export function getAuthErrorMessage(code) {
  return AUTH_ERRORS[code] || 'An unexpected error occurred. Please try again.';
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────
/**
 * Creates a new Firebase Auth user and writes a Firestore profile doc.
 * Firebase natively prevents duplicate emails (throws auth/email-already-in-use).
 */
export async function signUp(name, email, password) {
  // Always use local persistence for new accounts
  await setPersistence(auth, browserLocalPersistence);

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Set display name on the auth profile
  await updateProfile(user, { displayName: name });

  // Write Firestore user profile document
  await createProfile(user.uid, name, email);

  return user;
}

// ─── Sign In ─────────────────────────────────────────────────────────────────
/**
 * Signs in an existing user with email/password.
 * @param {boolean} rememberMe — if true, persists session across browser restarts.
 */
export async function signIn(email, password, rememberMe = false) {
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
  StorageService.setRememberMe(rememberMe);

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Sign Out ────────────────────────────────────────────────────────────────
export async function signOut() {
  await fbSignOut(auth);
  StorageService.setRememberMe(false);
}

// ─── Forgot Password ─────────────────────────────────────────────────────────
export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

// ─── Auth State Observer ─────────────────────────────────────────────────────
/**
 * Subscribes to auth state changes. When a user logs in, merges their
 * Firestore profile into the returned object. Calls callback(userObject | null).
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const profile = await getProfile(firebaseUser.uid);
      callback({
        uid:               firebaseUser.uid,
        name:              profile?.name || firebaseUser.displayName || 'Explorer',
        email:             firebaseUser.email,
        preferredLanguage: profile?.preferredLanguage || 'en',
        theme:             profile?.theme || 'light',
        bookmarks:         profile?.bookmarks || [],
        searchHistory:     profile?.searchHistory || [],
        aiChatCount:       profile?.aiChatCount || 0,
        notificationsEnabled: profile?.notificationsEnabled !== false,
        isGuest:           false,
      });
    } catch (err) {
      console.warn('[auth] Failed to load Firestore profile, using basic user:', err);
      callback({
        uid:               firebaseUser.uid,
        name:              firebaseUser.displayName || 'Explorer',
        email:             firebaseUser.email,
        preferredLanguage: 'en',
        theme:             'light',
        bookmarks:         [],
        searchHistory:     [],
        aiChatCount:       0,
        notificationsEnabled: true,
        isGuest:           false,
      });
    }
  });
}

// ─── Get Current Firebase User ───────────────────────────────────────────────
export function getCurrentFirebaseUser() {
  return auth.currentUser;
}
