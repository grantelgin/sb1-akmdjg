import React from 'react';
import { Mail, Shield, Clock, MapPin, Building2 } from 'lucide-react';

interface Position {
  title: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
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
                  <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
