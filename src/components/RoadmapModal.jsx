import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle, BookOpen, Building2, TrendingUp, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../hooks/useAuth';
import { generateSkillRoadmap } from '../services/userService';

/**
 * Roadmap modal component with detailed skill roadmap and skill gap analysis
 * @param {Object} career - Career object
 * @param {Array} userSkills - User's current skills
 * @param {Function} onClose - Callback to close modal
 */
const RoadmapModal = ({ career, userSkills = [], onClose }) => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Generate roadmap when modal opens
    handleGenerateRoadmap();
  }, [career.title]);

  /**
   * Generate skill roadmap using AI
   */
  const handleGenerateRoadmap = async () => {
    try {
      setIsLoadingRoadmap(true);
      const roadmapData = await generateSkillRoadmap(user.uid, career.title);
      setRoadmap(roadmapData);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  /**
   * Categorize skills based on user's current skills
   */
  const categorizeSkills = (requiredSkills) => {
    if (!requiredSkills) return { owned: [], needed: [] };
    
    const owned = [];
    const needed = [];
    
    requiredSkills.forEach(skill => {
      const hasSkill = userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      );
      
      if (hasSkill) {
        owned.push(skill);
      } else {
        needed.push(skill);
      }
    });
    
    return { owned, needed };
  };

  /**
   * Render skill gap analysis section
   */
  const renderSkillGapAnalysis = () => {
    const { owned, needed } = categorizeSkills(career.requiredSkills || []);
    const totalSkills = career.requiredSkills?.length || 0;
    const skillsOwned = owned.length;
    const completionPercentage = totalSkills > 0 ? Math.round((skillsOwned / totalSkills) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Progress Overview */}
        <div className="card bg-gradient-to-r from-primary-50 to-electric-50 border-primary-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-700 mb-2">
              {completionPercentage}%
            </div>
            <p className="text-primary-600 font-medium mb-4">Skill Match Complete</p>
            <div className="w-full bg-primary-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-3 text-sm text-primary-600">
              {skillsOwned} of {totalSkills} required skills
            </div>
          </div>
        </div>

        {/* Skills You Already Have */}
        {owned.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-accent-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Skills You Already Have ({owned.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {owned.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="skill-tag owned"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Skills You Need to Learn */}
        {needed.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Circle className="h-5 w-5 text-electric-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Skills to Learn ({needed.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {needed.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="skill-tag needed"
                >
                  <Circle className="h-3 w-3 mr-1" />
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  /**
   * Render detailed roadmap content
   */
  const renderRoadmapContent = () => {
    if (isLoadingRoadmap) {
      return (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating your personalized roadmap...</p>
        </div>
      );
    }

    if (!roadmap) {
      return (
        <div className="text-center py-12">
          <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Roadmap content will appear here</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 mb-4">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start">
                <Circle className="h-2 w-2 text-primary-500 mt-2 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
          }}
        >
          {roadmap.roadmap}
        </ReactMarkdown>
      </motion.div>
    );
  };

  /**
   * Tab navigation
   */
  const tabs = [
    { id: 'overview', label: 'Skill Gap Analysis', icon: CheckCircle },
    { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{career.title}</h2>
                <p className="text-sm text-gray-600 mt-1">Detailed roadmap and skill analysis</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderSkillGapAnalysis()}
                </motion.div>
              )}
              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderRoadmapContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Powered by AI • Tailored for Indian market
              </p>
              <button
                onClick={handleGenerateRoadmap}
                disabled={isLoadingRoadmap}
                className="btn-secondary text-sm inline-flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingRoadmap ? 'animate-spin' : ''}`} />
                <span>Refresh Roadmap</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoadmapModal;
