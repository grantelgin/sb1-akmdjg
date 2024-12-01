import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Home, Calendar, AlertTriangle, CheckCircle, XCircle, AlertCircle, Cloud, Users, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getReportData } from '../../utils/reportUtils';
import { StormReport } from '../../types/StormReport';
import { StormReportsMap } from '../StormReportsMap';
import { estimateDemandSurge, DemandSurgeEstimate } from '../../utils/demandSurgeUtils';

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
  weatherHistory?: WeatherHistory;
  demandSurge?: DemandSurgeEstimate;
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
      const coordinates = await getCoordinatesFromAddress(data.address);
      const demandSurge = await estimateDemandSurge(coordinates.lat, coordinates.lon);
      setReportData({ ...data, demandSurge });
    };
    fetchReportData();
  }, [reportId]);

  if (!reportData) {
    return <div>Loading...</div>;
  }

  const DemandSurgeSection = ({ demandSurge }: { demandSurge: DemandSurgeEstimate }) => (
    <div className="px-6 py-6 border-t">
      <div className="flex items-center space-x-3 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Repair Demand Estimate</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2" />
          <span className={`font-semibold ${
            demandSurge.level === 'High' ? 'text-red-600' :
            demandSurge.level === 'Medium' ? 'text-orange-500' :
            'text-green-600'
          }`}>
            {demandSurge.level} Demand Area
          </span>
        </div>

        <p className="text-gray-600 mb-4">{demandSurge.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Single-Family</div>
            <div className="text-lg font-semibold">{demandSurge.buildingCounts.singleFamily.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Multi-Family</div>
            <div className="text-lg font-semibold">{demandSurge.buildingCounts.multiFamily.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Commercial</div>
            <div className="text-lg font-semibold">{demandSurge.buildingCounts.commercial.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Industrial</div>
            <div className="text-lg font-semibold">{demandSurge.buildingCounts.industrial.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-medium">Note:</span>
          </div>
          <p className="text-sm text-gray-600">
            This is an estimate based on the total number of buildings in your area that could potentially be affected by similar weather events. Actual demand may vary based on storm severity, damage patterns, and other factors.
          </p>
        </div>
      </div>
    </div>
  );

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

          {/* Documentation Section */}
          <div className="px-6 py-6 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Documentation</h2>
            </div>

            {/* Images */}
            {reportData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Damage Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {reportData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Damage image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-white">View Full Size</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Receipts */}
            {reportData.receipts.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Receipts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {reportData.receipts.map((receiptUrl, index) => (
                    <div key={index} className="relative group">
                      {receiptUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={receiptUrl}
                          alt={`Receipt ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                        />
                      )}
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-white">View Receipt</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.images.length === 0 && reportData.receipts.length === 0 && (
              <p className="text-gray-500">No documentation attached to this report.</p>
            )}
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
              {/* Map Section */}
              <div className="mt-6">
          <StormReportsMap
            userLocation={{
              lat: parseFloat(reportData.stormReports[0]?.lat.toString() || "0"),
              lon: parseFloat(reportData.stormReports[0]?.lon.toString() || "0")
            }}
            stormReports={reportData.stormReports}
          />
        </div>
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
{reportData.demandSurge && <DemandSurgeSection demandSurge={reportData.demandSurge} />}
{/* Weather History Section */}
<div className="px-6 py-6 border-t">
  <div className="flex items-center space-x-3 mb-4">
    <Cloud className="w-5 h-5 text-blue-600" />
    <h2 className="text-xl font-semibold text-gray-900">Weather Conditions</h2>
  </div>
  
  <div className="space-y-6">
    {/* OpenWeather Data */}
    {reportData.weatherHistory?.openWeather.length > 0 ? (
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">OpenWeather Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportData.weatherHistory.openWeather.map((weather, index) => (
            <div key={index} className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">
                {new Date(weather.date).toLocaleTimeString()}
              </div>
              <div className="font-medium">{weather.temperature}°F</div>
              <div className="text-sm">
                Wind: {weather.windSpeed} mph
                {weather.windGust && ` (Gusts: ${weather.windGust} mph)`}
              </div>
              <div className="text-sm">
                Precipitation: {weather.precipitation}″
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null}

    {/* NOAA Data */}
    {reportData.weatherHistory?.noaa.length > 0 ? (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">NOAA Weather Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportData.weatherHistory.noaa.map((weather, index) => (
            <div key={index} className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">
                {new Date(weather.date).toLocaleDateString()} {new Date(weather.date).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              <div className="font-medium">{weather.temperature}°F</div>
              <div className="text-sm">Wind: {weather.windSpeed} mph</div>
              <div className="text-sm">
                Precipitation: {weather.precipitation}″
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null}
    
    {(!reportData.weatherHistory?.openWeather.length && !reportData.weatherHistory?.noaa.length) && (
      <p className="text-gray-500">
        Weather data is currently unavailable for the date of damage.
      </p>
    )}
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
