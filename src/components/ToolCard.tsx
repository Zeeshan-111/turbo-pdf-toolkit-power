
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  route: string;
  popular?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "conversion":
        return "from-green-500 to-blue-500";
      case "editing":
        return "from-orange-500 to-red-500";
      case "security":
        return "from-purple-500 to-pink-500";
      case "utilities":
        return "from-cyan-500 to-blue-500";
      default:
        return "from-blue-500 to-purple-600";
    }
  };

  return (
    <Link
      to={tool.route}
      className="group block animate-fade-in hover-scale"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(tool.category)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Popular Badge */}
        {tool.popular && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(tool.category)} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-white font-bold text-lg">{tool.title.charAt(0)}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {tool.title}
          </h3>
          
          <p className="text-gray-400 mb-4 line-clamp-2">
            {tool.description}
          </p>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(tool.category)} text-white capitalize`}>
              {tool.category}
            </span>
            
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
