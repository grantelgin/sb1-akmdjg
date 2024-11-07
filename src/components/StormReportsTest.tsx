import React, { useState } from 'react';
import { useStormReports } from '../hooks/useStormReports';

export default function StormReportsTest() {
  const [date, setDate] = useState('2024-03-01');
  const [coordinates, setCoordinates] = useState({
    lat: 42.6334,  // Example coordinates for Topsfield, MA
    lon: -70.9500
  });

  const { reports, loading, error } = useStormReports(date, coordinates.lat, coordinates.lon);

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold">Storm Reports Test</h2>
        
        {/* Test Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={coordinates.lat}
                onChange={(e) => setCoordinates(prev => ({
                  ...prev,
                  lat: parseFloat(e.target.value)
                }))}
                className="border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={coordinates.lon}
                onChange={(e) => setCoordinates(prev => ({
                  ...prev,
                  lon: parseFloat(e.target.value)
                }))}
                className="border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading && (
          <div className="text-gray-600">Loading storm reports...</div>
        )}
        
        {error && (
          <div className="text-red-600">
            Error loading storm reports: {error.message}
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Found {reports.length} nearby storm reports
            </h3>
            
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Type:</span>{' '}
                      <span className="font-medium">{report.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Distance:</span>{' '}
                      <span className="font-medium">
                        {report.distance.toFixed(1)} miles
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Coordinates:</span>{' '}
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
        )}
      </div>
    </div>
  );
} 