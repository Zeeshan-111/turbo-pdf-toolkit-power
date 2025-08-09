
import React from "react";
import { Link } from "react-router-dom";
import { Rocket, ShieldCheck, Code, LayoutDashboard, Wand2, Search, Share2, Download, FileArchive, Lock, FileText, Image, FileSearch2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerSuggestion from "@/components/CustomerSuggestion";
import PrivacyNotice from "@/components/SEO/PrivacyNotice";
import ArticlesGuides from "@/components/ArticlesGuides";
import MetaTags from "@/components/SEO/MetaTags";

const Index = () => {
  const tools = [
    { name: "PDF to Word", description: "Convert PDF to editable Word documents. Free PDF to Word converter with no signup required.", icon: FileText, link: "/tools/pdf-to-word" },
    { name: "PDF to JPG", description: "Convert PDF pages into high-quality JPG images. Extract images from PDF documents.", icon: Image, link: "/tools/pdf-to-jpg" },
    { name: "JPG to PDF", description: "Convert JPG images into a single PDF. Combine multiple images into one PDF document.", icon: FileText, link: "/tools/jpg-to-pdf" },
    { name: "PDF to PNG", description: "Convert PDF pages into PNG images with transparent backgrounds.", icon: Image, link: "/tools/pdf-to-png" },
    { name: "PNG to PDF", description: "Convert PNG images into a single PDF with preserved transparency.", icon: FileText, link: "/tools/png-to-pdf" },
    { name: "Merge PDF", description: "Combine multiple PDFs into one. Free PDF merger with drag-and-drop interface.", icon: LayoutDashboard, link: "/tools/merge-pdf" },
    { name: "Split PDF", description: "Extract pages from a PDF to create new PDFs. Split by page ranges or individual pages.", icon: LayoutDashboard, link: "/tools/split-pdf" },
    { name: "Compress PDF", description: "Reduce PDF file size to 1MB or smaller without losing quality.", icon: FileArchive, link: "/tools/compress-pdf" },
    { name: "Lock PDF", description: "Add password protection to your PDF. Secure PDFs with encryption.", icon: Lock, link: "/tools/lock-pdf" },
    { name: "Word to PDF", description: "Convert Word documents to PDF format. Preserve formatting perfectly.", icon: FileText, link: "/tools/word-to-pdf" },
    { name: "PDF Reader", description: "View PDF files directly in your browser. Fast, secure PDF reader online.", icon: FileSearch2, link: "/tools/pdf-reader" },
    { name: "JPG Compress", description: "Compress JPG files to reduce file size while maintaining image quality.", icon: FileArchive, link: "/tools/jpg-compress" },
  ];

  const features = [
    { title: "Lightning Fast PDF Conversion", description: "Process your PDF documents in under 10 seconds with our advanced conversion engines. Our toolkit handles PDF to Word, PDF to JPG, and all major format conversions instantly.", icon: Rocket },
    { title: "Bank-Level Security for PDF Editing", description: "256-bit SSL encryption ensures your PDF files are processed securely and privately. All PDF conversion and editing happens locally in your browser for maximum security.", icon: ShieldCheck },
    { title: "Professional PDF Tools - No Watermarks Ever", description: "Get professional PDF conversion and editing results with no watermarks, signup, or hidden fees required. Perfect for business and personal PDF toolkit needs.", icon: Wand2 },
    { title: "Universal PDF Toolkit Access", description: "Access our comprehensive PDF tools pro suite from any device, anywhere in the world. Complete PDF conversion and editing toolkit works on desktop, tablet, and mobile.", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" data-tool-page>
      <MetaTags 
        title="PDF Tools Pro - Best Free PDF Toolkit for Conversion & Editing (No Watermark)"
        description="Complete PDF tools pro toolkit with 12 free conversion & editing tools. Convert PDF to Word, merge PDFs, compress PDF to 1MB. Professional PDF toolkit with no watermark, no signup required."
        keywords="PDF tools pro, PDF toolkit, PDF conversion, PDF editing, convert PDF to Word, merge PDF free, compress PDF, PDF editor online, PDF tools no watermark"
      />
      
      <Header />

      {/* Hero Section with optimized H1 and keyword-rich content */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PDF Tools Pro - Ultimate PDF Toolkit for Conversion & Editing
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-4xl mx-auto">
            Transform your document workflow with our comprehensive <strong>PDF tools pro toolkit</strong> featuring 12 professional 
            <strong>PDF conversion and editing</strong> solutions. <strong>Convert PDF to Word</strong> instantly, 
            <strong>merge PDF files</strong> seamlessly, and <strong>compress PDF to 1MB</strong> without quality loss. 
            Our advanced <strong>PDF toolkit</strong> delivers professional <strong>PDF editing</strong> results with 
            <strong>no watermark</strong> restrictions and zero signup requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/tools/pdf-to-word" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Start PDF Conversion
            </Link>
            <Link to="/tools/merge-pdf" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Access PDF Editing Suite
            </Link>
            <Link to="/tools/compress-pdf" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Use PDF Toolkit Now
            </Link>
          </div>
          
          {/* Enhanced SEO Keywords Section */}
          <div className="text-gray-400 text-sm max-w-3xl mx-auto">
            <p>
              <strong>Complete PDF toolkit features:</strong> Advanced PDF conversion tools, professional PDF editing suite, 
              seamless PDF merger toolkit, intelligent PDF splitter, efficient PDF compression, robust password protection, 
              and comprehensive PDF manipulation capabilities for all your document processing needs.
            </p>
          </div>
        </div>
      </section>

      {/* PDF Tools Grid with H2 and enhanced descriptions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Complete PDF Conversion & Editing Toolkit - 12 Free Tools</h2>
          <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            Discover our professional <strong>PDF tools pro</strong> collection with advanced <strong>conversion and editing</strong> capabilities. 
            Each tool in our <strong>PDF toolkit</strong> is designed for maximum efficiency and professional results. 
            Process your documents securely with client-side <strong>PDF conversion</strong> and <strong>editing</strong> technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} to={tool.link} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300 block">
                <div className="flex items-center mb-4">
                  <tool.icon className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-medium text-white">{tool.name}</h3>
                </div>
                <p className="text-gray-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with H2 */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Why Choose PDF Tools Pro for Conversion & Editing?</h2>
          <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Join over 2 million users who trust our <strong>PDF conversion and editing toolkit</strong> for professional document processing. 
            Our <strong>PDF tools pro</strong> platform combines cutting-edge technology with user-friendly design to deliver 
            exceptional results for all your <strong>PDF conversion</strong> and <strong>editing</strong> needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced PDF Toolkit Benefits Section with H2 */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Advanced PDF Toolkit for Professional Conversion & Editing</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-medium text-blue-400 mb-4">Comprehensive PDF Conversion Suite</h3>
              <p className="text-gray-300 mb-4">
                Our <strong>PDF conversion</strong> technology supports all major file formats including Word, Excel, PowerPoint, 
                JPG, PNG, and more. The <strong>PDF toolkit</strong> ensures perfect formatting preservation and professional 
                output quality for every <strong>conversion</strong> task.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>PDF to Word conversion</strong> with editable formatting</li>
                <li>• Image <strong>conversion</strong> (PDF to JPG, PNG to PDF)</li>
                <li>• Office document <strong>conversion</strong> (Word to PDF)</li>
                <li>• Batch <strong>PDF conversion</strong> capabilities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-green-400 mb-4">Professional PDF Editing Tools</h3>
              <p className="text-gray-300 mb-4">
                Advanced <strong>PDF editing</strong> capabilities allow you to merge, split, compress, and secure your documents. 
                Our <strong>PDF tools pro</strong> suite provides enterprise-grade <strong>editing</strong> features without 
                complex software installations.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Advanced <strong>PDF editing</strong> and manipulation</li>
                <li>• Smart PDF compression for size optimization</li>
                <li>• Secure password protection and encryption</li>
                <li>• Intelligent page extraction and merging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Tools Pro Features Section with H2 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">PDF Tools Pro: Industry-Leading Conversion & Editing Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium text-purple-400 mb-3">Advanced PDF Toolkit Architecture</h3>
              <p className="text-gray-300 text-sm mb-3">
                Built on cutting-edge web technology, our <strong>PDF toolkit</strong> processes documents locally in your browser. 
                This ensures maximum privacy and lightning-fast <strong>PDF conversion</strong> and <strong>editing</strong> performance.
              </p>
              <div className="text-gray-400 text-xs">
                <strong>Key features:</strong> Client-side processing, zero server uploads, instant results, universal compatibility
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium text-blue-400 mb-3">Secure PDF Editing Environment</h3>
              <p className="text-gray-300 text-sm mb-3">
                Your sensitive documents never leave your device during <strong>PDF editing</strong> and <strong>conversion</strong>. 
                Our <strong>PDF tools pro</strong> platform guarantees complete privacy and security for all document processing tasks.
              </p>
              <div className="text-gray-400 text-xs">
                <strong>Security benefits:</strong> No cloud storage, local processing, encrypted connections, GDPR compliant
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium text-green-400 mb-3">Professional PDF Conversion Results</h3>
              <p className="text-gray-300 text-sm mb-3">
                Enterprise-grade <strong>PDF conversion</strong> output suitable for business presentations, legal documents, 
                and professional communications. No quality loss, watermarks, or usage restrictions with our <strong>toolkit</strong>.
              </p>
              <div className="text-gray-400 text-xs">
                <strong>Output quality:</strong> High-resolution images, preserved formatting, perfect text extraction, professional standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use PDF Tools Pro Section with H2 */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">How to Use PDF Tools Pro for Conversion & Editing</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Choose Your PDF Tool</h3>
                <p className="text-gray-300 text-sm">
                  Select from our comprehensive <strong>PDF toolkit</strong> including <strong>conversion</strong> tools 
                  (PDF to Word, JPG to PDF) and <strong>editing</strong> tools (merge, split, compress).
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Upload Your PDF Files</h3>
                <p className="text-gray-300 text-sm">
                  Drag and drop your documents into our secure <strong>PDF tools pro</strong> interface. 
                  All <strong>PDF editing</strong> and <strong>conversion</strong> happens locally for maximum privacy.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Download Results Instantly</h3>
                <p className="text-gray-300 text-sm">
                  Get your processed files immediately with professional quality. No watermarks, 
                  no signup required - just pure <strong>PDF toolkit</strong> efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Articles and Guides Section */}
      <ArticlesGuides />
      
      <CustomerSuggestion />
      <PrivacyNotice />
      
      <Footer />
    </div>
  );
};

export default Index;
