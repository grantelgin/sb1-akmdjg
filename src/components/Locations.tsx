import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Shield, Wrench } from 'lucide-react';

interface Location {
  city: string;
  state: string;
  contractorCount: {
    total: number;
    residential: number;
    commercial: number;
    emergency: number;
  };
}

// This would come from your database in a real implementation
const locations: Location[] = [
  {
    city: "Boston",
    state: "MA",
    contractorCount: {
      total: 45,
      residential: 30,
      commercial: 25,
      emergency: 15
    }
  },
  {
    city: "Worcester",
    state: "MA",
    contractorCount: {
      total: 25,
      residential: 18,
      commercial: 12,
      emergency: 8
    }
  },
  // Add more cities as needed
];

type FilterType = 'all' | 'residential' | 'commercial' | 'emergency';

export default function Locations() {
  const [filter, setFilter] = useState<FilterType>('all');

  const getFilteredCount = (location: Location, filter: FilterType) => {
    switch (filter) {
      case 'residential':
        return location.contractorCount.residential;
      case 'commercial':
        return location.contractorCount.commercial;
      case 'emergency':
        return location.contractorCount.emergency;
      default:
        return location.contractorCount.total;
    }
  };

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'residential':
        return 'Residential storm damage contractors';
      case 'commercial':
        return 'Commercial storm damage contractors';
      case 'emergency':
        return 'Emergency response contractors';
      default:
        return 'All storm damage repair professionals';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Find Storm Damage Repair Professionals Near You
            </h1>
            <p className="text-xl text-blue-100">
              Connect with verified contractors in your area specializing in storm damage restoration
            </p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-colors
              ${filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Shield className="w-4 h-4 mr-2" />
            All Contractors
          </button>
          <button
            onClick={() => setFilter('residential')}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-colors
              ${filter === 'residential' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Residential
          </button>
          <button
            onClick={() => setFilter('commercial')}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-colors
              ${filter === 'commercial' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Commercial
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-colors
              ${filter === 'emergency' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Emergency
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">
          {getFilterLabel(filter)}
        </h2>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Link
              key={`${location.city}-${location.state}`}
              to={`/locations/${location.state.toLowerCase()}/${location.city.toLowerCase()}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">
                    {location.city}, {location.state}
                  </h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {getFilteredCount(location, filter)} Contractors
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}