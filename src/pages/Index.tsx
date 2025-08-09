
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
    { title: "Lightning Fast Conversion", description: "Process your documents in under 10 seconds with our optimized engines.", icon: Rocket },
    { title: "Bank-Level Security", description: "256-bit SSL encryption ensures your files are processed securely and privately.", icon: ShieldCheck },
    { title: "No Watermarks Ever", description: "Professional results with no watermarks, signup, or hidden fees required.", icon: Wand2 },
    { title: "Works Everywhere", description: "Access our best PDF tools online from any device, anywhere in the world.", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" data-tool-page>
      <MetaTags 
        title="PDF Tools Pro - 12 Best Free PDF Toolkit for Conversion & Editing"
        description="Ultimate PDF tools pro toolkit with 12 free conversion & editing tools. Convert PDF to Word, merge, split, compress PDFs. No watermark, no signup required."
        keywords="PDF tools pro, PDF toolkit, PDF conversion, PDF editing, convert PDF to Word, merge PDF free, compress PDF, PDF editor online"
      />
      
      <Header />

      {/* Hero Section with SEO-optimized content and proper H1 */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PDF Tools Pro - Ultimate 12-Tool Toolkit for Conversion & Editing
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-4xl mx-auto">
            Use our <strong>PDF tools pro toolkit</strong> with 12 professional <strong>conversion and editing</strong> features. 
            <strong>Convert PDF to Word</strong>, <strong>merge PDF free</strong>, and <strong>compress PDF to 1MB</strong> instantly. 
            Professional <strong>PDF editing</strong> results with <strong>no watermark PDF tools</strong> and no signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/tools/pdf-to-word" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              PDF Conversion Tool
            </Link>
            <Link to="/tools/merge-pdf" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              PDF Editing Suite
            </Link>
            <Link to="/tools/compress-pdf" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              PDF Toolkit Access
            </Link>
          </div>
          
          {/* SEO Keywords Section with missing keywords */}
          <div className="text-gray-400 text-sm max-w-3xl mx-auto">
            <p>
              <strong>Complete PDF toolkit:</strong> PDF conversion tools, PDF editing suite, merge PDF toolkit, 
              split PDF editor, compress PDF converter, password protection tools, and professional PDF editing features
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid with enhanced descriptions incorporating missing keywords */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center">Complete PDF Conversion & Editing Toolkit - All Free</h2>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Access our professional 12-tool <strong>PDF toolkit</strong> with advanced <strong>conversion and editing</strong> capabilities. 
            Process your documents securely with client-side processing using <strong>PDF Tools Pro</strong>.
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

      {/* Features Section with enhanced copy incorporating keywords */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center">Why Choose PDF Tools Pro Toolkit?</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Join over 2 million users who trust our <strong>PDF conversion and editing toolkit</strong> for professional document processing. 
            Here's what makes <strong>PDF Tools Pro</strong> the ultimate choice for your needs.
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

      {/* SEO Benefits Section with keyword optimization */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">Professional PDF Conversion & Editing Made Simple</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">Advanced PDF Toolkit</h3>
              <p className="text-gray-300 text-sm">Complete <strong>PDF conversion and editing toolkit</strong> with 12 professional tools. Perfect for business and personal use with <strong>PDF Tools Pro</strong>.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">Secure PDF Editing</h3>
              <p className="text-gray-300 text-sm">Your files never leave your device during <strong>PDF editing and conversion</strong>. Maximum privacy and security guaranteed with our toolkit.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-400 mb-2">Professional PDF Conversion</h3>
              <p className="text-gray-300 text-sm">Enterprise-grade <strong>PDF conversion</strong> output suitable for business use. No quality loss or watermarks on your documents.</p>
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
