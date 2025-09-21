import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { getUserProfile } from './services/userService';

// Import components
import LandingPage from './components/LandingPage';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import SkillAssessment from './components/SkillAssessment';
import LearningRoadmap from './components/LearningRoadmap';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import GameCenter from './components/GameCenter';
import Analytics from './components/Analytics';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Navigation from './components/Navigation';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';

import './index.css';

/**
 * Enhanced Disha AI - Career & Skill Advisor Platform
 * Gen AI-powered career guidance with gamification and analytics
 */
function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [appState, setAppState] = useState('landing'); // Always start with landing page
  const [currentView, setCurrentView] = useState('dashboard'); // current view within the app
  const [userProfile, setUserProfile] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  /**
   * Load user profile and determine app state
   */
  const loadUserProfileAndSetState = async () => {
    if (!user) return;
    
    try {
      setIsCheckingProfile(true);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      
      if (profile?.onboardingCompleted) {
        setAppState('dashboard');
      } else {
        setAppState('onboarding');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // If profile doesn't exist, go to onboarding
      setAppState('onboarding');
    } finally {
      setIsCheckingProfile(false);
    }
  };

  /**
   * Handle authentication state changes
   */
  useEffect(() => {
    // Only automatically change state if we're currently loading
    if (authLoading) {
      setAppState('loading');
      return;
    }

    // Don't automatically redirect - let user navigate manually
    // This ensures the landing page is shown first
    if (!isAuthenticated && appState === 'loading') {
      setAppState('landing');
      setUserProfile(null);
      return;
    }

    // Only auto-load profile if user is authenticated and we're not already in the app
    if (isAuthenticated && appState === 'loading') {
      loadUserProfileAndSetState();
    }
  }, [authLoading]); // Remove user and isAuthenticated from dependencies

  /**
   * Handle landing page "Get Started" click
   */
  const handleGetStarted = () => {
    console.log('handleGetStarted called, setting appState to onboarding');
    // Always proceed to onboarding, authentication will be handled there
    setAppState('onboarding');
  };

  /**
   * Handle onboarding completion
   */
  const handleOnboardingComplete = () => {
    console.log('handleOnboardingComplete called, setting appState to dashboard');
    setAppState('dashboard');
    // Create a demo user ID for development if no user is authenticated
    if (!user) {
      const demoUserId = 'demo-user-' + Date.now();
      console.log('Creating demo user profile:', demoUserId);
      getUserProfile(demoUserId).then(profile => {
        setUserProfile(profile);
      });
    } else {
      loadUserProfileAndSetState();
    }
  };

  /**
   * Handle edit profile request
   */
  const handleEditProfile = () => {
    setAppState('onboarding');
  };

  /**
   * Render loading state
   */
  const renderLoading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Disha AI...</p>
      </motion.div>
    </div>
  );

  /**
   * Render profile loading state
   */
  const renderProfileLoading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="animate-pulse-slow rounded-full h-16 w-16 bg-primary-200 mx-auto mb-4 flex items-center justify-center">
          <div className="h-8 w-8 bg-primary-600 rounded-full"></div>
        </div>
        <p className="text-gray-600">Setting up your profile...</p>
      </motion.div>
    </div>
  );

  // Show loading while authentication is being determined
  if (authLoading || appState === 'loading') {
    return renderLoading();
  }

  // Show profile loading while checking user data
  if (isCheckingProfile) {
    return renderProfileLoading();
  }

  /**
   * Render the main application view with navigation
   */
  const renderAppView = () => {
    const viewComponents = {
      dashboard: <Dashboard userProfile={userProfile} />,
      assessment: <SkillAssessment userProfile={userProfile} />,
      roadmap: <LearningRoadmap userProfile={userProfile} />,
      resume: <ResumeAnalyzer userProfile={userProfile} />,
      game: <GameCenter userProfile={userProfile} />,
      analytics: <Analytics userProfile={userProfile} />,
      leaderboard: <Leaderboard userProfile={userProfile} />,
      achievements: <Achievements userProfile={userProfile} />
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView}
          userProfile={userProfile}
        />
        <main className="pt-16 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewComponents[currentView]}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer variant="fixed" className="fixed bottom-0 left-0 right-0 z-10" />
      </div>
    );
  };

  console.log('App render - appState:', appState, 'userProfile:', userProfile);

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {appState === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {appState === 'dashboard' && renderAppView()}
      </AnimatePresence>

      {/* ChatBot - Available on all pages except landing */}
      {appState !== 'landing' && (
        <ChatBot userProfile={userProfile} />
      )}
    </div>
  );
}

export default App;
