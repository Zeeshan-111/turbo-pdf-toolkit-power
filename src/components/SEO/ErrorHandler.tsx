
import { useEffect } from 'react';

const ErrorHandler = () => {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Track errors for analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          description: `Unhandled promise rejection: ${event.reason}`,
          fatal: false
        });
      }
      
      // Prevent the error from being logged to console in production
      if (process.env.NODE_ENV === 'production') {
        event.preventDefault();
      }
    };

    // Handle JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript error:', event.error);
      
      // Track errors for analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          description: `JavaScript error: ${event.message}`,
          fatal: false
        });
      }
    };

    // Handle resource loading errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        console.warn('Image failed to load:', img.src);
        
        // Replace with placeholder
        img.src = '/placeholder.svg';
        img.alt = 'Image not available';
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    document.addEventListener('error', handleResourceError, true);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      document.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return null;
};

export default ErrorHandler;
