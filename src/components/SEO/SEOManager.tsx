
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MetaTags from './MetaTags';
import SocialIntegration from './SocialIntegration';
import ResourceOptimizer from './ResourceOptimizer';
import RedirectManager from './RedirectManager';
import ErrorHandler from './ErrorHandler';
import SecurityHeaders from './SecurityHeaders';
import { 
  generateWebsiteSchema, 
  generateSoftwareApplicationSchema, 
  generateOrganizationSchema 
} from '@/utils/structuredData';

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

    // Add comprehensive structured data for the current page
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      const pathname = location.pathname;
      const baseUrl = window.location.origin;
      
      // Always include website and organization schemas
      const schemas = [
        generateWebsiteSchema(),
        generateOrganizationSchema()
      ];

      // Add tool-specific schema for tool pages
      if (pathname.includes('/tools/')) {
        const toolName = pathname.replace('/tools/', '').replace(/-/g, ' ');
        const toolDisplayName = toolName.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const toolUrl = `${baseUrl}${pathname}`;
        const toolDescription = getToolDescription(pathname);
        
        schemas.push(
          generateSoftwareApplicationSchema(
            `${toolDisplayName} - PDF Tools Pro`,
            toolUrl,
            toolDescription
          )
        );
      }

      // Add all schemas to the page
      schemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    };

    addStructuredData();
  }, [location]);

  // Get tool-specific descriptions for structured data
  const getToolDescription = (pathname: string): string => {
    const descriptions: Record<string, string> = {
      '/tools/pdf-to-word': 'Convert PDF documents to editable Word files (.docx) instantly. Free, secure, and no registration required.',
      '/tools/pdf-to-jpg': 'Convert PDF pages to high-quality JPG images. Extract images from PDF documents for free.',
      '/tools/jpg-to-pdf': 'Convert JPG images to PDF documents. Combine multiple images into a single PDF file.',
      '/tools/pdf-to-png': 'Convert PDF pages to PNG images with transparent backgrounds. High-quality PDF to PNG conversion.',
      '/tools/png-to-pdf': 'Convert PNG images to PDF documents. Preserve image quality and transparency in PDF format.',
      '/tools/merge-pdf': 'Combine multiple PDF files into one document. Free PDF merger tool with drag-and-drop interface.',
      '/tools/split-pdf': 'Extract pages from PDF documents to create separate files. Split PDF by page ranges or individual pages.',
      '/tools/compress-pdf': 'Reduce PDF file size without losing quality. Compress large PDFs for email and web sharing.',
      '/tools/lock-pdf': 'Add password protection to PDF documents. Secure your PDFs with encryption and access controls.',
      '/tools/word-to-pdf': 'Convert Microsoft Word documents to PDF format. Preserve formatting and layout perfectly.',
      '/tools/pdf-reader': 'View PDF files directly in your browser. Fast, secure PDF reader with zoom and navigation controls.',
      '/tools/jpg-compress': 'Compress JPG images to reduce file size. Optimize images for web use while maintaining quality.'
    };
    
    return descriptions[pathname] || 'Professional PDF tool for document processing and conversion.';
  };

  // Get page-specific meta data based on current route
  const getPageMetaData = () => {
    const pathname = location.pathname;
    
    // Default meta data
    let title = "PDF Tools Pro - Free Online PDF Toolkit";
    let description = "Professional PDF tools for converting, merging, splitting, and editing PDF documents. Free, secure, and easy to use.";
    let keywords = "PDF tools, PDF converter, PDF to Word, merge PDF, split PDF, compress PDF, PDF editor, free PDF tools";
    
    // Route-specific meta data with SEO keywords
    if (pathname === '/') {
      title = "PDF Tools Pro - Best Free PDF Tools Online (No Watermark)";
      description = "Best PDF tools online - compress PDF to 1MB, merge PDFs, convert PDF to Word, JPG converter. Free, fast, secure. No signup or watermark required.";
      keywords = "best PDF tools online, merge PDF free, compress PDF to 1MB, PDF to Word converter, PDF to JPG online, no watermark PDF tools, free PDF editor";
    } else if (pathname.includes('/tools/pdf-to-word')) {
      title = "PDF to Word Converter - Free Online (No Signup Required)";
      description = "Convert PDF to editable Word documents instantly. Free PDF to Word converter with no signup, watermark, or file size limits. Download .docx files immediately.";
      keywords = "PDF to Word converter, PDF to DOCX, convert PDF to Word free, PDF Word converter online, editable PDF to Word";
    } else if (pathname.includes('/tools/merge-pdf')) {
      title = "Merge PDF Files - Combine PDFs Online Free (No Limits)";
      description = "Combine multiple PDF files into one document. Free PDF merger with drag-and-drop interface. No file size limits or watermarks.";
      keywords = "merge PDF files, combine PDFs online, PDF merger free, join PDF documents, PDF combiner tool";
    } else if (pathname.includes('/tools/compress-pdf')) {
      title = "Compress PDF Below 1MB Without Losing Quality - Free Tool";
      description = "Reduce PDF file size to 1MB or smaller without losing quality. Free PDF compressor for email sharing and web upload.";
      keywords = "compress PDF below 1MB, reduce PDF size, PDF compressor free, optimize PDF size, shrink PDF file";
    } else if (pathname.includes('/tools/')) {
      // Generic tool page fallback
      const toolName = pathname.replace('/tools/', '').replace(/-/g, ' ');
      const toolDisplayName = toolName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      title = `${toolDisplayName} - Free Online Tool | PDF Tools Pro`;
      description = `Use our free ${toolName} tool to manage your PDF documents online. Secure, fast, and easy to use with no signup required.`;
      keywords = `${toolName}, PDF ${toolName}, free PDF tools, online PDF ${toolName}`;
    }
    
    return { title, description, keywords };
  };

  const { title, description, keywords } = getPageMetaData();

  return (
    <>
      <MetaTags 
        title={title}
        description={description}
        keywords={keywords}
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
