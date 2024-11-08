import React, { useState } from 'react';
import { Shield, Home, FileCheck, Clock, CheckCircle } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Process from './components/Process';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import QuestionnaireModal from './components/Questionnaire/QuestionnaireModal';
import DamageAssessmentReport from './components/report/damageAssessmentReport';
import { FormData } from './components/Questionnaire/types';
import StormReportsTest from './components/StormReportsTest';
import FAQ from './components/FAQ';
import { Routes, Route } from 'react-router-dom';

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
  receipts: [],
};

function App() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [reportData, setReportData] = useState<FormData | null>(null);

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
    try {
      await saveFormDataToSheet(data);
      setReportData(data);
      setIsQuestionnaireOpen(false);
      setCurrentStep(0);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Add error handling UI here
    }
  };

    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <Hero onStartAssessment={() => setIsQuestionnaireOpen(true)} />
              <Process />
              <Features />
              <CallToAction onStartAssessment={() => setIsQuestionnaireOpen(true)} />
            </>
          } />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

        <QuestionnaireModal
          isOpen={isQuestionnaireOpen}
          onClose={() => setIsQuestionnaireOpen(false)}
          currentStep={currentStep}
          formData={formData}
          onStepComplete={handleStepComplete}
          onSubmit={handleSubmit}
          onStepChange={handleStepChange}
        />

        {reportData && <DamageAssessmentReport reportData={reportData} />}
        <StormReportsTest />
      </div>
    );
}

export default App;