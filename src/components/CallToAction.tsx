import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

interface CTAProps {
  onStartAssessment: () => void;
}

export default function CallToAction({ onStartAssessment }: CTAProps) {
  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get Your Free Damage Assessment Report</h2>
            <p className="text-xl mb-8 text-blue-100">
              When you're dealing with storm damage, the last thing you want is to deal with a drawn-out insurance process. 
              We make it easy by offering a detailed damage assessment report, crafted to speed up your insurance claims.
            </p>
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-yellow-400" />
              <span className="text-lg">Instant report generation</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Ready to Rebuild?</h3>
            <p className="mb-8">
              Contact us today to be matched with a trusted storm damage contractor in your area.
            </p>
            <button
              onClick={onStartAssessment}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Start Free Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}