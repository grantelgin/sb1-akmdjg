import React, { useState } from 'react';
import { Shield, Home, FileCheck, Clock, CheckCircle } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Process from './components/Process';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import QuestionnaireModal from './components/Questionnaire/QuestionnaireModal';
import { FormData } from './components/Questionnaire/types';
import StormReportsTest from './components/StormReportsTest';
import FAQ from './components/FAQ';
import { generateReportId, getCoordinatesFromAddress, storeReportData } from './utils/reportUtils';
import { StormReportService } from './services/StormReportService';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SupabaseTest from './components/SupabaseTest';
import DamageAssessmentReport from './components/report/damageAssessmentReport';
import { NotificationService } from './services/NotificationService';
import NotificationsTest from './components/NotificationsTest';
import RestoProfessionals from './components/RestoProfessionals';
import Careers from './components/Careers';
import CrispChat from './components/CrispChat';

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
  receipts: []
};

function App() {
  const navigate = useNavigate();
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
      const reportId = generateReportId();

      // Get storm reports for the area
      const coords = await getCoordinatesFromAddress(data.address);
      console.log('Coordinates:', coords);
      
      const date = new Date(data.damageDate);
      console.log('Date for storm reports:', date);
      
      const stormReports = await StormReportService.getStormReports(
        date,
        coords.lat,
        coords.lon
      );
      console.log('Storm reports from service:', stormReports);

      // Store report data with storm reports
      const reportData = {
        ...data,
        stormReports,
        reportId
      };
      console.log('Report data being stored:', reportData);

      // Store report data in Supabase
      await storeReportData(reportData);

      // Send notifications
      // await NotificationService.notifyUser(data, reportId);

      // Navigate to report page
      navigate(`/report/${reportData.reportId}`);

      // Reset form
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
          <Route path="/report/:reportId" element={<DamageAssessmentReport />} />
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route path="/stormreport-test" element={<StormReportsTest />} />
          <Route path="/professionals" element={<RestoProfessionals />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/test/notifications" element={<NotificationsTest />} />
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
        <CrispChat />
      </div>
    );
}

export default App;