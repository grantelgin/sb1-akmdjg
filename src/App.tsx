import React, { useState } from 'react';
import { Shield, Home, FileCheck, Clock, CheckCircle } from 'lucide-react';
import Hero from './components/Hero';
import Process from './components/Process';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import QuestionnaireModal from './components/Questionnaire/QuestionnaireModal';
import { FormData } from './components/Questionnaire/types';

const initialFormData: FormData = {
  propertyType: 'home',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  damageDate: '',
  damageAssessment: {
    roof: 'none',
    exteriorWalls: 'none',
    windows: 'none',
    doors: 'none',
    interior: 'none',
    chimney: 'none',
    systems: 'none',
    landscaping: 'none',
    other: 'none',
  },
  contactConsent: false,
  insuranceClaim: false,
  images: [],
};

function App() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleStepComplete = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleStepChange = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (data: FormData) => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    setIsQuestionnaireOpen(false);
    setCurrentStep(0);
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-blue-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523294587484-bae6cc870010?auto=format&fit=crop&q=80"
            alt="Storm damage"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8" />
              <span className="text-xl font-bold">Restoration Response Network</span>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-semibold transition-colors">
              Emergency Contact
            </button>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Trusted Partner in Storm Damage Repair
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              We connect you with trusted, local contractors who specialize in restoring homes and buildings after severe storms.
            </p>
            <button 
              onClick={() => setIsQuestionnaireOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105"
            >
              Start Your Free Assessment
            </button>
          </div>
        </div>
      </header>

      <Hero onStartAssessment={() => setIsQuestionnaireOpen(true)} />
      <Process />
      <Features />
      <CallToAction onStartAssessment={() => setIsQuestionnaireOpen(true)} />

      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        currentStep={currentStep}
        formData={formData}
        onStepComplete={handleStepComplete}
        onSubmit={handleSubmit}
        onStepChange={handleStepChange}
      />
    </div>
  );
}

export default App;