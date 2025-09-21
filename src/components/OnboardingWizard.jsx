import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { saveUserProfile } from '../services/userService';

/**
 * Multi-step onboarding wizard component
 * @param {Function} onComplete - Callback when onboarding is completed
 */
const OnboardingWizard = ({ onComplete }) => {
  console.log('OnboardingWizard component mounted');
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    interests: '',
    academics: '',
    skills: [],
  });
  
  // Current skill input for step 3
  const [currentSkill, setCurrentSkill] = useState('');

  const totalSteps = 3;

  /**
   * Handle form data updates
   */
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Add skill to the skills array
   */
  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      updateFormData('skills', [...formData.skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  /**
   * Remove skill from the skills array
   */
  const removeSkill = (skillToRemove) => {
    updateFormData('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  /**
   * Handle Enter key press for skill input
   */
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Check if current step is valid
   */
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.interests.trim().length > 0;
      case 2:
        return formData.academics.trim().length > 0;
      case 3:
        return formData.skills.length > 0;
      default:
        return false;
    }
  };

  /**
   * Complete onboarding and save profile
   */
  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // If no user is authenticated, create a demo user for development
      let userId = user?.uid;
      if (!userId) {
        console.log('No authenticated user, using demo user for development');
        userId = 'demo-user-' + Date.now();
      }

      await saveUserProfile(userId, {
        ...formData,
        onboardingCompleted: true,
        hasGeneratedRecommendations: false,
        xp: 500, // Starting XP for completing onboarding
        level: 1,
        skillCoins: 100,
        streak: 1,
        achievements: ['onboarding_complete'],
      });
      
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Even if save fails, continue to dashboard for demo purposes
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render progress bar
   */
  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-primary-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  /**
   * Render step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your interests and passions?
              </h2>
              <p className="text-gray-600 mb-6">
                Tell us what excites you, what you enjoy doing, and what makes you curious. 
                This helps us understand your natural inclinations.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Interests & Passions
              </label>
              <textarea
                value={formData.interests}
                onChange={(e) => updateFormData('interests', e.target.value)}
                placeholder="e.g., I love solving puzzles, creating digital art, understanding how things work, helping others learn..."
                rows={6}
                className="textarea-field"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your academic strengths?
              </h2>
              <p className="text-gray-600 mb-6">
                Share your favorite subjects, areas where you excel, and topics you find easy to understand. 
                Don't worry about grades - focus on what comes naturally to you.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Strengths & Favorite Subjects
              </label>
              <textarea
                value={formData.academics}
                onChange={(e) => updateFormData('academics', e.target.value)}
                placeholder="e.g., I'm good at mathematics and logical reasoning, enjoy physics concepts, love literature and creative writing..."
                rows={6}
                className="textarea-field"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What skills do you already have?
              </h2>
              <p className="text-gray-600 mb-6">
                List any skills you've picked up - technical, creative, or soft skills. 
                Include programming languages, tools, hobbies, or abilities you've developed.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Your Skills
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="e.g., Python, Photoshop, Public Speaking..."
                  className="input-field flex-1"
                />
                <button
                  onClick={addSkill}
                  disabled={!currentSkill.trim()}
                  className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Skills List */}
              <div className="flex flex-wrap gap-2 min-h-[60px]">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag owned group cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                    <X className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" />
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-gray-400 text-sm py-4">
                    Add skills by typing and pressing Enter or clicking the + button
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {renderProgressBar()}
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={completeOnboarding}
                disabled={!isStepValid() || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Complete Setup</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
