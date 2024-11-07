import React from 'react';
import { useStormReports } from '../hooks/useStormReports';

interface Props {
  date: Date;
  lat: number;
  lon: number;
}

export const StormReportsList: React.FC<Props> = ({ date, lat, lon }) => {
  const { reports, loading, error } = useStormReports(date, lat, lon);

  if (loading) return <div>Loading storm reports...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Nearby Storm Reports</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            {report.type} - {report.description} ({report.distance.toFixed(1)} miles away)
          </li>
        ))}
      </ul>
    </div>
  );
}; 