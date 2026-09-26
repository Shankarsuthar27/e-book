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

export const GOOGLE_WEB_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "813933033349-he7n23tar4fs6u08biho2l08gondnt9s.apps.googleusercontent.com";

// Google OAuth parameters (prompt account picker with Web Client ID)
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: GOOGLE_WEB_CLIENT_ID,
});

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
};

export default app;
