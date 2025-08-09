
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MetaTags from './MetaTags';
import SocialIntegration from './SocialIntegration';
import ResourceOptimizer from './ResourceOptimizer';
import RedirectManager from './RedirectManager';
import ErrorHandler from './ErrorHandler';
import SecurityHeaders from './SecurityHeaders';
import BacklinksManager from './BacklinksManager';
import { 
  generateWebsiteSchema, 
  generateSoftwareApplicationSchema, 
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema
} from '@/utils/structuredData';

const SEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Enhanced analytics tracking with SEO events
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_TRACKING_ID', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        content_group1: getContentGroup(location.pathname),
        send_page_view: true,
      });

      // Track internal link clicks for SEO insights
      (window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.origin + location.pathname,
        content_group: getContentGroup(location.pathname),
      });
    }

    // Enhanced canonical URL management
    const updateCanonicalURL = () => {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }

      const cleanPath = location.pathname.endsWith('/') && location.pathname !== '/' ? 
        location.pathname.slice(0, -1) : location.pathname;
      canonicalLink.href = window.location.origin + cleanPath;
    };

    // Enhanced structured data with comprehensive schemas
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      const pathname = location.pathname;
      const baseUrl = window.location.origin;
      const schemas: any[] = [];

      // Always include core schemas
      schemas.push(generateWebsiteSchema());
      schemas.push(generateOrganizationSchema());

      // Add breadcrumb schema for better navigation SEO
      const breadcrumbItems = generateBreadcrumbItems(pathname);
      if (breadcrumbItems.length > 1) {
        schemas.push(generateBreadcrumbSchema(breadcrumbItems));
      }

      // Tool-specific schemas with enhanced SEO data
      if (pathname.includes('/tools/')) {
        const toolName = pathname.replace('/tools/', '').replace(/-/g, ' ');
        const toolDisplayName = toolName.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const toolUrl = `${baseUrl}${pathname}`;
        const toolDescription = getEnhancedToolDescription(pathname);
        
        schemas.push(
          generateSoftwareApplicationSchema(
            `${toolDisplayName} - PDF Tools Pro`,
            toolUrl,
            toolDescription
          )
        );

        // Add HowTo schema for tool pages
        const howToSteps = getToolHowToSteps(pathname);
        schemas.push(generateHowToSchema(toolDisplayName, howToSteps));
      }

      // Add FAQ schema for homepage
      if (pathname === '/') {
        const faqs = getHomepageFAQs();
        schemas.push(generateFAQSchema(faqs));
      }

      // Add all schemas to the page
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `structured-data-${index}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    };

    // Enhanced internal linking automation
    const enhanceInternalLinking = () => {
      const content = document.querySelector('main') || document.body;
      if (!content) return;

      const linkOpportunities = [
        { text: /\bPDF to Word\b/gi, url: '/tools/pdf-to-word', title: 'Convert PDF to Word - Free PDF to DOCX Converter' },
        { text: /\bmerge PDF\b/gi, url: '/tools/merge-pdf', title: 'Merge PDF Files - Combine Multiple PDFs Free' },
        { text: /\bcompress PDF\b/gi, url: '/tools/compress-pdf', title: 'Compress PDF to 1MB - Reduce PDF File Size' },
        { text: /\bsplit PDF\b/gi, url: '/tools/split-pdf', title: 'Split PDF Pages - Extract PDF Pages Free' },
        { text: /\bPDF to JPG\b/gi, url: '/tools/pdf-to-jpg', title: 'PDF to JPG Converter - Convert PDF to Images' },
        { text: /\bJPG to PDF\b/gi, url: '/tools/jpg-to-pdf', title: 'JPG to PDF Converter - Convert Images to PDF' },
      ];

      linkOpportunities.forEach(opportunity => {
        const walker = document.createTreeWalker(
          content,
          NodeFilter.SHOW_TEXT,
          null
        );

        const textNodes: Text[] = [];
        let node: Node | null;
        while (node = walker.nextNode()) {
          if (node.nodeType === Node.TEXT_NODE && 
              node.parentElement?.tagName !== 'A' &&
              node.parentElement?.tagName !== 'SCRIPT') {
            textNodes.push(node as Text);
          }
        }

        textNodes.forEach(textNode => {
          const text = textNode.textContent || '';
          if (opportunity.text.test(text) && !text.includes('href=')) {
            const newHTML = text.replace(opportunity.text, (match) => 
              `<a href="${opportunity.url}" title="${opportunity.title}" class="text-blue-400 hover:text-blue-300 underline">${match}</a>`
            );
            
            if (newHTML !== text) {
              const wrapper = document.createElement('div');
              wrapper.innerHTML = newHTML;
              while (wrapper.firstChild) {
                textNode.parentNode?.insertBefore(wrapper.firstChild, textNode);
              }
              textNode.remove();
            }
          }
        });
      });
    };

    updateCanonicalURL();
    addStructuredData();
    
    // Delay internal linking to avoid conflicts with React rendering
    setTimeout(enhanceInternalLinking, 1000);

  }, [location]);

  // Helper functions for enhanced SEO
  const getContentGroup = (pathname: string): string => {
    if (pathname === '/') return 'Homepage';
    if (pathname.includes('/tools/')) return 'PDF Tools';
    if (pathname.includes('/blog/')) return 'Blog';
    return 'Other';
  };

  const generateBreadcrumbItems = (pathname: string) => {
    const items = [{ name: 'Home', url: 'https://peaceful-beignet-225186.netlify.app/' }];
    
    if (pathname.includes('/tools/')) {
      items.push({ name: 'PDF Tools', url: 'https://peaceful-beignet-225186.netlify.app/#tools' });
      const toolName = pathname.replace('/tools/', '').replace(/-/g, ' ');
      const toolDisplayName = toolName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      items.push({ 
        name: toolDisplayName, 
        url: `https://peaceful-beignet-225186.netlify.app${pathname}` 
      });
    }
    
    return items;
  };

  const getEnhancedToolDescription = (pathname: string): string => {
    const descriptions: Record<string, string> = {
      '/tools/pdf-to-word': 'Convert PDF documents to fully editable Microsoft Word files (.docx) instantly with perfect formatting preservation. Free PDF to Word converter with no registration, watermarks, or file size limits. Professional-grade conversion technology for business and personal use.',
      '/tools/pdf-to-jpg': 'Convert PDF pages to high-quality JPG images with advanced rendering technology. Extract images from PDF documents with customizable resolution and quality settings. Free PDF to JPG converter supporting batch processing and unlimited conversions.',
      '/tools/jpg-to-pdf': 'Convert JPG images to professional PDF documents with perfect quality preservation. Combine multiple JPG files into a single PDF with customizable page layouts and compression settings. Free image to PDF converter with drag-and-drop interface.',
      '/tools/pdf-to-png': 'Convert PDF pages to high-resolution PNG images with transparent background support. Professional PDF to PNG conversion with advanced image processing algorithms for web and print applications.',
      '/tools/png-to-pdf': 'Convert PNG images to PDF documents while preserving transparency and image quality. Professional PNG to PDF converter with batch processing capabilities and unlimited file size support.',
      '/tools/merge-pdf': 'Combine multiple PDF files into one professional document with advanced merging technology. Free PDF merger with drag-and-drop interface, unlimited file size support, and perfect page ordering capabilities.',
      '/tools/split-pdf': 'Extract specific pages from PDF documents with precision page selection tools. Split PDF by page ranges, individual pages, or bookmarks with professional-grade accuracy and speed.',
      '/tools/compress-pdf': 'Reduce PDF file size to 1MB or smaller using advanced compression algorithms without quality loss. Professional PDF compressor optimized for email sharing, web upload, and storage efficiency.',
      '/tools/lock-pdf': 'Add military-grade password protection and encryption to PDF documents. Secure your PDFs with AES encryption, access controls, and permission settings for ultimate document security.',
      '/tools/word-to-pdf': 'Convert Microsoft Word documents to PDF format with perfect formatting and layout preservation. Professional Word to PDF converter supporting all Word versions and advanced document features.',
      '/tools/pdf-reader': 'View PDF files directly in your browser with advanced PDF reading capabilities. Fast, secure online PDF viewer with zoom controls, navigation tools, and full-screen viewing mode.',
      '/tools/jpg-compress': 'Compress JPG images to reduce file size while maintaining optimal visual quality. Professional image optimizer with customizable compression levels for web use and faster loading speeds.'
    };
    
    return descriptions[pathname] || 'Professional PDF tool for advanced document processing, conversion, and editing with enterprise-grade security and unlimited usage.';
  };

  const getToolHowToSteps = (pathname: string): string[] => {
    const steps = [
      'Select your PDF file or document using the secure file upload interface',
      'Choose your preferred settings and options for optimal results',
      'Click the process button to start the conversion or editing operation',
      'Download your processed file instantly with professional quality output'
    ];
    return steps;
  };

  const getHomepageFAQs = () => [
    {
      question: 'Is PDF Tools Pro completely free for all PDF conversion and editing tools?',
      answer: 'Yes, our entire PDF Tools Pro suite is completely free with no hidden costs, subscription fees, or premium tiers. All 12 PDF conversion and editing tools are available with unlimited usage, no watermarks, and professional output quality.'
    },
    {
      question: 'How secure is PDF processing with PDF Tools Pro?',
      answer: 'PDF Tools Pro uses client-side processing technology, meaning your files never leave your device. All PDF conversion and editing happens locally in your browser with 256-bit SSL encryption, ensuring maximum security for sensitive documents.'
    },
    {
      question: 'Can I convert PDF to Word with perfect formatting preservation?',
      answer: 'Yes, our advanced PDF to Word converter preserves all formatting, fonts, layouts, and styles with 99.9% accuracy. The converted Word documents are fully editable while maintaining professional appearance.'
    },
    {
      question: 'What file size limits apply to PDF Tools Pro?',
      answer: 'There are no file size limits for any of our PDF tools. You can process large documents, multiple files, and batch conversions without restrictions, making our toolkit suitable for enterprise and professional use.'
    }
  ];

  // Get page-specific meta data with enhanced SEO optimization
  const getPageMetaData = () => {
    const pathname = location.pathname;
    
    // Default optimized meta data
    let title = "PDF Tools Pro - Best Free PDF Toolkit for Conversion & Editing";
    let description = "Complete PDF tools suite with 12 free conversion & editing tools. Convert PDF to Word, merge PDFs, compress PDF to 1MB. Professional toolkit with no watermark.";
    let keywords = "PDF tools, PDF converter, PDF to Word, merge PDF, split PDF, compress PDF, PDF editor, free PDF tools, online PDF toolkit, PDF editing software";
    
    // Enhanced route-specific meta data with long-tail keywords
    if (pathname === '/') {
      title = "PDF Tools Pro - Ultimate Free PDF Conversion & Editing Toolkit (No Watermark)";
      description = "Best PDF tools online - convert PDF to Word, merge PDFs, compress PDF to 1MB, split PDF pages. Free professional toolkit with no signup, watermark, or limits. Trusted by 2M+ users.";
      keywords = "best PDF tools online, merge PDF free, compress PDF to 1MB, PDF to Word converter free, PDF to JPG online, no watermark PDF tools, free PDF editor online, professional PDF toolkit, convert PDF online free, PDF manipulation tools";
    } else if (pathname.includes('/tools/pdf-to-word')) {
      title = "PDF to Word Converter Free - Convert PDF to Editable DOCX Online";
      description = "Convert PDF to editable Word documents instantly with perfect formatting. Free PDF to Word converter with no signup, watermark, or file size limits. Download DOCX files immediately.";
      keywords = "PDF to Word converter free, PDF to DOCX online, convert PDF to Word editable, PDF Word converter no registration, editable PDF to Word, free PDF to Microsoft Word";
    } else if (pathname.includes('/tools/merge-pdf')) {
      title = "Merge PDF Files Free - Combine Multiple PDFs Online (No Limits)";
      description = "Combine multiple PDF files into one document instantly. Free PDF merger with drag-and-drop interface, unlimited file size, and no watermarks. Professional PDF combining tool.";
      keywords = "merge PDF files free, combine PDFs online, PDF merger no limits, join PDF documents, PDF combiner tool, merge multiple PDFs, combine PDF pages";
    } else if (pathname.includes('/tools/compress-pdf')) {
      title = "Compress PDF to 1MB Free - Reduce PDF File Size Without Quality Loss";
      description = "Reduce PDF file size to 1MB or smaller without losing quality using advanced compression algorithms. Free PDF compressor for email sharing and web upload optimization.";
      keywords = "compress PDF to 1MB free, reduce PDF size online, PDF compressor no quality loss, optimize PDF size, shrink PDF file, PDF size reducer";
    } else if (pathname.includes('/tools/')) {
      // Enhanced generic tool page meta data
      const toolName = pathname.replace('/tools/', '').replace(/-/g, ' ');
      const toolDisplayName = toolName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      title = `${toolDisplayName} Free - Professional PDF Tool | PDF Tools Pro`;
      description = `Use our free ${toolName} tool for professional PDF document processing. Advanced ${toolName} capabilities with no signup, watermarks, or file size limits.`;
      keywords = `${toolName} free, PDF ${toolName} online, professional ${toolName} tool, ${toolName} no watermark, free PDF ${toolName}`;
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
      <BacklinksManager />
    </>
  );
};

export default SEOManager;
