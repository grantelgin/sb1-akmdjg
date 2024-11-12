import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Home, Calendar, AlertTriangle, CheckCircle, XCircle, AlertCircle, Cloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getReportData } from '../../utils/reportUtils';
import { StormReport } from '../../types/StormReport';

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
  stormReports: StormReport[]; // Add this line
  reportId: string; // Add this line
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

const MAX_DISTANCE_MILES = 100; // Match with StormReportService

function DamageAssessmentReport() {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      const data = await getReportData(reportId);
      setReportData(data);
    };
    fetchReportData();
  }, [reportId]);

  if (!reportData) {
    return <div>Loading...</div>;
  }

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
                    {severity === "none" ? "No" : severity} damage                    
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
        
{/* Storm Reports Section */}
<div className="px-6 py-6 border-t">
  <div className="flex items-center space-x-3 mb-4">
    <Cloud className="w-5 h-5 text-blue-600" />
    <h2 className="text-xl font-semibold text-gray-900">Nearby Storm Reports</h2>
  </div>
  
  {reportData.stormReports.length > 0 ? (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Found {reportData.stormReports.length} storm reports within {MAX_DISTANCE_MILES} miles 
        of your location around the date of damage.
      </p>
      
      <div className="grid gap-4">
        {reportData.stormReports.map((report, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Type:</span>{' '}
                <span className="font-medium">{report.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Distance:</span>{' '}
                <span className="font-medium">{report.distance.toFixed(1)} miles away</span>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>{' '}
                <span className="font-medium">
                  {new Date(report.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>{' '}
                <span className="font-medium">
                  {report.lat.toFixed(4)}, {report.lon.toFixed(4)}
                </span>
              </div>
            </div>
            {report.description && (
              <div className="mt-2">
                <span className="text-gray-600">Description:</span>{' '}
                <span className="font-medium">{report.description}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="text-gray-500">
      No storm reports found in your area for the specified date range.
    </p>
  )}
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
