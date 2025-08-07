
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RedirectManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure trailing slash consistency
    const path = location.pathname;
    
    // Remove trailing slash except for root
    if (path !== '/' && path.endsWith('/')) {
      navigate(path.slice(0, -1) + location.search, { replace: true });
      return;
    }

    // Handle common URL variations
    const lowercasePath = path.toLowerCase();
    if (path !== lowercasePath) {
      navigate(lowercasePath + location.search, { replace: true });
      return;
    }

    // Redirect common variations to canonical URLs
    const redirects: Record<string, string> = {
      '/pdf-tools': '/',
      '/home': '/',
      '/index': '/',
      '/tools/pdf-to-word-converter': '/tools/pdf-to-word',
      '/tools/merge-pdf-files': '/tools/merge-pdf',
      '/tools/compress-pdf-file': '/tools/compress-pdf',
      '/tools/split-pdf-file': '/tools/split-pdf',
    };

    if (redirects[path]) {
      navigate(redirects[path] + location.search, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default RedirectManager;
