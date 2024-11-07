export interface StormReport {
  type: 'TORNADO' | 'WIND' | 'HAIL' | 'HURRICANE';
  date: string;
  lat: number;
  lon: number;
  distance: number;
  description: string;
  // Add other relevant fields based on your data
} 