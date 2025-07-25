import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, Zap, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import CustomerSuggestion from "@/components/CustomerSuggestion";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tools", icon: FileText, color: "from-blue-500 to-purple-600" },
    { id: "conversion", name: "Conversion", icon: Zap, color: "from-green-500 to-blue-500" },
    { id: "editing", name: "Editing", icon: FileText, color: "from-orange-500 to-red-500" },
    { id: "security", name: "Security", icon: Shield, color: "from-purple-500 to-pink-500" },
    { id: "utilities", name: "Utilities", icon: Brain, color: "from-cyan-500 to-blue-500" }
  ];

  const tools = [
    {
      id: "pdf-to-word",
      title: "PDF to Word",
      description: "Convert PDF files to editable Word documents",
      category: "conversion",
      route: "/tools/pdf-to-word",
      popular: true
    },
    {
      id: "merge-pdf",
      title: "Merge PDF",
      description: "Combine multiple PDF files into one",
      category: "editing",
      route: "/tools/merge-pdf",
      popular: true
    },
    {
      id: "split-pdf",
      title: "Split PDF",
      description: "Extract specific pages from PDF files",
      category: "editing",
      route: "/tools/split-pdf",
      popular: true
    },
    {
      id: "compress-pdf",
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      category: "utilities",
      route: "/tools/compress-pdf",
      popular: true
    },
    {
      id: "jpg-compress",
      title: "JPG Compress",
      description: "Reduce JPG image file sizes while maintaining quality",
      category: "utilities",
      route: "/tools/jpg-compress",
      popular: true
    },
    {
      id: "pdf-to-jpg",
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality JPG images",
      category: "conversion",
      route: "/tools/pdf-to-jpg"
    },
    {
      id: "pdf-to-png",
      title: "PDF to PNG",
      description: "Convert PDF pages to high-quality PNG images",
      category: "conversion",
      route: "/tools/pdf-to-png"
    },
    {
      id: "jpg-to-pdf",
      title: "JPG to PDF",
      description: "Convert JPG images to PDF documents",
      category: "conversion",
      route: "/tools/jpg-to-pdf"
    },
    {
      id: "png-to-pdf",
      title: "PNG to PDF",
      description: "Convert PNG images to PDF documents",
      category: "conversion",
      route: "/tools/png-to-pdf"
    },
    {
      id: "lock-pdf",
      title: "Lock PDF",
      description: "Add password protection to your PDF files",
      category: "security",
      route: "/tools/lock-pdf"
    },
    {
      id: "word-to-pdf",
      title: "Word to PDF",
      description: "Convert Word documents to PDF format",
      category: "conversion",
      route: "/tools/word-to-pdf"
    },
    {
      id: "pdf-reader",
      title: "PDF Reader",
      description: "View and read PDF files online",
      category: "utilities",
      route: "/tools/pdf-reader"
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            PDF Tools Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
            All-in-one PDF toolkit for conversion, editing, and optimization
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg animate-scale-in"
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Tools
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="tools" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <category.icon className="w-4 h-4 inline mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Choose PDF Tools Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Process your PDF files in seconds with our optimized tools</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-400">Your files are processed locally and never stored on our servers</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-400">Advanced algorithms for optimal compression and conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Suggestion Section */}
      <CustomerSuggestion />

      <Footer />
    </div>
  );
};

export default Index;
