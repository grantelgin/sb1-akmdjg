import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { Hurricane } from '../types/Hurricane';

export class NHCDataService {
  private static readonly NHC_API_URL = 'https://www.nhc.noaa.gov/CurrentStorms.json';
  private static readonly ADVISORY_BASE_URL = 'https://www.nhc.noaa.gov/text';

  /**
   * Fetches current active storms from NHC and updates the Supabase database
   */
  static async updateActiveHurricanes(): Promise<void> {
    try {
      console.log('Fetching active hurricanes from NHC...');
      const response = await axios.get(this.NHC_API_URL);
      const activeStorms = response.data?.activeStorms || [];

      for (const storm of activeStorms) {
        await this.processStormData(storm);
      }
      
      console.log('Finished updating hurricane data');
    } catch (error) {
      console.error('Error updating hurricane data:', error);
      throw error;
    }
  }

  private static async processStormData(storm: any): Promise<void> {
    try {
      // Get detailed advisory data
      const advisoryUrl = `${this.ADVISORY_BASE_URL}/MIATCP${storm.id}.${storm.advisoryNumber}.txt`;
      const advisoryResponse = await axios.get(advisoryUrl);
      const advisoryData = this.parseAdvisory(advisoryResponse.data);

      if (!advisoryData) {
        console.warn(`Skipping storm ${storm.name} - insufficient data`);
        return;
      }

      const hurricaneData: Omit<Hurricane, 'id' | 'created_at' | 'updated_at'> = {
        name: storm.name,
        date: new Date().toISOString(),
        lat: advisoryData.lat,
        lon: advisoryData.lon,
        wind_speed: advisoryData.windSpeed,
        category: this.determineCategory(advisoryData.windSpeed)
      };

      // Check if we already have this storm's latest position
      const { data: existingData } = await supabase
        .from('hurricanes')
        .select('*')
        .eq('name', storm.name)
        .order('date', { ascending: false })
        .limit(1);

      const lastRecord = existingData?.[0];
      
      // Only insert if position has changed significantly or it's been more than 6 hours
      if (this.shouldUpdateRecord(lastRecord, hurricaneData)) {
        const { error } = await supabase
          .from('hurricanes')
          .insert([hurricaneData]);

        if (error) throw error;
        console.log(`Updated data for hurricane ${storm.name}`);
      } else {
        console.log(`No significant changes for hurricane ${storm.name}, skipping update`);
      }
    } catch (error) {
      console.error(`Error processing storm ${storm.name}:`, error);
    }
  }

  private static parseAdvisory(advisoryText: string): { lat: number; lon: number; windSpeed: number } | null {
    try {
      // Example advisory format:
      // LOCATION...24.5N 96.8W
      // MAXIMUM SUSTAINED WINDS...100 MPH...160 KM/H
      const locationMatch = advisoryText.match(/LOCATION\.\.\.(\d+\.\d+)N\s+(\d+\.\d+)W/);
      const windMatch = advisoryText.match(/MAXIMUM SUSTAINED WINDS\.\.\.(\d+)\s+MPH/);

      if (!locationMatch || !windMatch) return null;

      return {
        lat: parseFloat(locationMatch[1]),
        lon: -parseFloat(locationMatch[2]), // Convert to negative for western hemisphere
        windSpeed: Math.round(parseInt(windMatch[1]) * 0.868976) // Convert MPH to knots
      };
    } catch (error) {
      console.error('Error parsing advisory:', error);
      return null;
    }
  }

  private static determineCategory(windSpeedKnots: number): number {
    // Saffir-Simpson Hurricane Wind Scale (in knots)
    if (windSpeedKnots >= 137) return 5;
    if (windSpeedKnots >= 113) return 4;
    if (windSpeedKnots >= 96) return 3;
    if (windSpeedKnots >= 83) return 2;
    if (windSpeedKnots >= 64) return 1;
    return 0; // Tropical Storm or Depression
  }

  private static shouldUpdateRecord(lastRecord: Hurricane | null, newData: Omit<Hurricane, 'id' | 'created_at' | 'updated_at'>): boolean {
    if (!lastRecord) return true;

    const timeSinceLastUpdate = Date.now() - new Date(lastRecord.date).getTime();
    const sixHoursMs = 6 * 60 * 60 * 1000;

    // Update if more than 6 hours have passed
    if (timeSinceLastUpdate >= sixHoursMs) return true;

    // Update if position has changed by more than 0.1 degrees
    const positionChanged = 
      Math.abs(lastRecord.lat - newData.lat) > 0.1 ||
      Math.abs(lastRecord.lon - newData.lon) > 0.1;

    // Update if wind speed has changed by more than 5 knots
    const windSpeedChanged = Math.abs(lastRecord.wind_speed - newData.wind_speed) > 5;

    return positionChanged || windSpeedChanged;
  }
} 