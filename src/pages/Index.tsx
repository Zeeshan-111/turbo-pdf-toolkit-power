import React from "react";
import { Link } from "react-router-dom";
import { Rocket, ShieldCheck, Code, LayoutDashboard, Wand2, Search, Share2, Download, FileArchive, Lock, FileText, Image, FileSearch2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerSuggestion from "@/components/CustomerSuggestion";
import PrivacyNotice from "@/components/SEO/PrivacyNotice";

const Index = () => {
  const tools = [
    { name: "PDF to Word", description: "Convert PDF to editable Word documents.", icon: FileText, link: "/tools/pdf-to-word" },
    { name: "PDF to JPG", description: "Convert PDF pages into JPG images.", icon: Image, link: "/tools/pdf-to-jpg" },
    { name: "JPG to PDF", description: "Convert JPG images into a single PDF.", icon: FileText, link: "/tools/jpg-to-pdf" },
    { name: "PDF to PNG", description: "Convert PDF pages into PNG images.", icon: Image, link: "/tools/pdf-to-png" },
    { name: "PNG to PDF", description: "Convert PNG images into a single PDF.", icon: FileText, link: "/tools/png-to-pdf" },
    { name: "Merge PDF", description: "Combine multiple PDFs into one.", icon: LayoutDashboard, link: "/tools/merge-pdf" },
    { name: "Split PDF", description: "Extract pages from a PDF to create new PDFs.", icon: LayoutDashboard, link: "/tools/split-pdf" },
    { name: "Compress PDF", description: "Reduce PDF file size for easier sharing.", icon: FileArchive, link: "/tools/compress-pdf" },
    { name: "Lock PDF", description: "Add password protection to your PDF.", icon: Lock, link: "/tools/lock-pdf" },
    { name: "Word to PDF", description: "Convert Word documents to PDF.", icon: FileText, link: "/tools/word-to-pdf" },
    { name: "PDF Reader", description: "View PDF files directly in your browser.", icon: FileSearch2, link: "/tools/pdf-reader" },
    { name: "JPG Compress", description: "Compress JPG files to reduce file size.", icon: FileArchive, link: "/tools/jpg-compress" },
  ];

  const features = [
    { title: "Fast Conversion", description: "Quickly convert your documents with minimal delay.", icon: Rocket },
    { title: "Secure Processing", description: "Your files are processed securely and privately.", icon: ShieldCheck },
    { title: "Easy to Use", description: "Simple and intuitive interface for all your PDF needs.", icon: Wand2 },
    { title: "Cross-Platform", description: "Access our tools from any device, anywhere.", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" data-tool-page>
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Unlock the Power of PDF with PDF Tools Pro
          </h1>
          <p className="text-gray-300 text-lg mb-12">
            Your all-in-one solution for converting, editing, and managing PDF files online. Free, secure, and easy to use.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/tools/pdf-to-word" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Convert PDF to Word
            </Link>
            <Link to="/tools/merge-pdf" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Merge PDF Files
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Explore Our PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} to={tool.link} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
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

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Why Choose PDF Tools Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
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
