
import { useEffect } from 'react';

const ResourceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
        { href: '/favicon-32x32.png', as: 'image' },
        { href: '/og-image.jpg', as: 'image' }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.as === 'style') {
          link.onload = () => {
            link.rel = 'stylesheet';
          };
        }
        document.head.appendChild(link);
      });
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    };

    // Defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      const scripts = [
        'https://www.google-analytics.com/analytics.js',
        'https://platform.twitter.com/widgets.js'
      ];

      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      });
    };

    preloadCriticalResources();
    lazyLoadResources();
    deferNonCriticalJS();
  }, []);

  return null;
};

export default ResourceOptimizer;
