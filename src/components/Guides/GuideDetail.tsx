import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { guides } from '../../data/guides';
import { Guide } from '../../types/guides';

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = guides.find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">Guide not found</h1>
          <Link to="/guides" className="text-blue-600 hover:text-blue-700">
            ← Back to guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Link 
            to="/guides" 
            className="inline-flex items-center text-blue-100 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {guide.title}
            </h1>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {guide.readingTime}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {guide.publishDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-blue max-w-none">
          {/* Cover Image */}
          <img 
            src={guide.coverImage} 
            alt={guide.title}
            className="w-full rounded-xl shadow-lg mb-8"
          />
          
          {/* Guide Content */}
          <div dangerouslySetInnerHTML={{ __html: guide.content }} />
          
          {/* Call to Action */}
          <div className="mt-16 p-8 bg-blue-50 rounded-xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Need Professional Help?
            </h3>
            <p className="text-blue-700 mb-6">
              Connect with our network of trusted restoration professionals who can help you implement these guidelines.
            </p>
            <Link
              to="/assessment"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
