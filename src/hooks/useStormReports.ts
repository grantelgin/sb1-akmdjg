import { useState, useEffect } from 'react';
import { StormReport } from '../types/StormReport';
import { StormReportService } from '../services/StormReportService';

export const useStormReports = (date: string, lat: number, lon: number) => {
  const [reports, setReports] = useState<StormReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reports = await StormReportService.getStormReports(
          new Date(date),
          lat,
          lon
        );
        setReports(reports);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (date && lat && lon) {
      fetchReports();
    }
  }, [date, lat, lon]);

  return { reports, loading, error };
}; 