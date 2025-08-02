import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, Zap, Shield, Brain, Star, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import CustomerSuggestion from "@/components/CustomerSuggestion";
import MetaTags from "@/components/SEO/MetaTags";
import { generateWebsiteSchema, generateOrganizationSchema, generateFAQSchema } from "@/utils/structuredData";
const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // SEO-optimized content
  const seoTitle = "Free PDF Tools Online - Convert, Edit, Merge & Compress PDFs | PDF Tools Pro";
  const seoDescription = "Best free online PDF tools to convert PDF to Word/Excel/JPG, merge, split, compress & edit PDFs. Fast, secure & no registration required. Better than SmallPDF & iLovePDF!";
  const seoKeywords = "PDF tools, convert PDF to Word, merge PDF, compress PDF, split PDF, PDF editor, free PDF converter, online PDF tools, PDF to JPG, SmallPDF alternative, iLovePDF alternative";

  // Structured data
  const faqs = [{
    question: "Is PDF Tools Pro really free to use?",
    answer: "Yes! All our PDF tools are completely free to use with no hidden fees, registration requirements, or file limits. We believe in providing accessible PDF solutions for everyone."
  }, {
    question: "Are my files secure and private?",
    answer: "Absolutely. All file processing happens locally in your browser using advanced client-side technology. Your files never leave your device, ensuring maximum privacy and security."
  }, {
    question: "What file formats do you support?",
    answer: "We support all major file formats including PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX), JPG, PNG, and more. Our tools are constantly updated to support new formats."
  }, {
    question: "How does PDF Tools Pro compare to SmallPDF and iLovePDF?",
    answer: "PDF Tools Pro offers superior compression algorithms, faster processing, better privacy (no server uploads), unlimited file sizes, and completely free access to all premium features without subscriptions."
  }, {
    question: "Can I process large PDF files?",
    answer: "Yes! Unlike competitors that limit file sizes, PDF Tools Pro can handle files of any size. Our advanced compression algorithms work efficiently even with large documents."
  }];
  const structuredData = [generateWebsiteSchema(), generateOrganizationSchema(), generateFAQSchema(faqs)];
  const categories = [{
    id: "all",
    name: "All Tools",
    icon: FileText,
    color: "from-blue-500 to-purple-600"
  }, {
    id: "conversion",
    name: "Conversion",
    icon: Zap,
    color: "from-green-500 to-blue-500"
  }, {
    id: "editing",
    name: "Editing",
    icon: FileText,
    color: "from-orange-500 to-red-500"
  }, {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "from-purple-500 to-pink-500"
  }, {
    id: "utilities",
    name: "Utilities",
    icon: Brain,
    color: "from-cyan-500 to-blue-500"
  }];
  const tools = [{
    id: "pdf-to-word",
    title: "PDF to Word Converter",
    description: "Convert PDF files to editable Word documents with perfect formatting preservation",
    category: "conversion",
    route: "/tools/pdf-to-word",
    popular: true
  }, {
    id: "merge-pdf",
    title: "Merge PDF Files",
    description: "Combine multiple PDF files into one document instantly and securely",
    category: "editing",
    route: "/tools/merge-pdf",
    popular: true
  }, {
    id: "split-pdf",
    title: "Split PDF Pages",
    description: "Extract specific pages from PDF files or split into multiple documents",
    category: "editing",
    route: "/tools/split-pdf",
    popular: true
  }, {
    id: "compress-pdf",
    title: "Compress PDF Size",
    description: "Reduce PDF file size by up to 90% while maintaining excellent quality",
    category: "utilities",
    route: "/tools/compress-pdf",
    popular: true
  }, {
    id: "jpg-compress",
    title: "JPG Image Compressor",
    description: "Reduce JPG image file sizes with smart compression technology",
    category: "utilities",
    route: "/tools/jpg-compress",
    popular: true
  }, {
    id: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    description: "Convert PDF pages to high-quality JPG images in seconds",
    category: "conversion",
    route: "/tools/pdf-to-jpg"
  }, {
    id: "pdf-to-png",
    title: "PDF to PNG Converter",
    description: "Convert PDF pages to PNG images with transparent backgrounds",
    category: "conversion",
    route: "/tools/pdf-to-png"
  }, {
    id: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    description: "Convert JPG images to PDF documents with custom layouts",
    category: "conversion",
    route: "/tools/jpg-to-pdf"
  }, {
    id: "png-to-pdf",
    title: "PNG to PDF Converter",
    description: "Convert PNG images to PDF with transparency support",
    category: "conversion",
    route: "/tools/png-to-pdf"
  }, {
    id: "lock-pdf",
    title: "Password Protect PDF",
    description: "Add password protection and encryption to secure your PDF files",
    category: "security",
    route: "/tools/lock-pdf"
  }, {
    id: "word-to-pdf",
    title: "Word to PDF Converter",
    description: "Convert Word documents to PDF format with perfect layout preservation",
    category: "conversion",
    route: "/tools/word-to-pdf"
  }, {
    id: "pdf-reader",
    title: "Online PDF Reader",
    description: "View and read PDF files online without downloading software",
    category: "utilities",
    route: "/tools/pdf-reader"
  }];
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return <>
      <MetaTags title={seoTitle} description={seoDescription} keywords={seoKeywords} canonicalUrl="https://pdftoolspro.com/" structuredData={structuredData} />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        {/* Hero Section with SEO-optimized content */}
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Free Online PDF Tools
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in">
              Convert, Edit, Merge, Split & Compress PDFs - Better than SmallPDF & iLovePDF
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
              Professional PDF toolkit with AI-powered compression, enterprise security, and unlimited processing. 
              No registration, no file size limits, completely free forever.
            </p>
            
            {/* Trust Signals */}
            <div className="flex justify-center items-center gap-8 mb-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                <span>2M+ users trust us</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>100% secure & private</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.8/5 rating</span>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg animate-scale-in" onClick={() => document.getElementById('tools')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Start Using Free Tools
            </Button>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section id="tools" className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your PDF Tool</h2>
              <p className="text-gray-400 text-lg">Professional-grade PDF processing tools, completely free</p>
            </div>
            
            <div className="mb-8">
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input type="text" placeholder="Search PDF tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500" />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105` : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                    <category.icon className="w-4 h-4 inline mr-2" />
                    {category.name}
                  </button>)}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)}
            </div>

            {filteredTools.length === 0 && <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No tools found matching your search.</p>
              </div>}
          </div>
        </section>

        {/* Comparison Section - SEO Gold */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose PDF Tools Pro Over Competitors?
            </h2>
            <p className="text-xl text-gray-300 mb-12">Compare us with other PDF tools</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-lg border border-green-500/20">
                <h3 className="text-2xl font-bold text-green-400 mb-4">PDF Tools Pro</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>100% free forever</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No file size limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Client-side processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>AI-powered compression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No registration required</span>
                  </li>
                </ul>
              </div>
              
              
              
              
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced PDF Processing Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Compression</h3>
                <p className="text-gray-400">Reduce PDF size by up to 90% using advanced machine learning algorithms while preserving perfect quality</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-gray-400">All processing happens in your browser. Files never leave your device, ensuring maximum privacy and GDPR compliance</p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Format Detection</h3>
                <p className="text-gray-400">Automatically detect and optimize file formats for best results with intelligent content analysis</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => <div key={index} className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Customer Suggestion Section */}
        <CustomerSuggestion />

        <Footer />
      </div>
    </>;
};
export default Index;