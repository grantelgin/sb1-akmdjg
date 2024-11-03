import React from 'react';
import { Shield, Heart, Phone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Why Choose Restoration Response Network?",
      content:
        "When disaster strikes, we're here for you. At Restoration Response Network, we understand that storm damage can feel overwhelming and that finding reliable help is crucial. We connect you with a nationwide network of local contractors who are vetted, experienced, and committed to helping you restore your home or business with care and expertise.",
      icon: <Shield className="w-10 h-10 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "We Stand With You Every Step of the Way",
      content:
        "We believe in community, and we're here to support you in your time of need. From the moment you contact us to the final repairs, our team is available to guide you through the process. We understand the emotional toll storm damage can take, and we're committed to helping you move forward.",
      icon: <Heart className="w-10 h-10 text-red-600" />,
      bgColor: "bg-red-50",
    },
    {
      title: "Your Safety is Our Priority",
      content:
        "In times of crisis, it's all too common for scammers and unqualified contractors to take advantage of vulnerable homeowners and business owners. We take every precaution to ensure that the contractors we connect you with are verified, trusted, and accountable.",
      icon: <Phone className="w-10 h-10 text-green-600" />,
      bgColor: "bg-green-50",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 ${feature.bgColor} rounded-2xl shadow-lg transition-transform duration-300 hover:shadow-xl`}
            >
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-center">{feature.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
