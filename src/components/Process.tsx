import React from 'react';
import { ClipboardCheck, Users, FileCheck } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-8 h-8 text-blue-600" />,
      number: "1",
      title: "Complete a Basic Damage Assessment",
      description: "Answer 8 questions to describe the damage to your property.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "2",
      title: "Connect with Local Professionals",
      description:
        "Every contractor in our network has passed a rigorous screening process. They understand the local requirements and are fully insured, giving you peace of mind.",
    },
    {
      icon: <FileCheck className="w-8 h-8 text-blue-600" />,
      number: "3",
      title: "Get Help with Your Insurance Claim",
      description:
        "Instantly receive a damage assessment report designed to expedite your insurance claim. This report ensures your insurer has the clear documentation they need to process your claim quickly.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How We Help You with Storm Damage Repair
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  {step.number}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
