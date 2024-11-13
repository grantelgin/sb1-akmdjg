import React from 'react';
import { Shield, Users, Handshake, Building, DollarSign, Network } from 'lucide-react';

export default function RestoProfessionals() {
  const benefits = [
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Join Our Network",
      description: "Become part of a nationwide community of dedicated restoration professionals committed to helping communities rebuild after disasters."
    },
    {
      icon: <Building className="w-12 h-12 text-blue-600" />,
      title: "Access Exclusive Leads",
      description: "Get direct access to qualified leads from homeowners and business owners in need of storm damage repairs."
    },
    {
      icon: <Network className="w-12 h-12 text-blue-600" />,
      title: "Network with Peers",
      description: "Collaborate in real-time with other restoration professionals and suppliers to share resources and best practices."
    },
    {
      icon: <DollarSign className="w-12 h-12 text-blue-600" />,
      title: "Exclusive Discounts",
      description: "Access special pricing and deals from our network of trusted suppliers and partners."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Network of Trusted Restoration Professionals
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Be part of a community-driven, national network of dedicated construction professionals who specialize in rebuilding homes and restoring hope after severe storms or wildfires.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105">
              Apply to Join Network
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Benefits of Joining Our Network
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-600">
                Sign up for our newsletter to receive updates about new opportunities, exclusive supplier discounts, and industry insights.
              </p>
            </div>
            
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
