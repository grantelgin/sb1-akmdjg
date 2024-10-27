import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartAssessment: () => void;
}

export default function Hero({ onStartAssessment }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      <header className="relative bg-blue-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523294587484-bae6cc870010?auto=format&fit=crop&q=80"
            alt="Storm damage"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 to-blue-900/70 mix-blend-multiply" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8" />
              <span className="text-xl font-bold">Restoration Response Network</span>
            </div>
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 px-6 py-2 rounded-full font-semibold transition-all">
              Emergency Contact
            </button>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto py-24">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              REBUILD <span className="text-yellow-400">TOGETHER.</span>
            </h1>
            <p className="text-2xl mb-6 text-blue-100 font-medium leading-relaxed">
              Storm Damage Repair Experts - Your Trusted Partner in Restoring Your Home or Business
            </p>
            <p className="text-xl mb-8 text-blue-200">
              Whether you're a homeowner or business owner, we connect you with trusted, local contractors who specialize in restoring homes and buildings after severe storms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={onStartAssessment}
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
              >
                <span>Start Free Assessment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-blue-200">
                Answer 8 simple questions to get started
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative -mt-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
              <div className="text-white transform rotate-6">
                <Home className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
            <p className="text-gray-600 leading-relaxed">
              When disaster strikes, we're here for you. We understand that storm damage can feel overwhelming and finding reliable help is crucial.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
              <div className="text-white transform rotate-6">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Response</h3>
            <p className="text-gray-600 leading-relaxed">
              Our network of local contractors ensures quick response times and immediate assistance when you need it most.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
              <div className="text-white transform rotate-6">
                <Home className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Care</h3>
            <p className="text-gray-600 leading-relaxed">
              Every contractor in our network is thoroughly vetted and committed to delivering exceptional quality work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}