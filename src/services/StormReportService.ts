import axios from 'axios';
import { StormReport } from '../types/StormReport';

export class StormReportService {
  private static readonly BASE_URL = 'https://www.spc.noaa.gov/climo/reports';
  private static readonly MAX_DISTANCE_MILES = 100;
  private static readonly DAYS_RANGE = 7;

  static async getStormReports(dateStr: string, lat: number, lon: number): Promise<StormReport[]> {
    try {
      const date = new Date(dateStr);
      console.log('Fetching reports for:', {
        date: date.toISOString(),
        lat,
        lon
      });

      const reports: StormReport[] = [];
      const dateRange = this.getDateRange(date);

      for (const currentDate of dateRange) {
        const formattedDate = this.formatDate(currentDate);
        const url = `${this.BASE_URL}/${formattedDate}_rpts.csv`;
        console.log('Fetching from URL:', url);

        try {
          const response = await axios.get(url, {
            responseType: 'text'
          });

          console.log('Response status:', response.status);
          console.log('Response data preview:', response.data.substring(0, 200));

          const parsedReports = this.parseCSV(response.data, formattedDate);
          console.log(`Found ${parsedReports.length} reports for ${formattedDate}`);

          const filteredReports = this.filterByDistance(parsedReports, lat, lon);
          console.log(`${filteredReports.length} reports within ${this.MAX_DISTANCE_MILES} miles`);

          reports.push(...filteredReports);
        } catch (err) {
          console.error(`Error fetching reports for ${formattedDate}:`, err);
        }
      }

      console.log('Total reports found:', reports.length);
      return reports;
    } catch (error) {
      console.error('Error fetching storm reports:', error);
      throw error;
    }
  }

  private static getDateRange(centerDate: Date): Date[] {
    const dates: Date[] = [];
    for (let i = -this.DAYS_RANGE; i <= this.DAYS_RANGE; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private static parseCSV(csvData: string, urlDate: string): StormReport[] {
    // Split the CSV data into lines
    const lines = csvData.trim().split('\n');
    const reports: StormReport[] = [];
    let currentHeaders: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // If this is a header line, update current headers
      if (line.startsWith('Time,')) {
        currentHeaders = line.split(',');
        continue;
      }

      // Process data lines
      const values = line.split(',');
      if (values.length === currentHeaders.length) {
        const report = this.createReportFromLine(currentHeaders, values, urlDate);
        if (report) reports.push(report);
      }
    }

    return reports;
  }

  private static createReportFromLine(headers: string[], values: string[], urlDate: string): StormReport | null {
    try {
      // Get date components from URL date (format: YYMMDD)
      const year = '20' + urlDate.substring(0, 2);
      const month = urlDate.substring(2, 4);
      const day = urlDate.substring(4, 6);
      const time = values[headers.indexOf('Time')];
      
      // Combine date and time
      const date = `${year}-${month}-${day}T${time.padStart(4, '0')}:00Z`;

      const report: Partial<StormReport> = {
        type: this.determineReportType(headers),
        date: date,
        lat: parseFloat(values[headers.indexOf('Lat')]),
        lon: parseFloat(values[headers.indexOf('Lon')]),
        description: values[headers.indexOf('Comments')] || ''
      };

      // Validate coordinates
      if (isNaN(report.lat) || isNaN(report.lon)) {
        console.log('Invalid coordinates:', values);
        return null;
      }

      return report as StormReport;
    } catch (error) {
      console.error('Error parsing report line:', error);
      return null;
    }
  }

  private static determineReportType(headers: string[]): StormReport['type'] {
    if (headers.includes('F_Scale')) return 'TORNADO';
    if (headers.includes('Speed')) return 'WIND';
    if (headers.includes('Size')) return 'HAIL';
    return 'TORNADO'; // default
  }

  private static filterByDistance(reports: StormReport[], targetLat: number, targetLon: number): StormReport[] {
    return reports.map(report => ({
      ...report,
      distance: this.calculateDistance(targetLat, targetLon, report.lat, report.lon)
    })).filter(report => report.distance <= this.MAX_DISTANCE_MILES);
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
} 