
// Structured Data Generators for SEO
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PDF Tools Pro",
  "alternateName": "WeLovePDF Alternative",
  "url": "https://pdftoolspro.com",
  "description": "Free online PDF tools for conversion, editing, merging, splitting, and compression. The best alternative to iLovePDF and SmallPDF.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://pdftoolspro.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://twitter.com/pdftoolspro",
    "https://facebook.com/pdftoolspro",
    "https://linkedin.com/company/pdftoolspro"
  ]
});

export const generateSoftwareApplicationSchema = (toolName: string, toolUrl: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": toolName,
  "description": description,
  "url": toolUrl,
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web Browser",
  "browserRequirements": "HTML5, JavaScript enabled",
  "softwareVersion": "2.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "author": {
    "@type": "Organization",
    "name": "PDF Tools Pro",
    "url": "https://pdftoolspro.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PDF Tools Pro",
    "url": "https://pdftoolspro.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Free online PDF processing",
    "No registration required",
    "Secure file handling",
    "Fast processing speed",
    "High-quality output"
  ]
});

export const generateHowToSchema = (toolName: string, steps: string[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": `How to use ${toolName}`,
  "description": `Step-by-step guide to use our ${toolName} tool online for free`,
  "totalTime": "PT2M",
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "PDF file"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "PDF Tools Pro"
    }
  ],
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": `Step ${index + 1}`,
    "text": step,
    "image": `https://pdftoolspro.com/images/step-${index + 1}.jpg`
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PDF Tools Pro",
  "alternateName": "WeLovePDF Alternative",
  "url": "https://pdftoolspro.com",
  "logo": "https://pdftoolspro.com/logo.png",
  "description": "The most comprehensive free online PDF toolkit. Convert, edit, merge, split, and compress PDFs with enterprise-grade security.",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "PDF Tools Pro Team"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@pdftoolspro.com"
  },
  "sameAs": [
    "https://twitter.com/pdftoolspro",
    "https://facebook.com/pdftoolspro",
    "https://linkedin.com/company/pdftoolspro"
  ]
});
