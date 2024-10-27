import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void; // Add onStepClick prop
  onSubmit?: () => void; // Add optional onSubmit prop
}

export default function StepIndicator({ steps, currentStep, onStepClick, onSubmit }: Props) {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            onClick={() => onStepClick(index)} // Implement onStepClick
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-16 mx-2 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
      {currentStep === steps.length - 1 && onSubmit && (
        <button
          onClick={onSubmit}
          className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      )}
    </div>
  );
}