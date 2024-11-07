import axios from 'axios';
import { StormReport } from '../types/StormReport';

export class StormReportService {
  private static readonly BASE_URL = '/storm_reports';
  private static readonly MAX_DISTANCE_MILES = 150000;
  private static readonly DAYS_RANGE = 7;

  static async getStormReports(date: Date, lat: number, lon: number): Promise<StormReport[]> {
    try {
      console.log('Fetching reports for:', {
        date: date.toISOString(),
        lat,
        lon
      });

      const reports: StormReport[] = [];
      const dateRange = this.getDateRange(date);

      for (const currentDate of dateRange) {
        const formattedDate = this.formatDate(currentDate);
        console.log('Checking date:', formattedDate);

        try {
          const response = await axios.get(`${this.BASE_URL}/${formattedDate}_rpts.csv`, {
            responseType: 'text'
          });

          const parsedReports = this.parseCSV(response.data);
          console.log(`Found ${parsedReports.length} reports for ${formattedDate}`);

          const filteredReports = this.filterByDistance(parsedReports, lat, lon);
          console.log(`${filteredReports.length} reports within distance limit`);

          reports.push(...filteredReports);
        } catch (err) {
          console.log(`No reports found for ${formattedDate}`);
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
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '');
  }

  private static parseCSV(csvData: string): StormReport[] {
    // Split into sections (tornado, wind, hail)
    const sections = csvData.split(/(?=.*F_Scale|.*Speed|.*Size)/);
    const reports: StormReport[] = [];

    sections.forEach(section => {
      if (!section.trim()) return;

      const lines = section.trim().split('\n');
      const headers = lines[0].split(',');
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const report = this.createReportFromLine(headers, values);
        if (report) reports.push(report);
      }
    });

    return reports;
  }

  private static createReportFromLine(headers: string[], values: string[]): StormReport | null {
    try {
      const report: Partial<StormReport> = {
        type: this.determineReportType(headers),
        date: values[headers.indexOf('Date')],
        lat: parseFloat(values[headers.indexOf('Lat')]),
        lon: parseFloat(values[headers.indexOf('Lon')]),
        description: values[headers.indexOf('Comments')] || ''
      };

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

  private static filterByDistance(reports: StormReport[], userLat: number, userLon: number): StormReport[] {
    return reports.filter(report => {
      const distance = this.calculateDistance(userLat, userLon, report.lat, report.lon);
      if (distance <= this.MAX_DISTANCE_MILES) {
        report.distance = distance;
        return true;
      }
      return false;
    });
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }
} 