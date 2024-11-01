import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import StepIndicator from './StepIndicator';
import PersonalInfo from './steps/PersonalInfo';
import PropertyAddress from './steps/PropertyAddress';
import DamageDate from './steps/DamageDate';
import DamageAssessment from './steps/DamageAssessment';
import ContractorContact from './steps/ContractorContact';
// import InsuranceClaim from './steps/InsuranceClaim';
// import InsuranceCarrier from './steps/InsuranceCarrier';
import UploadImages from './steps/UploadImages';
import { FormData } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  formData: FormData;
  onStepComplete: (data: Partial<FormData>) => void;
  onSubmit: (data: FormData) => void;
  onStepChange: (step: number) => void; // New prop for changing steps
}

export default function QuestionnaireModal({
  isOpen,
  onClose,
  currentStep,
  formData,
  onStepComplete,
  onSubmit,
  onStepChange, // Destructure the new prop
}: Props) {
  if (!isOpen) return null;

  const steps = [
    { title: 'Personal Info', component: PersonalInfo },
    { title: 'Property', component: PropertyAddress },
    { title: 'Date', component: DamageDate },
    { title: 'Assessment', component: DamageAssessment },
    { title: 'Contractor', component: ContractorContact },
    // { title: 'Insurance', component: InsuranceClaim },
    // { title: 'Carrier', component: InsuranceCarrier },
    { title: 'Upload', component: UploadImages }
  ];

  const isValidStep = currentStep >= 0 && currentStep < steps.length;
  const CurrentStepComponent = isValidStep ? steps[currentStep].component : null;
  
  const handleStepComplete = (data: Partial<FormData>) => {
    onStepComplete(data);
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      // If it's the last step, call onSubmit and close the modal
      onSubmit({ ...formData, ...data });
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-blue-900">
            Damage Assessment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <StepIndicator
            steps={steps.map((s) => s.title)}
            currentStep={currentStep}
            onStepClick={onStepChange}
          />

          <div className="mt-8">
            {currentStep > 0 && (
              <button
                onClick={() => onStepChange(currentStep - 1)}
                className="text-gray-500 hover:text-gray-700 mb-4 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            {CurrentStepComponent ? (
              <CurrentStepComponent
                formData={formData}
                onComplete={handleStepComplete}
              />
            ) : (
              <p>Error: Invalid step</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}