import axios from 'axios';
import { StormReport } from '../types/StormReport';
import { supabase } from '../lib/supabaseClient';
import { Hurricane } from '../types/Hurricane';

export class StormReportService {
  private static readonly BASE_URL = 'https://www.spc.noaa.gov/climo/reports';
  private static readonly NHC_BASE_URL = 'https://www.nhc.noaa.gov/data';
  private static readonly MAX_DISTANCE_MILES = 150;
  private static readonly DAYS_RANGE = 7;
  private static readonly HURDAT2_LAST_YEAR = 2022;

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

      const [spcReports, hurricaneReports] = await Promise.all([
        this.getSPCReports(dateRange, lat, lon),
        this.getHurricaneReports(dateRange, lat, lon)
      ]);

      reports.push(...spcReports, ...hurricaneReports);

      console.log('Total reports found:', reports.length);
      return reports;
    } catch (error) {
      console.error('Error fetching storm reports:', error);
      throw error;
    }
  }

  private static async getSPCReports(dateRange: Date[], lat: number, lon: number): Promise<StormReport[]> {
    const reports: StormReport[] = [];

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

    return reports;
  }

  private static async getHurricaneReports(dateRange: Date[], lat: number, lon: number): Promise<StormReport[]> {
    const reports: StormReport[] = [];
    const currentYear = new Date().getFullYear();
    
    // Group dates by year to optimize data fetching
    const datesByYear = dateRange.reduce((acc, date) => {
      const year = date.getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(date);
      return acc;
    }, {} as Record<number, Date[]>);

    await Promise.all(
      Object.entries(datesByYear).map(async ([year, dates]) => {
        const yearNum = parseInt(year);
        if (yearNum <= this.HURDAT2_LAST_YEAR) {
          // Get historical data from HURDAT2
          try {
            const url = `${this.NHC_BASE_URL}/hurdat2-1851-2022-042723.txt`;
            const response = await axios.get(url, { responseType: 'text' });
            const hurricaneReports = dates.flatMap(date => 
              this.parseHurricaneData(response.data, date, lat, lon)
            );
            reports.push(...hurricaneReports);
          } catch (err) {
            console.error(`Error fetching historical hurricane data for ${year}:`, err);
          }
        } else {
          // Get current year data from Supabase
          try {
            const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
            const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
            
            const { data: currentHurricanes, error } = await supabase
              .from('hurricanes')
              .select('*')
              .gte('date', startDate.toISOString())
              .lte('date', endDate.toISOString());

            if (error) throw error;

            if (currentHurricanes) {
              const currentReports = currentHurricanes
                .map((hurricane: Hurricane) => {
                  const distance = this.calculateDistance(lat, lon, hurricane.lat, hurricane.lon);
                  if (distance <= this.MAX_DISTANCE_MILES) {
                    return {
                      type: 'HURRICANE' as const,
                      date: hurricane.date,
                      lat: hurricane.lat,
                      lon: hurricane.lon,
                      distance,
                      description: `${hurricane.name} - Maximum sustained winds: ${hurricane.wind_speed} knots - Category: ${hurricane.category}`
                    };
                  }
                  return null;
                })
                .filter((report: StormReport | null): report is StormReport => report !== null);

              reports.push(...currentReports);
            }
          } catch (err) {
            console.error(`Error fetching current year hurricane data for ${year}:`, err);
          }
        }
      })
    );

    return reports;
  }

  private static parseHurricaneData(data: string, targetDate: Date, targetLat: number, targetLon: number): StormReport[] {
    const reports: StormReport[] = [];
    const lines = data.split('\n');
    let currentStorm: { name: string; year: number } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.length > 30) {
        const year = parseInt(line.substring(0, 4));
        const name = line.substring(18, 28).trim();
        currentStorm = { name, year };
        continue;
      }

      if (currentStorm && line.length >= 40) {
        const date = new Date(
          parseInt(line.substring(0, 4)),
          parseInt(line.substring(4, 6)) - 1,
          parseInt(line.substring(6, 8)),
          parseInt(line.substring(10, 12)),
          0
        );

        if (Math.abs(date.getTime() - targetDate.getTime()) <= 24 * 60 * 60 * 1000) {
          const lat = parseFloat(line.substring(23, 28));
          const lon = -parseFloat(line.substring(30, 36));
          const windSpeed = parseInt(line.substring(38, 41));
          
          const distance = this.calculateDistance(targetLat, targetLon, lat, lon);
          
          if (distance <= this.MAX_DISTANCE_MILES) {
            reports.push({
              type: 'HURRICANE',
              date: date.toISOString(),
              lat,
              lon,
              distance,
              description: `${currentStorm.name} - Maximum sustained winds: ${windSpeed} knots`
            });
          }
        }
      }
    }

    return reports;
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
    const lines = csvData.trim().split('\n');
    const reports: StormReport[] = [];
    let currentHeaders: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;

      if (line.startsWith('Time,')) {
        currentHeaders = line.split(',');
        continue;
      }

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
      const year = '20' + urlDate.substring(0, 2);
      const month = urlDate.substring(2, 4);
      const day = urlDate.substring(4, 6);
      const timeValue = values[headers.indexOf('Time')];
      const paddedTime = timeValue.padStart(4, '0');
      const hours = paddedTime.slice(0, 2);
      const minutes = paddedTime.slice(2);
      const date = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
      
      const lat = parseFloat(values[headers.indexOf('Lat')]);
      const lon = parseFloat(values[headers.indexOf('Lon')]);
      
      if (isNaN(lat) || isNaN(lon)) {
        console.log('Invalid coordinates:', values);
        return null;
      }

      const report: StormReport = {
        type: this.determineReportType(headers),
        date: date,
        lat: lat,
        lon: lon,
        distance: 0,
        description: values[headers.indexOf('Comments')] || ''
      };

      return report;
    } catch (error) {
      console.error('Error parsing report line:', error);
      return null;
    }
  }

  private static determineReportType(headers: string[]): StormReport['type'] {
    if (headers.includes('F_Scale')) return 'TORNADO';
    if (headers.includes('Speed')) return 'WIND';
    if (headers.includes('Size')) return 'HAIL';
    return 'TORNADO';
  }

  private static filterByDistance(reports: StormReport[], targetLat: number, targetLon: number): StormReport[] {
    return reports.map(report => {
      if (typeof report.lat !== 'number' || typeof report.lon !== 'number') {
        return null;
      }
      return {
        ...report,
        distance: this.calculateDistance(targetLat, targetLon, report.lat, report.lon)
      };
    })
    .filter((report): report is StormReport => report !== null)
    .filter(report => report.distance <= this.MAX_DISTANCE_MILES);
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959;
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