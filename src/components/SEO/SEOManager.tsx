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

  // Get page-specific meta data based on current route
  const getPageMetaData = () => {
    const pathname = location.pathname;
    
    // Default meta data
    let title = "PDF Tools Pro - Free Online PDF Toolkit";
    let description = "Professional PDF tools for converting, merging, splitting, and editing PDF documents. Free, secure, and easy to use.";
    
    // Route-specific meta data
    if (pathname === '/') {
      title = "PDF Tools Pro - Free Online PDF Toolkit";
      description = "Professional PDF tools for converting, merging, splitting, and editing PDF documents. Free, secure, and easy to use.";
    } else if (pathname.includes('/tools/pdf-to-word')) {
      title = "PDF to Word Converter - Free Online Tool";
      description = "Convert PDF documents to editable Word files instantly. Free, secure, and no registration required.";
    } else if (pathname.includes('/tools/merge-pdf')) {
      title = "Merge PDF Files - Combine PDFs Online";
      description = "Combine multiple PDF files into one document. Fast, secure, and completely free online PDF merger.";
    } else if (pathname.includes('/tools/')) {
      // Generic tool page fallback
      const toolName = pathname.replace('/tools/', '').replace('-', ' ');
      title = `${toolName.charAt(0).toUpperCase() + toolName.slice(1)} - PDF Tools Pro`;
      description = `Use our free ${toolName} tool to manage your PDF documents online. Secure, fast, and easy to use.`;
    }
    
    return { title, description };
  };

  const { title, description } = getPageMetaData();

  return (
    <>
      <MetaTags 
        title={title}
        description={description}
      />
      <SocialIntegration />
      <ResourceOptimizer />
      <RedirectManager />
      <ErrorHandler />
      <SecurityHeaders />
    </>
  );
};

export default SEOManager;
