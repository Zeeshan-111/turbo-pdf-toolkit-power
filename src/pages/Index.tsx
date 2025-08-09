import React from "react";
import { Link } from "react-router-dom";
import { FileText, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOManager from "@/components/SEO/SEOManager";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEOManager />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Professional PDF Tools Suite - Convert, Edit & Optimize PDFs Online Free
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Complete PDF toolkit with advanced conversion technology. Convert PDF to Word, merge PDF files, compress PDF to 1MB, split PDF pages, and more. Professional-grade PDF processing with no watermark, no signup, unlimited usage for business and personal projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={() => document.getElementById('pdf-tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FileText className="w-6 h-6 mr-3" />
              Explore Free PDF Tools
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 rounded-xl"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap className="w-6 h-6 mr-3" />
              View Features
            </Button>
          </div>

          {/* Trust Indicators with Internal Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2M+</div>
              <div className="text-gray-400">Monthly Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">12</div>
              <div className="text-gray-400">PDF Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-400">Free & Secure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">Available Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Tools Grid */}
      <section id="pdf-tools" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional PDF Conversion & Editing Tools
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Industry-leading PDF processing technology with advanced algorithms for perfect document conversion. Our PDF to Word converter, PDF merger, and compression tools deliver professional results with enterprise-grade security.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/tools/pdf-to-word"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">PDF to Word</h3>
              <p className="text-gray-400">Convert PDF documents to editable Word files</p>
            </Link>

            <Link
              to="/tools/merge-pdf"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Merge PDF</h3>
              <p className="text-gray-400">Combine multiple PDF files into a single document</p>
            </Link>

            <Link
              to="/tools/compress-pdf"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compress PDF</h3>
              <p className="text-gray-400">Reduce PDF file size for easy sharing</p>
            </Link>

            <Link
              to="/tools/split-pdf"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Split PDF</h3>
              <p className="text-gray-400">Extract specific pages from your PDF</p>
            </Link>

            <Link
              to="/tools/pdf-to-jpg"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">PDF to JPG</h3>
              <p className="text-gray-400">Convert PDF pages into JPG images</p>
            </Link>

            <Link
              to="/tools/jpg-to-pdf"
              className="bg-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">JPG to PDF</h3>
              <p className="text-gray-400">Convert JPG images into a PDF document</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Internal Linking */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Why Choose Our PDF Tools Suite?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="Military-Grade Security & Privacy"
              description="Client-side PDF processing ensures your documents never leave your device. Advanced encryption and secure file handling protect sensitive business documents and personal files."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-blue-400" />}
              title="Lightning-Fast PDF Processing"
              description="Optimized algorithms deliver instant results for PDF conversion, compression, and editing. Process large documents and batch operations with enterprise-level performance."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-purple-400" />}
              title="Universal Compatibility"
              description="Works seamlessly across all devices, operating systems, and browsers. Perfect PDF rendering and conversion compatibility with Microsoft Office, Google Workspace, and all major platforms."
            />
          </div>

          {/* Enhanced Content with Strategic Internal Links */}
          <div className="bg-gray-800 rounded-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold mb-6 text-center text-blue-400">
              Complete PDF Document Management Solution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-semibold mb-4 text-green-400">PDF Conversion Excellence</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Transform your documents with our advanced PDF conversion technology. Our PDF to Word converter maintains perfect formatting, fonts, and layouts while creating fully editable documents. Convert PDF to JPG with high-resolution output, or use our JPG to PDF converter for professional document creation.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Experience seamless format transformation with PDF to PNG conversion for web graphics, PNG to PDF compilation for presentations, and Word to PDF generation for professional document sharing.
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-4 text-purple-400">Document Optimization & Management</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Optimize your PDF workflow with powerful editing capabilities. Merge PDF files from multiple sources into cohesive documents, or split PDF pages to extract specific content. Our compress PDF tool reduces file sizes to 1MB or smaller without quality loss.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Enhance document security with password protection, view PDFs with our built-in reader, and optimize images with our JPG compress tool for faster web loading and email sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get Started with Our Free PDF Tools Today!
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Unlock the full potential of your PDF documents with our comprehensive suite of online tools. No registration, no watermarks, and unlimited usage.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
            onClick={() => document.getElementById('pdf-tools')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore PDF Tools
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Index;
