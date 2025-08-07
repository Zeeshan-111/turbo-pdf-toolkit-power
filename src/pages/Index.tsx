
import React from "react";
import { Link } from "react-router-dom";
import { Rocket, ShieldCheck, Code, LayoutDashboard, Wand2, Search, Share2, Download, FileArchive, Lock, FileText, Image, FileSearch2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerSuggestion from "@/components/CustomerSuggestion";
import PrivacyNotice from "@/components/SEO/PrivacyNotice";

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
      <Header />

      {/* Hero Section with SEO-optimized content */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Best PDF Tools Online - Free, Fast & No Watermark
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-4xl mx-auto">
            Use our <strong>best PDF tools online</strong> to <strong>merge PDF free</strong>, <strong>compress PDF to 1MB</strong>, and <strong>convert PDF to Word</strong> instantly. 
            Professional results with <strong>no watermark PDF tools</strong> and no signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/tools/pdf-to-word" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              PDF to Word Converter
            </Link>
            <Link to="/tools/merge-pdf" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Merge PDF Files
            </Link>
            <Link to="/tools/compress-pdf" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Compress PDF
            </Link>
          </div>
          
          {/* SEO Keywords Section */}
          <div className="text-gray-400 text-sm max-w-3xl mx-auto">
            <p>
              <strong>Popular tools:</strong> PDF to JPG online, JPG to PDF converter, split PDF file, lock PDF with password, 
              Word to PDF online, compress JPG images, PDF reader browser, PNG to PDF converter
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid with enhanced descriptions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center">Complete PDF Toolkit - All Free</h2>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Access professional PDF tools with no signup, no watermarks, and no file size limits. 
            Process your documents securely with client-side processing.
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

      {/* Features Section with enhanced copy */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center">Why Choose PDF Tools Pro?</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Join over 2 million users who trust our platform for professional PDF processing. 
            Here's what makes us the best choice for your document needs.
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

      {/* SEO Benefits Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">Professional PDF Processing Made Simple</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">No File Size Limits</h3>
              <p className="text-gray-300 text-sm">Process large PDFs up to 100MB without restrictions. Perfect for professional documents and presentations.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">Client-Side Processing</h3>
              <p className="text-gray-300 text-sm">Your files never leave your device during processing. Maximum privacy and security guaranteed.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-400 mb-2">Enterprise Quality</h3>
              <p className="text-gray-300 text-sm">Professional-grade output suitable for business use. No quality loss or watermarks on your documents.</p>
            </div>
          </div>
        </div>
      </section>
      
      <CustomerSuggestion />
      <PrivacyNotice />
      
      <Footer />
    </div>
  );
};

export default Index;
