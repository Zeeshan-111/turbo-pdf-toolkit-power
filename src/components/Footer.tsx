
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">PDF Tools Pro</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </Link>
            <span className="text-gray-400 text-sm">
              © 2024 PDF Tools Pro. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
