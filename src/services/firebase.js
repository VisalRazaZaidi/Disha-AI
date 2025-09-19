import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

/**
 * Firebase configuration object
 * Replace these with your actual Firebase project credentials
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

/**
 * Sign in user anonymously for seamless onboarding
 * @returns {Promise<UserCredential>} The user credential
 */
export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('Anonymous sign-in successful:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    throw error;
  }
};

export default app;
