import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Reusable Footer component with branding
 * Designed to be subtle and non-intrusive
 */
const Footer = ({ variant = 'default', className = '' }) => {
  const variants = {
    // Default footer for main pages
    default: 'bg-gray-50 border-t border-gray-200 py-4',
    // Minimal footer for modals/overlays
    minimal: 'py-2 text-xs',
    // Transparent footer for landing page
    transparent: 'py-3 text-sm',
    // Fixed footer for dashboard pages
    fixed: 'bg-white border-t border-gray-100 py-2 text-xs'
  };

  return (
    <footer className={`${variants[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-gray-500">
          <span className="flex items-center space-x-1">
            <span>© 2025 Disha AI. Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>by Aditya.</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;