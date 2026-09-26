import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration provided by Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDI-1hIHMi9HjLCpob7kto2kh56Uu5pBSY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "e-book-1b4d4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "e-book-1b4d4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "e-book-1b4d4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "813933033349",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:813933033349:web:fcdc02fd50114ac783b6ec",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-W7C6X2Q4DV"
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Firestore Database
export const db = getFirestore(app);

export const GOOGLE_WEB_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "813933033349-he7n23tar4fs6u08biho2l08gondnt9s.apps.googleusercontent.com";

// Google OAuth parameters (prompt account picker with Web Client ID)
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: GOOGLE_WEB_CLIENT_ID,
});

/**
 * Saves or updates a user document in the Firebase Firestore Database ('users' collection).
 * Stores comprehensive user profile and auth metadata.
 *
 * @param {import('firebase/auth').User | object} user - The authenticated Firebase user object
 * @param {object} [extraData={}] - Additional profile metadata (e.g. source, name, cart)
 * @returns {Promise<object|null>} The saved user payload
 */
export async function saveUserToDatabase(user, extraData = {}) {
  if (!user || !user.uid) {
    console.warn('[Firebase DB] saveUserToDatabase called with invalid user:', user);
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);

    let docExists = false;
    try {
      const snap = await getDoc(userDocRef);
      docExists = snap.exists();
    } catch (readErr) {
      // If getDoc read is restricted by security rules, merge write will still succeed
      console.info('[Firebase DB] Notice checking existing doc:', readErr.message);
    }

    const displayName =
      user.displayName ||
      extraData.displayName ||
      extraData.name ||
      (user.email ? user.email.split('@')[0] : 'STAX Reader');

    const providerId =
      user.providerData?.[0]?.providerId ||
      extraData.providerId ||
      (user.email ? 'password' : 'google.com');

    const payload = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      photoURL: user.photoURL || extraData.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      providerId,
      emailVerified: Boolean(user.emailVerified),
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extraData,
    };

    if (!docExists) {
      payload.createdAt = serverTimestamp();
      payload.role = extraData.role || 'customer';
    }

    await setDoc(userDocRef, payload, { merge: true });
    console.log(`[Firebase DB] Successfully stored user ${user.uid} (${payload.email || payload.displayName}) in 'users' collection.`);

    // Keep an offline backup copy in localStorage
    try {
      localStorage.setItem(`stax_user_${user.uid}`, JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString(),
      }));
    } catch (_) {}

    return payload;
  } catch (err) {
    console.error('[Firebase DB] Error saving user to Firebase Database:', err);
    // Graceful offline fallback in case Firestore is in test mode / not yet provisioned
    try {
      localStorage.setItem(`stax_user_${user.uid}`, JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || extraData.name,
        photoURL: user.photoURL,
        savedLocallyAt: new Date().toISOString(),
      }));
    } catch (_) {}
    return null;
  }
}

/**
 * Retrieves a user document from the Firebase Firestore Database.
 *
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<object|null>}
 */
export async function getUserFromDatabase(uid) {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('[Firebase DB] Failed to fetch user from DB:', err.message);
    try {
      const cached = localStorage.getItem(`stax_user_${uid}`);
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return null;
  }
}

/**
 * Updates specific fields on an existing user in the Firebase database.
 *
 * @param {string} uid - User UID
 * @param {object} updates - Fields to update
 */
export async function updateUserDataInDatabase(uid, updates = {}) {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[Firebase DB] updateUserDataInDatabase error:', err.message);
  }
}

// Automatically sync any authenticated session to Firebase Database
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      saveUserToDatabase(user).catch((err) => {
        console.warn('[Firebase DB] Background auth sync notice:', err);
      });
    }
  });
}

// Initialize Analytics safely on client side
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  onSnapshot,
};

export default app;
