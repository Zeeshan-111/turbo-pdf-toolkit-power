
import React from 'react';
import MetaTags from './SEO/MetaTags';
import Breadcrumbs from './SEO/Breadcrumbs';
import Header from './Header';
import Footer from './Footer';
import { generateSoftwareApplicationSchema, generateHowToSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/utils/structuredData';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  toolName: string;
  toolUrl: string;
  breadcrumbs: Array<{name: string, url: string}>;
  howToSteps: string[];
  faqs: FAQ[];
  keywords?: string;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  children,
  title,
  description,
  toolName,
  toolUrl,
  breadcrumbs,
  howToSteps,
  faqs,
  keywords
}) => {
  // Generate structured data
  const structuredData = [
    generateSoftwareApplicationSchema(toolName, toolUrl, description),
    generateHowToSchema(toolName, howToSteps),
    generateFAQSchema(faqs),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://pdftoolspro.com' },
      ...breadcrumbs
    ])
  ];

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        canonicalUrl={toolUrl}
        keywords={keywords}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumbs items={[...breadcrumbs, { name: toolName, url: toolUrl, current: true }]} />
          
          {children}
          
          {/* FAQ Section for SEO */}
          {faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* How to Use Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use {toolName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {howToSteps.map((step, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default ToolPageLayout;
