import { StormReport } from '../types/StormReport';

export class StormReportProcessor {
  private static readonly MAX_DISTANCE_MILES = 150;
  private static readonly DAYS_RANGE = 7;

  static filterByDistance(reports: StormReport[], userLat: number, userLon: number): StormReport[] {
    return reports.filter(report => {
      const distance = this.calculateDistance(
        userLat,
        userLon,
        report.lat,
        report.lon
      );
      return distance <= this.MAX_DISTANCE_MILES;
    });
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const { getDistance } = require('geolib');
    
    // Convert coordinates to meters using geolib
    const distanceInMeters = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );

    // Convert meters to miles
    return distanceInMeters * 0.000621371;

  }

  static getDateRange(centerDate: Date): Date[] {
    const dates: Date[] = [];
    for (let i = -this.DAYS_RANGE; i <= this.DAYS_RANGE; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }
} 