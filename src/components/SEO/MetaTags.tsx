
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object | object[];
  noindex?: boolean;
  alternateLanguages?: Array<{hreflang: string, href: string}>;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogImage = "https://peaceful-beignet-225186.netlify.app/og-image.jpg",
  ogType = "website",
  structuredData,
  noindex = false,
  alternateLanguages = []
}) => {
  const fullTitle = title.includes('PDF Tools Pro') ? title : `${title} | PDF Tools Pro`;
  
  // Ensure canonical URL is properly formatted and absolute
  const getCanonicalUrl = () => {
    if (canonicalUrl) {
      // If it's already absolute, use it
      if (canonicalUrl.startsWith('http')) {
        return canonicalUrl;
      }
      // If it's relative, make it absolute
      return `https://peaceful-beignet-225186.netlify.app${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;
    }
    
    // Fallback to current URL, but clean it up
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      // Remove trailing slash except for root
      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
      }
      // Remove common query parameters that shouldn't be canonical
      url.searchParams.delete('utm_source');
      url.searchParams.delete('utm_medium');
      url.searchParams.delete('utm_campaign');
      url.searchParams.delete('gclid');
      url.searchParams.delete('fbclid');
      return url.toString();
    }
    
    return 'https://peaceful-beignet-225186.netlify.app';
  };

  const currentUrl = getCanonicalUrl();

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="author" content="PDF Tools Pro Team" />
      <meta name="publisher" content="PDF Tools Pro" />
      <meta name="copyright" content="© 2024 PDF Tools Pro. All rights reserved." />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="application-name" content="PDF Tools Pro" />
      
      {/* Favicon - Multiple formats for better compatibility */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Language alternatives */}
      {alternateLanguages.map(lang => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Robots & Indexing - Enhanced for better crawling */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />

      {/* Open Graph - Enhanced */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - PDF Tools Pro`} />
      <meta property="og:site_name" content="PDF Tools Pro" />
      <meta property="og:locale" content="en_US" />
      <meta property="article:author" content="PDF Tools Pro" />
      <meta property="article:publisher" content="https://peaceful-beignet-225186.netlify.app" />

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pdftoolspro" />
      <meta name="twitter:creator" content="@pdftoolspro" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - PDF Tools Pro`} />

      {/* Mobile & Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PDF Tools Pro" />

      {/* Performance & Security Headers */}
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Content Security Policy - More permissive for functionality */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';" />

      {/* Structured Data - Handle both single objects and arrays */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}

      {/* Preconnects for Performance - Updated with real domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch for faster loading */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />

      {/* Google Analytics 4 - Replace with actual tracking ID */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            page_title: '${title.replace(/'/g, "\\'")}',
            page_location: '${currentUrl}',
            custom_map: {'custom_parameter_1': 'tool_usage'},
            anonymize_ip: true,
            allow_google_signals: false
          });
        `}
      </script>

      {/* Search Console Verification - Replace with actual codes */}
      <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE_HERE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />
      
      {/* Additional SEO Enhancements */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="skype_toolbar" content="skype_toolbar_parser_compatible" />
    </Helmet>
  );
};

export default MetaTags;
