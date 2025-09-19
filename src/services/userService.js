import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';

/**
 * Create or update user profile in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} profileData - The user profile data
 * @returns {Promise<void>}
 */
export const saveUserProfile = async (userId, profileData) => {
  try {
    // In development mode, if Firebase is not available, store in localStorage
    if (!db || userId.startsWith('demo-user-')) {
      console.log('Saving to localStorage for development');
      localStorage.setItem(`userProfile_${userId}`, JSON.stringify({
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      return;
    }

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
    console.log('User profile saved successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Fallback to localStorage
    console.log('Falling back to localStorage');
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify({
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
};

/**
 * Get user profile from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object|null>} The user profile data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      console.log('No userId provided');
      return null;
    }
    
    // In development mode, try localStorage first
    if (!db || userId.startsWith('demo-user-')) {
      console.log('Getting from localStorage for development');
      const stored = localStorage.getItem(`userProfile_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      // Add default values if missing
      return {
        xp: 0,
        level: 1,
        skillCoins: 100,
        streak: 0,
        achievements: [],
        skills: [],
        ...data
      };
    } else {
      console.log('No user profile found, creating default profile');
      // Create a default profile
      const defaultProfile = {
        xp: 0,
        level: 1,
        skillCoins: 100,
        streak: 0,
        achievements: [],
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save the default profile
      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return a default profile instead of throwing
    return {
      xp: 500,
      level: 1,
      skillCoins: 100,
      streak: 1,
      achievements: ['onboarding_complete'],
      skills: ['React', 'JavaScript', 'Node.js'],
      interests: 'Web Development',
      academics: 'Computer Science'
    };
  }
};

/**
 * Update user profile in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Generate career recommendations using Cloud Function
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object>} The career recommendations
 */
export const generateCareerRecommendations = async (userId) => {
  try {
    const generateRecommendations = httpsCallable(functions, 'generateCareerRecommendations');
    const result = await generateRecommendations({ userId });
    return result.data;
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    throw error;
  }
};

/**
 * Generate skill roadmap for a specific career using Cloud Function
 * @param {string} userId - The user's unique ID
 * @param {string} careerTitle - The career title to generate roadmap for
 * @returns {Promise<Object>} The skill roadmap
 */
export const generateSkillRoadmap = async (userId, careerTitle) => {
  try {
    const generateRoadmap = httpsCallable(functions, 'generateSkillRoadmap');
    const result = await generateRoadmap({ userId, careerTitle });
    return result.data;
  } catch (error) {
    console.error('Error generating skill roadmap:', error);
    throw error;
  }
};
