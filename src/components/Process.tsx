import React from 'react';
import { ClipboardCheck, Users, FileCheck } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      number: "01",
      title: "Complete a Basic Damage Assessment",
      description: "Answer 8 questions to describe the damage to your property."
    },
    {
      icon: <Users className="w-6 h-6" />,
      number: "02",
      title: "Connect with Local Professionals",
      description: "Every contractor in our network has passed a rigorous screening process. They understand the local requirements and are fully insured, giving you peace of mind."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      number: "03",
      title: "Get Help with Your Insurance Claim",
      description: "Instantly receive a damage assessment report designed to expedite your insurance claim. This report ensures your insurer has the clear documentation they need to process your claim quickly."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">How We Help You with Storm Damage Repair</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
              <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full transform group-hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-6 left-8 text-8xl font-bold text-blue-900/5">
                  {step.number}
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <div className="text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}