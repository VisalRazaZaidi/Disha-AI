import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInAnonymous } from '../services/firebase';

/**
 * Custom hook for Firebase authentication
 * @returns {Object} Authentication state and functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign in anonymously
   * @returns {Promise<UserCredential>}
   */
  const signInAnonymously = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInAnonymous();
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signInAnonymously,
    isAuthenticated: !!user,
  };
};
