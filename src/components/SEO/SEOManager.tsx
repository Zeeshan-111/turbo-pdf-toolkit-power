
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MetaTags from './MetaTags';
import SocialIntegration from './SocialIntegration';
import ResourceOptimizer from './ResourceOptimizer';
import RedirectManager from './RedirectManager';
import ErrorHandler from './ErrorHandler';
import SecurityHeaders from './SecurityHeaders';

const SEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Update page tracking for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_TRACKING_ID', {
        page_path: location.pathname + location.search,
      });
    }

    // Update canonical URL for current page
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = window.location.origin + location.pathname;
    }

    // Add structured data for the current page
    const addStructuredData = () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PDF Tools Pro",
        "description": "Professional PDF tools for converting, merging, splitting, and editing PDF documents",
        "url": window.location.origin,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "PDF to Word conversion",
          "PDF to Image conversion", 
          "PDF merging and splitting",
          "PDF compression",
          "Document security"
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [location]);

  return (
    <>
      <MetaTags />
      <SocialIntegration />
      <ResourceOptimizer />
      <RedirectManager />
      <ErrorHandler />
      <SecurityHeaders />
    </>
  );
};

export default SEOManager;
