
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Home, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/SEO/MetaTags";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Track 404 errors for analytics
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_not_found', {
        event_category: 'Navigation',
        event_label: location.pathname,
        value: 1
      });
    }
  }, [location.pathname]);

  const popularTools = [
    { name: "PDF to Word", url: "/tools/pdf-to-word" },
    { name: "Merge PDF", url: "/tools/merge-pdf" },
    { name: "Compress PDF", url: "/tools/compress-pdf" },
    { name: "Split PDF", url: "/tools/split-pdf" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <MetaTags
        title="Page Not Found - PDF Tools Pro"
        description="The page you're looking for doesn't exist. Explore our free PDF tools for conversion, editing, and optimization."
        noindex={true}
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            {/* 404 Hero */}
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
              <h2 className="text-3xl font-bold mb-4">Oops! Page Not Found</h2>
              <p className="text-xl text-gray-400 mb-8">
                The page you're looking for doesn't exist or has been moved.
                But don't worry, we have plenty of useful PDF tools for you!
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-12">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for PDF tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <Link to="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 text-lg">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 p-4 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Popular Tools */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Popular PDF Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularTools.map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.url}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
                  >
                    <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">{tool.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-400 mb-4">
                If you believe this is an error, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Visit Help Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
