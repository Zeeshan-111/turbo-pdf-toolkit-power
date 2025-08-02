
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
  alternateLanguages?: Array<{hreflang: string, href: string}>;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogImage = "https://pdftoolspro.com/og-image.jpg",
  ogType = "website",
  structuredData,
  noindex = false,
  alternateLanguages = []
}) => {
  const fullTitle = title.includes('PDF Tools Pro') ? title : `${title} | PDF Tools Pro - Free Online PDF Toolkit`;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://pdftoolspro.com');

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      {/* Language alternatives */}
      {alternateLanguages.map(lang => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Robots & Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />

      {/* Open Graph */}
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

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pdftoolspro" />
      <meta name="twitter:creator" content="@pdftoolspro" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - PDF Tools Pro`} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="PDF Tools Pro Team" />
      <meta name="publisher" content="PDF Tools Pro" />
      <meta name="copyright" content="© 2024 PDF Tools Pro. All rights reserved." />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#1f2937" />

      {/* Mobile & Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PDF Tools Pro" />

      {/* Performance & Security */}
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https: blob:;" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Preconnects for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            page_title: '${title}',
            page_location: '${currentUrl}'
          });
        `}
      </script>

      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE_HERE" />
      
      {/* Bing Webmaster Tools */}
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />
    </Helmet>
  );
};

export default MetaTags;
