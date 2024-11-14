import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Building, Home } from 'lucide-react';
import { guides } from '../../data/guides';
import { Guide } from '../../types/guides';

interface GuideCardProps {
  guide: Guide;
}

const GuideCard = ({ guide }: GuideCardProps) => (
  <Link 
    to={`/guides/${guide.slug}`}
    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="aspect-video relative overflow-hidden">
      <img 
        src={guide.coverImage} 
        alt={guide.title}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span>{guide.readingTime}</span>
        <span>•</span>
        <span>{guide.publishDate}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
        {guide.title}
      </h3>
      <p className="text-gray-600">
        {guide.description}
      </p>
    </div>
  </Link>
);

export default function GuidesCollection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'homeowner' | 'business'>('all');

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Helpful Storm Damage Repair Guides</h1>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive guides to help you navigate the restoration process
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors
              ${activeCategory === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Book className="w-4 h-4 inline-block mr-2" />
            All Guides
          </button>
          <button
            onClick={() => setActiveCategory('homeowner')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors
              ${activeCategory === 'homeowner' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Home className="w-4 h-4 inline-block mr-2" />
            For Homeowners
          </button>
          <button
            onClick={() => setActiveCategory('business')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors
              ${activeCategory === 'business' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Building className="w-4 h-4 inline-block mr-2" />
            For Businesses
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides
            .filter(guide => activeCategory === 'all' || guide.category === activeCategory)
            .map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
        </div>
      </div>
    </div>
  );
}
