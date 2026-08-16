// src/services/userProfile.js
// Firestore CRUD helpers for user profile documents.
// Collection: users/{uid}

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION = 'users';

// ─── Create Profile (called once on signup) ───────────────────────────────────
export async function createProfile(uid, name, email) {
  const ref = doc(db, COLLECTION, uid);
  await setDoc(ref, {
    name,
    email,
    preferredLanguage:   'en',
    theme:               'light',
    bookmarks:           [],
    searchHistory:       [],
    aiChatCount:         0,
    notificationsEnabled: true,
    createdAt:           serverTimestamp(),
    lastLoginAt:         serverTimestamp(),
  });
}

// ─── Get Profile ─────────────────────────────────────────────────────────────
export async function getProfile(uid) {
  const ref  = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// ─── Update Profile Fields ────────────────────────────────────────────────────
export async function updateProfile(uid, data) {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, { ...data, lastLoginAt: serverTimestamp() });
}

// ─── Toggle Bookmark ──────────────────────────────────────────────────────────
/**
 * Adds monumentId to bookmarks if not present, removes if present.
 * Returns the new bookmarks array by fetching fresh after update.
 */
export async function toggleBookmark(uid, monumentId, isCurrentlyBookmarked) {
  const ref = doc(db, COLLECTION, uid);
  if (isCurrentlyBookmarked) {
    await updateDoc(ref, { bookmarks: arrayRemove(monumentId) });
  } else {
    await updateDoc(ref, { bookmarks: arrayUnion(monumentId) });
  }
  // Return refreshed bookmarks list
  const snap = await getDoc(ref);
  return snap.data()?.bookmarks || [];
}

// ─── Add Search History Entry ─────────────────────────────────────────────────
/**
 * Prepends a query to searchHistory and trims to the 10 most recent.
 */
export async function addSearchHistory(uid, query) {
  if (!query || !query.trim()) return;
  const ref  = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  const current = snap.data()?.searchHistory || [];

  // Deduplicate and prepend
  const updated = [query.trim(), ...current.filter(q => q !== query.trim())].slice(0, 10);
  await updateDoc(ref, { searchHistory: updated });
  return updated;
}

// ─── Increment AI Chat Count ──────────────────────────────────────────────────
export async function incrementAiChatCount(uid) {
  const ref  = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  const current = snap.data()?.aiChatCount || 0;
  await updateDoc(ref, { aiChatCount: current + 1 });
}
