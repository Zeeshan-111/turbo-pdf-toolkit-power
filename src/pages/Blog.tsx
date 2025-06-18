
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const featuredPost = {
    id: "ultimate-pdf-guide-2024",
    title: "The Ultimate PDF Guide for 2024: Everything You Need to Know",
    excerpt: "Discover the latest PDF techniques, tools, and best practices to maximize your productivity in 2024. From advanced conversion methods to security tips.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    author: "PDF Expert Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Guide",
    featured: true
  };

  const blogPosts = [
    {
      id: "compress-pdf-without-quality-loss",
      title: "How to Compress PDFs Without Losing Quality",
      excerpt: "Learn professional techniques to reduce PDF file sizes while maintaining crisp text and images. Perfect for email attachments and web uploads.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      author: "Sarah Johnson",
      date: "2024-01-10",
      readTime: "5 min read",
      category: "Tutorial"
    },
    {
      id: "pdf-tools-for-students",
      title: "Top 10 PDF Tools Every Student Should Know",
      excerpt: "Essential PDF tools and techniques for academic success. From note-taking to research organization, boost your study efficiency.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      author: "Mike Chen",
      date: "2024-01-08",
      readTime: "6 min read",
      category: "Education"
    },
    {
      id: "pdf-security-best-practices",
      title: "PDF Security Best Practices for Business",
      excerpt: "Protect sensitive documents with advanced PDF security features. Learn about encryption, passwords, and digital signatures.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Security"
    },
    {
      id: "convert-pdf-formats-guide",
      title: "Complete Guide to PDF Format Conversion",
      excerpt: "Master the art of PDF conversion. From Word to Excel, images to text - learn when and how to use each format effectively.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop",
      author: "David Kim",
      date: "2024-01-03",
      readTime: "9 min read",
      category: "Guide"
    }
  ];

  const categories = [
    { name: "All", count: 25 },
    { name: "Tutorial", count: 8 },
    { name: "Guide", count: 6 },
    { name: "Security", count: 4 },
    { name: "Education", count: 7 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PDF Tools Blog
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Expert tips, tutorials, and insights to help you master PDF tools and boost your productivity.
          </p>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <TrendingUp className="w-5 h-5" />
            <span>25+ Articles</span>
            <span>•</span>
            <span>Updated Weekly</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:order-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-gray-300">{category.name}</span>
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Ad Space */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 text-center">Advertisement</p>
                <div className="h-32 bg-gray-700 rounded-lg mt-2 flex items-center justify-center">
                  <span className="text-gray-500">Ad Space</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 lg:order-1">
            {/* Featured Post */}
            <article className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 mb-12 hover:border-gray-600 transition-colors group">
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">By {featuredPost.author}</span>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-900/80 text-white px-2 py-1 rounded text-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">By {post.author}</span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Load More Articles
              </Button>
            </div>

            {/* Ad Space */}
            <div className="mt-12 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 text-center mb-4">Advertisement</p>
              <div className="h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Horizontal Ad Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
