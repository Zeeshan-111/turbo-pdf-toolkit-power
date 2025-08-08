
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Tag, TrendingUp, Globe, Shield, Zap } from 'lucide-react';

const ArticlesGuides = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const articles = [
    {
      id: 'compress-pdf-1mb-email',
      title: 'How to Compress PDF Below 1MB for Email – Free & Fast',
      description: 'Learn professional techniques to compress large PDF files for email attachments without quality loss.',
      category: 'Compression',
      readTime: '5 min read',
      featured: true,
      tags: ['compression', 'email', 'size-reduction'],
      icon: Zap,
      link: '/blog/compress-pdf-1mb-email'
    },
    {
      id: 'pdf-to-word-2025',
      title: 'Best Free PDF to Word Converter Without Login (2025 Update)',
      description: 'Discover the top PDF to Word converters that work without registration or watermarks.',
      category: 'Conversion',
      readTime: '6 min read',
      featured: true,
      tags: ['pdf-to-word', 'conversion', 'free-tools'],
      icon: BookOpen,
      link: '/blog/pdf-to-word-2025'
    },
    {
      id: 'merge-pdf-no-watermark',
      title: 'Merge Multiple PDF Files Online – No Watermark',
      description: 'Step-by-step guide to combine PDFs into one document using free online tools.',
      category: 'Editing',
      readTime: '4 min read',
      featured: false,
      tags: ['merge-pdf', 'combine', 'no-watermark'],
      icon: BookOpen,
      link: '/blog/merge-pdf-no-watermark'
    },
    {
      id: 'split-pdf-pages',
      title: 'Split PDF by Pages – Free Tool (No Signup Needed)',
      description: 'Extract specific pages from PDF documents with our comprehensive splitting guide.',
      category: 'Editing',
      readTime: '5 min read',
      featured: false,
      tags: ['split-pdf', 'extract-pages', 'free'],
      icon: BookOpen,
      link: '/blog/split-pdf-pages'
    },
    {
      id: 'jpg-to-pdf-one-click',
      title: 'Convert JPG to PDF in One Click – Free Tool',
      description: 'Quick tutorial on converting images to PDF format while maintaining quality.',
      category: 'Conversion',
      readTime: '3 min read',
      featured: false,
      tags: ['jpg-to-pdf', 'image-conversion', 'one-click'],
      icon: BookOpen,
      link: '/blog/jpg-to-pdf-one-click'
    },
    {
      id: 'password-protect-pdf',
      title: 'Secure Your PDF: Password Protect Without Software',
      description: 'Learn how to add password protection to PDFs using online tools securely.',
      category: 'Security',
      readTime: '6 min read',
      featured: false,
      tags: ['password-protection', 'security', 'encryption'],
      icon: Shield,
      link: '/blog/password-protect-pdf'
    },
    {
      id: 'pdf-editor-students',
      title: 'Free Online PDF Editor for Students & Freelancers',
      description: 'Essential PDF editing tools and techniques for academic and professional work.',
      category: 'Editing',
      readTime: '7 min read',
      featured: false,
      tags: ['pdf-editor', 'students', 'freelancers'],
      icon: BookOpen,
      link: '/blog/pdf-editor-students'
    },
    {
      id: 'pdf-tools-comparison',
      title: 'iLovePDF vs SmallPDF vs PDF Tools Pro – Which Is Best?',
      description: 'Comprehensive comparison of the top PDF tools platforms with pros and cons.',
      category: 'Reviews',
      readTime: '8 min read',
      featured: true,
      tags: ['comparison', 'review', 'best-tools'],
      icon: TrendingUp,
      link: '/blog/pdf-tools-comparison'
    },
    {
      id: 'hindi-pdf-tools',
      title: 'Hindi Mein Free PDF Tools – बिना Watermark के',
      description: 'हिंदी में PDF टूल्स का उपयोग करने की संपूर्ण गाइड - मुफ्त और वॉटरमार्क रहित।',
      category: 'Multilingual',
      readTime: '5 min read',
      featured: false,
      tags: ['hindi', 'भारतीय', 'free-tools'],
      icon: Globe,
      link: '/blog/hindi-pdf-tools'
    },
    {
      id: 'reduce-pdf-size-methods',
      title: 'Top 5 Ways to Reduce PDF Size Online (No Quality Loss)',
      description: 'Expert methods to compress PDF files while preserving document quality and readability.',
      category: 'Compression',
      readTime: '6 min read',
      featured: false,
      tags: ['compression', 'quality', 'file-size'],
      icon: Zap,
      link: '/blog/reduce-pdf-size-methods'
    }
  ];

  const categories = ['All', 'Conversion', 'Editing', 'Compression', 'Security', 'Reviews', 'Multilingual'];

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Helpful Articles & Guides
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-6">
            Master PDF tools with our comprehensive guides. From basic conversions to advanced techniques, 
            learn how to work smarter with documents.
          </p>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <BookOpen className="w-5 h-5" />
            <span>Expert-written guides</span>
            <span>•</span>
            <span>Updated regularly</span>
            <span>•</span>
            <span>Free resources</span>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
            Featured Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                to={article.link}
                className="bg-gray-900 rounded-xl p-6 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <article.icon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                  <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime}
                  </span>
                  <span className="bg-gray-800 px-2 py-1 rounded">{article.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <Link
              key={article.id}
              to={article.link}
              className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <article.icon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  article.category === 'Security' ? 'bg-red-500/20 text-red-400' :
                  article.category === 'Conversion' ? 'bg-green-500/20 text-green-400' :
                  article.category === 'Compression' ? 'bg-purple-500/20 text-purple-400' :
                  article.category === 'Editing' ? 'bg-blue-500/20 text-blue-400' :
                  article.category === 'Reviews' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {article.category}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime}
                </span>
                <span className="text-blue-400 group-hover:text-blue-300">Read More →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            <span>View All Articles & Guides</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesGuides;
