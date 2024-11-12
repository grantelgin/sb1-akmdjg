import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Check, AlertCircle, Loader } from 'lucide-react';
import { generateReportId, storeReportData, getReportData } from '../utils/reportUtils';
import { FormData, DamageLevel } from './Questionnaire/types';

export default function SupabaseTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTestSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const reportId = generateReportId();
      
      // Create test data
      const testData: FormData & { reportId: string; stormReports: any[] } = {
        reportId,
        propertyType: 'home',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        address: '123 Test St, Test City, TS 12345',
        damageDate: new Date().toISOString(),
        damageAssessment: {
          roof: 'moderate' as DamageLevel,
          exteriorWalls: 'minor' as DamageLevel,
          windows: 'none' as DamageLevel,
          doors: 'none' as DamageLevel,
          interior: 'minor' as DamageLevel,
          chimney: 'none' as DamageLevel,
          systems: 'none' as DamageLevel,
          landscaping: 'moderate' as DamageLevel,
          other: 'none' as DamageLevel,
        },
        contactConsent: true,
        insuranceClaim: true,
        images: files,
        receipts: [],
        stormReports: []
      };

      // Store the data
      await storeReportData(testData);
      setSuccess(`Report ${reportId} created successfully`);

      // Retrieve the data
      const retrieved = await getReportData(reportId);
      setRetrievedData(retrieved);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Integration Test</h1>

        {/* File Upload Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Upload Test Images</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600">Drag & drop files here, or click to select files</p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Test Button */}
        <button
          onClick={handleTestSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Run Test'
          )}
        </button>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Retrieved Data Display */}
        {retrievedData && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Retrieved Data:</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(retrievedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
