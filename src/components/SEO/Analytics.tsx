
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });
    }

    // Track custom events for PDF tool usage
    const trackToolUsage = (toolName: string) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'tool_usage', {
          event_category: 'PDF Tools',
          event_label: toolName,
          value: 1
        });
      }
    };

    // Track file uploads
    const trackFileUpload = (fileType: string, fileSize: number) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'file_upload', {
          event_category: 'File Processing',
          event_label: fileType,
          value: Math.round(fileSize / 1024) // KB
        });
      }
    };

    // Make tracking functions globally available
    (window as any).trackToolUsage = trackToolUsage;
    (window as any).trackFileUpload = trackFileUpload;

  }, [location]);

  return null;
};

export default Analytics;
