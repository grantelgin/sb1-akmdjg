import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Users, FileCheck } from 'lucide-react';

export default function LocationDetail() {
  const { state, city } = useParams();
  
  const formattedCity = city?.charAt(0).toUpperCase() + city?.slice(1);
  const formattedState = state?.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Expert storm damage repair in {formattedCity}, {formattedState}
            </h1>
            <p className="text-xl text-blue-100">
              Connect with trusted local contractors who understand {formattedCity}'s unique weather challenges
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              Every contractor in our network is thoroughly vetted and insured
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Users className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">
              Work with contractors who understand local building codes and regulations
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FileCheck className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Free Assessment</h3>
            <p className="text-gray-600">
              Get a detailed damage assessment report to expedite your insurance claim
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}