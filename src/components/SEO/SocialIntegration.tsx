
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SocialIntegration: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize social sharing
    const initializeSocialSharing = () => {
      // Twitter sharing
      (window as any).twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = (window as any).twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode?.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f: any) {
          t._e.push(f);
        };
        return t;
      }(document, "script", "twitter-wjs"));

      // Facebook SDK - Only initialize if proper app ID is configured
      // Remove the placeholder app ID for security
      if (process.env.NODE_ENV === 'production') {
        // In production, this should be configured through environment variables
        console.warn('Facebook integration requires proper App ID configuration');
      }
    };

    // Add social sharing buttons to tools - using secure DOM manipulation
    const addSocialButtons = () => {
      const toolPages = document.querySelector('[data-tool-page]');
      if (toolPages && !document.querySelector('.social-share-buttons')) {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-share-buttons flex gap-4 justify-center mt-8';
        
        // Secure URL encoding and sanitization
        const currentUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title.replace(/[<>]/g, '')); // Basic XSS prevention
        
        // Create Twitter button
        const twitterLink = document.createElement('a');
        twitterLink.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}`;
        twitterLink.target = '_blank';
        twitterLink.rel = 'noopener noreferrer';
        twitterLink.className = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors';
        twitterLink.textContent = 'Share on Twitter';
        
        // Create Facebook button
        const facebookLink = document.createElement('a');
        facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        facebookLink.target = '_blank';
        facebookLink.rel = 'noopener noreferrer';
        facebookLink.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors';
        facebookLink.textContent = 'Share on Facebook';
        
        // Create LinkedIn button
        const linkedinLink = document.createElement('a');
        linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
        linkedinLink.className = 'bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors';
        linkedinLink.textContent = 'Share on LinkedIn';
        
        // Append buttons using secure DOM manipulation instead of innerHTML
        socialContainer.appendChild(twitterLink);
        socialContainer.appendChild(facebookLink);
        socialContainer.appendChild(linkedinLink);
        
        toolPages.appendChild(socialContainer);
      }
    };

    initializeSocialSharing();
    addSocialButtons();
  }, [location]);

  return null;
};

export default SocialIntegration;
