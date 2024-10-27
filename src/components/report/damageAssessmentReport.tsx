import React from 'react';
import { FileText, Home, Calendar, AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Types for our damage assessment
type DamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';

interface DamageAssessment {
  roof: DamageSeverity;
  exteriorWalls: DamageSeverity;
  windows: DamageSeverity;
  doors: DamageSeverity;
  interior: DamageSeverity;
}

interface ReportData {
  propertyType: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  damageDate: string;
  damageAssessment: DamageAssessment;
  insuranceClaim: boolean;
  images: string[];
  receipts: string[];
  contactConsent: boolean;
}

const getSeverityColor = (severity: DamageSeverity) => {
  switch (severity) {
    case 'severe':
      return 'text-red-600';
    case 'moderate':
      return 'text-orange-500';
    case 'minor':
      return 'text-yellow-500';
    default:
      return 'text-green-500';
  }
};

const getSeverityIcon = (severity: DamageSeverity) => {
  switch (severity) {
    case 'severe':
      return <XCircle className="w-5 h-5" />;
    case 'moderate':
      return <AlertTriangle className="w-5 h-5" />;
    case 'minor':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <CheckCircle className="w-5 h-5" />;
  }
};

function DamageAssessmentReport() {
  // Example data (replace with your actual data)
  const reportData: ReportData = {
    propertyType: 'home',
    firstName: 'g',
    lastName: 'g',
    email: 'g@g.co',
    address: '27r East Street, Topsfield, Massachusetts 01983, United States',
    damageDate: '2024-10-02',
    damageAssessment: {
      roof: 'moderate',
      exteriorWalls: 'severe',
      windows: 'none',
      doors: 'none',
      interior: 'none'
    },
    insuranceClaim: false,
    images: ['blob:http://localhost:5173/2f71a4b7-03c8-4721-b73e-c5775b9e9038'],
    receipts: ['blob:http://localhost:5173/2ab594ec-d9f6-4e10-905b-0d4ec44f2c6d'],
    contactConsent: true
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Damage Assessment Report</h1>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Report Generated</p>
                <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="px-6 py-6 border-b">
            <div className="flex items-center space-x-3 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Property Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium text-gray-900 capitalize">{reportData.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Address</p>
                <p className="font-medium text-gray-900">{reportData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium text-gray-900">{`${reportData.firstName} ${reportData.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Email</p>
                <p className="font-medium text-gray-900">{reportData.email}</p>
              </div>
            </div>
          </div>

          {/* Damage Assessment */}
          <div className="px-6 py-6 border-b">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Damage Assessment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(reportData.damageAssessment).map(([key, severity]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className={getSeverityColor(severity)}>
                    {getSeverityIcon(severity)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                    <p className={`font-medium capitalize ${getSeverityColor(severity)}`}>
                      {severity} damage
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="px-6 py-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Date of Damage</p>
                <p className="font-medium text-gray-900">
                  {new Date(reportData.damageDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance Claim Filed</p>
                <p className="font-medium text-gray-900">
                  {reportData.insuranceClaim ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Documentation</p>
                <p className="font-medium text-gray-900">
                  {reportData.images.length} images, {reportData.receipts.length} receipts attached
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>This report is generated automatically based on the provided information.</p>
          <p>For questions or concerns, please contact support.</p>
        </div>
      </div>
    </div>
  );
}

export default DamageAssessmentReport;
