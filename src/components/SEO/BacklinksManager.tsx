
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BacklinksManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Add internal backlinks dynamically based on page content
    const addInternalBacklinks = () => {
      const content = document.querySelector('main') || document.body;
      if (!content) return;

      // Internal linking opportunities with optimized anchor text
      const internalLinks = [
        { 
          regex: /\bPDF to Word converter\b/gi, 
          url: '/tools/pdf-to-word', 
          title: 'Convert PDF to Word - Free PDF to DOCX Converter',
          anchor: 'PDF to Word converter'
        },
        { 
          regex: /\bmerge PDF files\b/gi, 
          url: '/tools/merge-pdf', 
          title: 'Merge PDF Files - Combine Multiple PDFs Online',
          anchor: 'merge PDF files'
        },
        { 
          regex: /\bcompress PDF\b/gi, 
          url: '/tools/compress-pdf', 
          title: 'Compress PDF to 1MB - Reduce PDF File Size',
          anchor: 'compress PDF'
        },
        { 
          regex: /\bsplit PDF pages\b/gi, 
          url: '/tools/split-pdf', 
          title: 'Split PDF Pages - Extract PDF Pages Free',
          anchor: 'split PDF pages'
        },
        { 
          regex: /\bPDF to JPG\b/gi, 
          url: '/tools/pdf-to-jpg', 
          title: 'PDF to JPG Converter - Convert PDF to Images',
          anchor: 'PDF to JPG'
        },
        { 
          regex: /\bJPG to PDF\b/gi, 
          url: '/tools/jpg-to-pdf', 
          title: 'JPG to PDF Converter - Convert Images to PDF',
          anchor: 'JPG to PDF'
        }
      ];

      // Process text nodes for internal linking
      const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            return parent && 
                   parent.tagName !== 'A' && 
                   parent.tagName !== 'SCRIPT' &&
                   parent.tagName !== 'STYLE' &&
                   !parent.hasAttribute('data-backlink-processed')
                   ? NodeFilter.FILTER_ACCEPT 
                   : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const textNodes: Text[] = [];
      let node: Node | null;
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }

      // Apply internal links
      textNodes.forEach(textNode => {
        let content = textNode.textContent || '';
        let hasChanges = false;

        internalLinks.forEach(link => {
          if (link.regex.test(content) && !content.includes(`href="${link.url}"`)) {
            content = content.replace(link.regex, (match) => 
              `<a href="${link.url}" title="${link.title}" class="text-blue-400 hover:text-blue-300 underline font-medium">${match}</a>`
            );
            hasChanges = true;
          }
        });

        if (hasChanges) {
          const wrapper = document.createElement('span');
          wrapper.innerHTML = content;
          wrapper.setAttribute('data-backlink-processed', 'true');
          
          while (wrapper.firstChild) {
            textNode.parentNode?.insertBefore(wrapper.firstChild, textNode);
          }
          textNode.remove();
        }
      });
    };

    // Add external backlinks for authority and trust signals
    const addExternalBacklinks = () => {
      // Only add external backlinks on homepage for SEO authority
      if (location.pathname !== '/') return;

      const externalLinksSection = document.getElementById('external-links-seo');
      if (externalLinksSection || document.querySelector('[data-external-links]')) return;

      const externalLinksContainer = document.createElement('section');
      externalLinksContainer.id = 'external-links-seo';
      externalLinksContainer.setAttribute('data-external-links', 'true');
      externalLinksContainer.className = 'mt-16 bg-gray-800 rounded-xl p-8';
      
      externalLinksContainer.innerHTML = `
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Trusted PDF Technology & Resources
          </h2>
          <p class="text-gray-400 text-lg">
            Learn more about PDF standards, security, and technology from authoritative sources
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3 text-blue-400">PDF Standards & Specifications</h3>
            <p class="text-gray-300 mb-4">Official PDF standards and technical specifications from Adobe and ISO.</p>
            <a href="https://www.adobe.com/devnet/pdf/pdf_reference.html" 
               target="_blank" 
               rel="noopener noreferrer nofollow"
               title="Adobe PDF Reference and Standards"
               class="text-blue-400 hover:text-blue-300 underline font-medium">
              Adobe PDF Reference →
            </a>
          </div>
          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3 text-green-400">PDF Security Best Practices</h3>
            <p class="text-gray-300 mb-4">Learn about PDF security, encryption, and privacy protection guidelines.</p>
            <a href="https://www.iso.org/standard/75839.html" 
               target="_blank" 
               rel="noopener noreferrer nofollow"
               title="ISO PDF Standards"
               class="text-green-400 hover:text-green-300 underline font-medium">
              ISO PDF Standards →
            </a>
          </div>
          <div class="bg-gray-700 rounded-lg p-6">
            <h3 class="text-xl font-semibold mb-3 text-purple-400">Web Accessibility</h3>
            <p class="text-gray-300 mb-4">Guidelines for creating accessible PDF documents and web applications.</p>
            <a href="https://www.w3.org/WAI/WCAG21/quickref/" 
               target="_blank" 
               rel="noopener noreferrer nofollow"
               title="Web Content Accessibility Guidelines"
               class="text-purple-400 hover:text-purple-300 underline font-medium">
              WCAG Guidelines →
            </a>
          </div>
        </div>
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-sm">
            These external resources provide additional context and authoritative information about PDF technology, 
            standards, and best practices. PDF Tools Pro follows industry standards for optimal compatibility and security.
          </p>
        </div>
      `;

      // Insert before footer
      const footer = document.querySelector('footer');
      const container = footer?.parentElement || document.body;
      if (footer) {
        container.insertBefore(externalLinksContainer, footer);
      } else {
        container.appendChild(externalLinksContainer);
      }
    };

    // Delay execution to avoid conflicts with React rendering
    setTimeout(() => {
      addInternalBacklinks();
      addExternalBacklinks();
    }, 1500);

  }, [location]);

  return null;
};

export default BacklinksManager;
