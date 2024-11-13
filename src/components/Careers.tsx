import React, { useState } from 'react';
import { Mail, Shield, Clock, MapPin, Building2, X } from 'lucide-react';

interface Position {
  title: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const positions: Position[] = [
  {
    title: 'Damage Assessment Specialist',
    description: 'Conduct thorough assessments of storm-damaged properties, document findings, and create detailed reports to support insurance claims and repair planning.',
    requirements: [
      'Experience in construction or property inspection',
      'Knowledge of building codes and construction methods',
      'Strong attention to detail and documentation skills',
      'Ability to work in challenging conditions'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'Project Manager',
    description: 'Coordinate restoration projects, manage contractor relationships, and ensure timely completion of repairs while maintaining quality standards.',
    requirements: [
      'Project management experience in construction',
      'Strong organizational and communication skills',
      'Ability to manage multiple projects simultaneously',
      'Experience with project management software'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'Safety Officer',
    description: 'Ensure compliance with safety regulations, conduct site inspections, and implement safety protocols for restoration work.',
    requirements: [
      'OSHA certification',
      'Experience in construction safety',
      'Knowledge of emergency response procedures',
      'Strong leadership and communication skills'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'Public Relations and Community Liaison',
    description: 'Build relationships with local communities, coordinate with stakeholders, and manage public communications during restoration projects.',
    requirements: [
      'Experience in public relations or community outreach',
      'Excellent communication and interpersonal skills',
      'Crisis communication experience',
      'Ability to work with diverse communities'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'Utility and Infrastructure Specialist',
    description: 'Assess and coordinate repairs of damaged utilities and infrastructure systems in affected areas.',
    requirements: [
      'Experience with utility systems and infrastructure',
      'Knowledge of local building codes and regulations',
      'Technical problem-solving skills',
      'Emergency response experience preferred'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'Staging Manager',
    description: 'Manage logistics, coordinate equipment and supplies, and oversee staging areas for restoration projects.',
    requirements: [
      'Experience in logistics or supply chain management',
      'Strong organizational and inventory management skills',
      'Ability to coordinate with multiple vendors and contractors',
      'Experience with logistics software'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  },
  {
    title: 'IT & Communications Lead',
    description: 'Maintain communication systems, manage technology infrastructure, and ensure reliable connectivity in affected areas.',
    requirements: [
      'IT infrastructure experience',
      'Knowledge of emergency communication systems',
      'Problem-solving skills',
      'Experience with mobile communications technology'
    ],
    type: 'Part-time, Contract',
    location: 'Various storm-affected locations'
  }
];

export default function Careers() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [emailError, setEmailError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleApply = (position: Position) => {
    setSelectedPosition(position);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Here you would typically send this data to your backend
    console.log('Application submitted:', {
      position: selectedPosition?.title,
      ...formData
    });

    // Clear form and show confirmation
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setShowModal(false);
    setShowConfirmation(true);
    
    // Hide confirmation after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedPosition(null);
      setEmailError('');
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'email') {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission to Rebuild Communities
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Be part of a team dedicated to helping communities recover and rebuild after severe storms. We're looking for skilled professionals who are passionate about making a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {positions.map((position, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {position.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {position.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {position.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {position.location}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                   <button  onClick={() => handleApply(position)} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Apply Now
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-bold mb-4">
              Apply for {selectedPosition?.title}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your relevant experience..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Thank You for Applying!
            </h3>
            <p className="text-gray-600">
              We appreciate your interest in joining our team. We will carefully review your application and get back to you soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
