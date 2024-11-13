import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ContractorFormData } from './types';
import BusinessInfo from './steps/BusinessInfo';
import PropertyTypes from './steps/PropertyTypes';
import ServicesOffered from './steps/ServicesOffered';
import { storeContractorData } from '../../utils/contractorUtils';

interface Props {
  onClose: () => void;
}

export default function ContractorForm({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ContractorFormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    propertyTypes: [],
    services: {
      roofing: [],
      exteriorWalls: [],
      doorsAndWindows: [],
      outdoors: [],
      systems: [],
      other: []
    }
  });

  const steps = [
    { title: 'Business Info', component: BusinessInfo },
    { title: 'Property Types', component: PropertyTypes },
    { title: 'Services', component: ServicesOffered }
  ];

  const handleStepComplete = async (data: Partial<ContractorFormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (currentStep === steps.length - 1) {
      try {
        await storeContractorData(updatedData);
        alert('Application submitted successfully! We will review your application and contact you soon.');
        setCurrentStep(0);
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          propertyTypes: [],
          services: {
            roofing: [],
            exteriorWalls: [],
            doorsAndWindows: [],
            outdoors: [],
            systems: [],
            other: []
          }
        });
        onClose();
      } catch (err) {
        alert('Error submitting application. Please try again.');
        console.error('Error:', err);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const isValidStep = currentStep >= 0 && currentStep < steps.length;
  const CurrentStepComponent = isValidStep ? steps[currentStep].component : null;

  return (
    <>
      <div className="flex mb-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex-1 ${index > 0 ? 'ml-2' : ''}`}
          >
            <div
              className={`h-2 rounded-full ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
            <p className={`mt-2 text-xs text-center ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        {currentStep > 0 && (
          <button
            onClick={handleStepBack}
            className="absolute -top-2 left-0 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        
        {CurrentStepComponent && (
          <CurrentStepComponent
            formData={formData}
            onComplete={handleStepComplete}
          />
        )}
      </div>
    </>
  );
}
