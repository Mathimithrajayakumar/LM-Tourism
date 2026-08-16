// src/services/monuments.js
// Firestore monument service — replaces static src/data/monuments.js import.
// Collection: monuments
// Supports hundreds of documents with client-side search/filter.

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION = 'monuments';

// ─── Module-level cache ───────────────────────────────────────────────────────
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Fetch All Monuments ──────────────────────────────────────────────────────
/**
 * Fetches all monuments from Firestore with a 5-minute in-memory cache.
 * Returns an array of monument objects (same shape as the old static array).
 */
export async function fetchAllMonuments() {
  const now = Date.now();
  if (_cache && (now - _cacheTime) < CACHE_TTL_MS) {
    return _cache;
  }

  try {
    const q    = query(collection(db, COLLECTION), orderBy('rating', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty && snap.docs.length >= 25) {
      _cache     = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      _cacheTime = now;
      return _cache;
    }
    const { MONUMENTS } = await import('../data/monuments.js');
    _cache = MONUMENTS;
    _cacheTime = now;
    return MONUMENTS;
  } catch (err) {
    console.error('[monuments] Firestore fetch failed, falling back to static data:', err);
    // Graceful fallback to static data if Firestore is unavailable
    const { MONUMENTS } = await import('../data/monuments.js');
    _cache = MONUMENTS;
    _cacheTime = now;
    return MONUMENTS;
  }
}

// ─── Fetch Single Monument ────────────────────────────────────────────────────
export async function fetchMonumentById(id) {
  // Check cache first
  if (_cache) {
    const cached = _cache.find(m => m.id === id);
    if (cached) return cached;
  }

  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (err) {
    console.error('[monuments] Failed to fetch monument by id:', id, err);
    return null;
  }
}

// ─── Fetch By Category ────────────────────────────────────────────────────────
export async function fetchByCategory(category) {
  if (category === 'All') return fetchAllMonuments();

  // Use cache if available
  if (_cache) {
    return _cache.filter(m => m.category === category);
  }

  try {
    const q    = query(collection(db, COLLECTION), where('category', '==', category), orderBy('rating', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const all = await fetchAllMonuments();
    return all.filter(m => m.category === category);
  }
}

// ─── Client-Side Search ───────────────────────────────────────────────────────
/**
 * Filters the cached monuments array by search query.
 * Searches name, city, state, country, and tags.
 */
export function searchMonuments(monuments, query) {
  if (!query || !query.trim()) return monuments;
  const q = query.toLowerCase().trim();
  return monuments.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.city.toLowerCase().includes(q) ||
    (m.state || '').toLowerCase().includes(q) ||
    (m.country || '').toLowerCase().includes(q) ||
    (m.category || '').toLowerCase().includes(q) ||
    (m.description || '').toLowerCase().includes(q) ||
    (m.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

// ─── Invalidate Cache ─────────────────────────────────────────────────────────
export function invalidateMonumentCache() {
  _cache = null;
  _cacheTime = 0;
}
