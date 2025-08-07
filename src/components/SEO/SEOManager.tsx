
import React from 'react';
import RedirectManager from './RedirectManager';
import SocialIntegration from './SocialIntegration';
import ResourceOptimizer from './ResourceOptimizer';
import ErrorHandler from './ErrorHandler';
import Analytics from './Analytics';

const SEOManager: React.FC = () => {
  return (
    <>
      <RedirectManager />
      <SocialIntegration />
      <ResourceOptimizer />
      <ErrorHandler />
      <Analytics />
    </>
  );
};

export default SEOManager;
