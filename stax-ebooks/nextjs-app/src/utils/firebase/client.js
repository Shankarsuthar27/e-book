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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDI-1hIHMi9HjLCpob7kto2kh56Uu5pBSY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "e-book-1b4d4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "e-book-1b4d4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "e-book-1b4d4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "813933033349",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:813933033349:web:fcdc02fd50114ac783b6ec",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-W7C6X2Q4DV"
};

// Singleton Firebase initialization for Next.js App Router
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const GOOGLE_WEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "813933033349-he7n23tar4fs6u08biho2l08gondnt9s.apps.googleusercontent.com";

googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: GOOGLE_WEB_CLIENT_ID,
});

/**
 * Persists user record into Firestore 'users' collection
 */
export async function saveUserToDatabase(user, extraData = {}) {
  if (!user || !user.uid) return null;

  try {
    const userDocRef = doc(db, 'users', user.uid);

    let docExists = false;
    try {
      const snap = await getDoc(userDocRef);
      docExists = snap.exists();
    } catch (_) {}

    const payload = {
      uid: user.uid,
      email: user.email || '',
      displayName:
        user.displayName ||
        extraData.displayName ||
        extraData.name ||
        (user.email ? user.email.split('@')[0] : 'STAX Reader'),
      photoURL: user.photoURL || extraData.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      providerId:
        user.providerData?.[0]?.providerId ||
        extraData.providerId ||
        (user.email ? 'password' : 'google.com'),
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
    return payload;
  } catch (err) {
    console.error('[Firebase DB] Next.js error saving user:', err);
    return null;
  }
}

/**
 * Retrieves a user document by UID from Firestore
 */
export async function getUserFromDatabase(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('[Firebase DB] Next.js getUser error:', err);
    return null;
  }
}

// Client-side automatic sync for active auth sessions
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      saveUserToDatabase(user).catch(() => {});
    }
  });
}

// Initialize Analytics on client side
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
