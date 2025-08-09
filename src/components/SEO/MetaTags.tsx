
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
  keywords = "PDF tools, PDF converter, PDF to Word, merge PDF, split PDF, compress PDF, PDF editor, free PDF tools, online PDF toolkit, PDF editing software, convert PDF online",
  ogImage = "https://peaceful-beignet-225186.netlify.app/og-image.jpg",
  ogType = "website",
  structuredData,
  noindex = false,
  alternateLanguages = []
}) => {
  // Optimize title for SEO - under 60 characters with primary keywords
  const optimizedTitle = title.length > 60 ? 
    title.substring(0, 57) + '...' : 
    title;
  
  const fullTitle = optimizedTitle.includes('PDF Tools Pro') ? 
    optimizedTitle : 
    `${optimizedTitle} | PDF Tools Pro`;
  
  // Optimize meta description - 150-160 characters for best SEO
  const optimizedDescription = description.length > 160 ? 
    description.substring(0, 157) + '...' : 
    description;
  
  // Enhanced canonical URL with proper technical SEO
  const getCanonicalUrl = () => {
    if (canonicalUrl) {
      if (canonicalUrl.startsWith('http')) {
        return canonicalUrl;
      }
      return `https://peaceful-beignet-225186.netlify.app${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;
    }
    
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
      }
      // Remove tracking parameters for clean canonical URLs
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
      trackingParams.forEach(param => url.searchParams.delete(param));
      return url.toString();
    }
    
    return 'https://peaceful-beignet-225186.netlify.app';
  };

  const currentUrl = getCanonicalUrl();

  return (
    <Helmet>
      {/* Optimized Title Tag - Primary SEO Factor */}
      <title>{fullTitle}</title>
      
      {/* Optimized Meta Description - Critical for CTR */}
      <meta name="description" content={optimizedDescription} />
      
      {/* Enhanced Keywords Meta Tag */}
      <meta name="keywords" content={keywords} />
      
      {/* Technical SEO - Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="author" content="PDF Tools Pro Development Team" />
      <meta name="publisher" content="PDF Tools Pro - Professional PDF Toolkit" />
      <meta name="copyright" content="© 2024 PDF Tools Pro. All rights reserved." />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="1 day" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="application-name" content="PDF Tools Pro" />
      <meta name="generator" content="PDF Tools Pro v2024.1" />
      
      {/* Enhanced Favicon System */}
      <link rel="icon" type="image/png" href="/lovable-uploads/0a30a259-af1a-4177-870c-6f3ca6834b79.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/0a30a259-af1a-4177-870c-6f3ca6834b79.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/lovable-uploads/0a30a259-af1a-4177-870c-6f3ca6834b79.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/lovable-uploads/0a30a259-af1a-4177-870c-6f3ca6834b79.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Language alternatives for international SEO */}
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      {alternateLanguages.map(lang => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Enhanced Robots Directives for Better Crawling */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
      )}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="slurp" content="index, follow" />

      {/* Enhanced Open Graph - Critical for Social Media SEO */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Professional PDF Tools and Converters`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="PDF Tools Pro" />
      <meta property="og:locale" content="en_US" />
      <meta property="article:author" content="PDF Tools Pro Team" />
      <meta property="article:publisher" content="https://peaceful-beignet-225186.netlify.app" />
      <meta property="article:modified_time" content={new Date().toISOString()} />

      {/* Enhanced Twitter Card for Better Social Media Presence */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pdftoolspro" />
      <meta name="twitter:creator" content="@pdftoolspro" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - Professional PDF Toolkit`} />
      <meta name="twitter:domain" content="peaceful-beignet-225186.netlify.app" />
      <meta name="twitter:url" content={currentUrl} />

      {/* Mobile Optimization for Technical SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="PDF Tools Pro" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Enhanced Security Headers for Technical SEO */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />
      
      {/* Enhanced Content Security Policy */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://platform.twitter.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com; frame-src 'none'; object-src 'none'; base-uri 'self';" />

      {/* Structured Data for Rich Snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}

      {/* Enhanced Preconnections for Performance SEO */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://platform.twitter.com" />

      {/* DNS Prefetch for Faster Resource Loading */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="https://platform.twitter.com" />

      {/* Enhanced Google Analytics 4 with SEO Events */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            page_title: '${title.replace(/'/g, "\\'")}',
            page_location: '${currentUrl}',
            content_group1: 'PDF Tools',
            content_group2: 'Conversion Tools',
            custom_map: {
              'custom_parameter_1': 'tool_usage',
              'custom_parameter_2': 'conversion_type'
            },
            anonymize_ip: true,
            allow_google_signals: false,
            send_page_view: true
          });
          
          // Enhanced SEO tracking
          gtag('event', 'page_view', {
            page_title: '${title.replace(/'/g, "\\'")}',
            page_location: '${currentUrl}',
            content_group: 'PDF Tools'
          });
        `}
      </script>

      {/* Search Console and Webmaster Tools Verification */}
      <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE_HERE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />
      <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" />
      <meta name="pinterest-site-verification" content="YOUR_PINTEREST_VERIFICATION_CODE" />
      
      {/* Additional Technical SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      <meta name="skype_toolbar" content="skype_toolbar_parser_compatible" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* Geographic SEO */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="39.50;-98.35" />
      <meta name="ICBM" content="39.50, -98.35" />
    </Helmet>
  );
};

export default MetaTags;
