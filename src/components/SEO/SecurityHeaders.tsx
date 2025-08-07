
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags where possible
    // Note: Some headers like CSP are better set at the server level
    
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    const addHttpEquivMetaTag = (httpEquiv: string, content: string) => {
      const existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Content Security Policy (basic version - should be enhanced at server level)
    addHttpEquivMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com https://connect.facebook.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://juciuncqkjzbfdoweipn.supabase.co; " +
      "frame-src 'none';"
    );

    // X-Frame-Options
    addHttpEquivMetaTag('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    addHttpEquivMetaTag('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    addMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Permissions Policy
    addHttpEquivMetaTag('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

  }, []);

  return null;
};

export default SecurityHeaders;
