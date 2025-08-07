
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

      // Facebook SDK
      (window as any).fbAsyncInit = function() {
        (window as any).FB.init({
          appId: 'YOUR_FACEBOOK_APP_ID',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        (js as any).src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    // Add social sharing buttons to tools
    const addSocialButtons = () => {
      const toolPages = document.querySelector('[data-tool-page]');
      if (toolPages && !document.querySelector('.social-share-buttons')) {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'social-share-buttons flex gap-4 justify-center mt-8';
        socialContainer.innerHTML = `
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}" 
             target="_blank" rel="noopener" 
             class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Share on Twitter
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
             target="_blank" rel="noopener"
             class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Share on Facebook
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
             target="_blank" rel="noopener"
             class="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Share on LinkedIn
          </a>
        `;
        toolPages.appendChild(socialContainer);
      }
    };

    initializeSocialSharing();
    addSocialButtons();
  }, [location]);

  return null;
};

export default SocialIntegration;
