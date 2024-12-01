import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TigerDataService } from '../../services/TigerDataService';
import { supabase } from '../../utils/supabase';
import { Loader2, CheckCircle, XCircle, Upload, Search } from 'lucide-react';

interface DataStats {
  singleFamily: number;
  multiFamily: number;
  commercial: number;
  industrial: number;
  total: number;
  processingSummary?: {
    totalFeatures: number;
    skippedFeatures: number;
    invalidFeatures: number;
    validBuildings: number;
  };
}

export default function TigerDataManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<DataStats | null>(null);
  const [testCoordinates, setTestCoordinates] = useState({
    lat: 42.3601,
    lon: -71.0589
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      for (const file of acceptedFiles) {
        if (file.name.endsWith('.zip')) {
          await TigerDataService.loadTigerDataFromZip(file);
        } else if (file.name.endsWith('.shp')) {
          await TigerDataService.loadTigerData(file);
        }
      }
      
      await TigerDataService.loadTigerData(shpFile);
      setSuccess('Data loaded successfully');
      await verifyDataLoad();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/x-shapefile': ['.shp'],
      'application/zip': ['.zip']
    }
  });

  const verifyDataLoad = async () => {
    try {
      const { data, error } = await supabase
        .from('tiger_buildings')
        .select('type', { count: 'exact' })
        .order('type');

      if (error) throw error;

      const stats: DataStats = {
        singleFamily: 0,
        multiFamily: 0,
        commercial: 0,
        industrial: 0,
        total: 0
      };

      data.forEach(record => {
        stats[record.type]++;
        stats.total++;
      });

      setStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying data');
    }
  };

  const testDataRetrieval = async () => {
    try {
      setLoading(true);
      const counts = await TigerDataService.getBuildingCounts(
        testCoordinates.lat,
        testCoordinates.lon
      );
      
      setSuccess(`Retrieved building counts for test coordinates: ${JSON.stringify(counts)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error testing data retrieval');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">TIGER Data Manager</h1>

      {/* File Upload */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Drag and drop TIGER shapefiles or ZIP archives here, or click to select files
          </p>
        </div>
      </div>

      {/* Status and Controls */}
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600">
            <XCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-600 mb-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
            {stats?.processingSummary && (
              <div className="text-sm text-green-700 ml-7">
                <div>Total features processed: {stats.processingSummary.totalFeatures}</div>
                <div>Valid buildings found: {stats.processingSummary.validBuildings}</div>
                <div>Skipped features: {stats.processingSummary.skippedFeatures}</div>
                <div>Invalid features: {stats.processingSummary.invalidFeatures}</div>
              </div>
            )}
          </div>
        )}

        {/* Data Statistics */}
        {stats && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Data Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Single Family</div>
                <div className="text-lg font-semibold">{stats.singleFamily.toLocaleString()}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Multi Family</div>
                <div className="text-lg font-semibold">{stats.multiFamily.toLocaleString()}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Commercial</div>
                <div className="text-lg font-semibold">{stats.commercial.toLocaleString()}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">Industrial</div>
                <div className="text-lg font-semibold">{stats.industrial.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Data Retrieval */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Test Data Retrieval</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={testCoordinates.lat}
                onChange={(e) => setTestCoordinates(prev => ({
                  ...prev,
                  lat: parseFloat(e.target.value)
                }))}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={testCoordinates.lon}
                onChange={(e) => setTestCoordinates(prev => ({
                  ...prev,
                  lon: parseFloat(e.target.value)
                }))}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>
          <button
            onClick={testDataRetrieval}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            Test Retrieval
          </button>
        </div>
      </div>
    </div>
  );
} 