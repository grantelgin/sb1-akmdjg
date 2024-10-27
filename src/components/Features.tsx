import React from 'react';
import { Shield, Heart, Phone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Why Choose Restoration Response Network?",
      content: "When disaster strikes, we're here for you. At Restoration Response Network, we understand that storm damage can feel overwhelming and that finding reliable help is crucial. We connect you with a nationwide network of local contractors who are vetted, experienced, and committed to helping you restore your home or business with care and expertise.",
      icon: <Shield className="w-8 h-8" />,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-white"
    },
    {
      title: "We Stand With You Every Step of the Way",
      content: "We believe in community, and we're here to support you in your time of need. From the moment you contact us to the final repairs, our team is available to guide you through the process. We understand the emotional toll storm damage can take, and we're committed to helping you move forward.",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-white"
    },
    {
      title: "Your Safety is Our Priority",
      content: "In times of crisis, it's all too common for scammers and unqualified contractors to take advantage of vulnerable homeowners and business owners. We take every precaution to ensure that the contractors we connect you with are verified, trusted, and accountable.",
      icon: <Phone className="w-8 h-8" />,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-white"
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl transform transition-transform duration-300 group-hover:scale-105`}></div>
              <div className="relative p-8 h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300`}>
                  <div className="text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.content}
                </p>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}