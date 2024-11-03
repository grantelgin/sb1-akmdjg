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


    </div>
  );
}