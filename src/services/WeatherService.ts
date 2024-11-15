import axios from 'axios';
import { WeatherData, WeatherHistory } from '../types/Weather';

export class WeatherService {
  private static readonly OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  private static readonly NOAA_TOKEN = import.meta.env.VITE_NOAA_TOKEN;
  
  static async getWeatherHistory(lat: number, lon: number, date: string): Promise<WeatherHistory> {
    const noaaData = await this.getNOAAHistory(lat, lon, date);

    return {
      openWeather: [], // Historical data not available in free tier
      noaa: noaaData
    };
  }

  private static async getOpenWeatherHistory(lat: number, lon: number, date: string): Promise<WeatherData[]> {
    try {
      const startDate = Math.floor(new Date(date).getTime() / 1000);
      const endDate = startDate + (24 * 60 * 60); // 24 hours

      const url = `https://api.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${startDate}&end=${endDate}&appid=${this.OPENWEATHER_API_KEY}&units=imperial`;
      
      console.log('OpenWeather URL:', url);
      
      const response = await axios.get(url);
      console.log('OpenWeather Response:', response.data);
      
      if (!response.data?.list) {
        console.error('Invalid OpenWeather response:', response.data);
        throw new Error('Invalid OpenWeather response format');
      }

      return response.data.list.map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        windGust: item.wind.gust || undefined,
        precipitation: item.rain?.['1h'] || 0,
        description: item.weather[0].description,
        source: 'OpenWeather' as const
      }));
    } catch (error) {
      console.error('OpenWeather API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('OpenWeather API response:', error.response?.data);
      }
      return [];
    }
  }

  private static async getNOAAHistory(lat: number, lon: number, date: string): Promise<WeatherData[]> {
    try {
      const stationUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?extent=${lat-1},${lon-1},${lat+1},${lon+1}&limit=1&datasetid=GHCND&datatypeid=TMAX&startdate=${date}&enddate=${date}`;
      
      const stationResponse = await axios.get(stationUrl, {
        headers: { token: this.NOAA_TOKEN }
      });
      
      if (!stationResponse.data?.results?.[0]?.id) {
        console.log('No active NOAA stations found in area');
        return [];
      }
  
      const stationId = stationResponse.data.results[0].id;
      const startDate = date.split('T')[0];
      const endDate = new Date(new Date(date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  
      const dataUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=${stationId}&startdate=${startDate}&enddate=${endDate}&units=standard`;
      console.log('NOAA Data URL:', dataUrl);
      
      const response = await axios.get(dataUrl, {
        headers: { token: this.NOAA_TOKEN }
      });
  
      console.log('NOAA Data Response:', response.data);
  
      if (!response.data?.results) {
        console.error('Invalid NOAA response:', response.data);
        throw new Error('Invalid NOAA response format');
      }
  
      // Map the NOAA data types we care about
      const NOAA_DATA_TYPES = {
        TMAX: 'temperature',    // Maximum temperature
        TMIN: 'temperature',    // Minimum temperature
        PRCP: 'precipitation',  // Precipitation
        AWND: 'windSpeed',     // Average wind speed
        SNOW: 'snowfall',      // Snowfall
        SNWD: 'snowDepth'      // Snow depth
      };
  
      // Group measurements by date and data type
      const measurementsByDate = response.data.results.reduce((acc: any, item: any) => {
        if (!NOAA_DATA_TYPES[item.datatype]) return acc;
        
        const date = item.date;
        if (!acc[date]) {
          acc[date] = {
            temperature: 0,
            humidity: 0,
            windSpeed: 0,
            precipitation: 0,
            description: ''
          };
        }
  
        // Convert units based on data type
        switch (item.datatype) {
          case 'TMAX':
          case 'TMIN':
            acc[date].temperature = item.value;
            break;
          case 'PRCP':
            acc[date].precipitation = item.value / 25.4; // Convert mm to inches
            break;
          case 'AWND':
            acc[date].windSpeed = item.value * 2.237; // Convert m/s to mph
            break;
        }
  
        return acc;
      }, {});
  
      return Object.entries(measurementsByDate).map(([date, data]: [string, any]) => ({
        date,
        ...data,
        source: 'NOAA' as const
      }));
  
    } catch (error) {
      console.error('NOAA API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('NOAA API response:', error.response?.data);
      }
      return [];
    }
  }
}