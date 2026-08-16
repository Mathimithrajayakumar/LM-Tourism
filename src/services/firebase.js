// src/services/firebase.js
// Firebase v10 Modular SDK — initialised once for the entire app.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitialization12345",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lm-tourism.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "lm-tourism",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lm-tourism.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

let app, auth, db;
try {
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (err) {
  console.warn('[Firebase] Fallback initialization notice:', err);
}

export { app, auth, db };

