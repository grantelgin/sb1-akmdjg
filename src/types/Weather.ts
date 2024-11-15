export interface WeatherData {
    date: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    windGust?: number;
    precipitation: number;
    description: string;
    source: 'OpenWeather' | 'NOAA';
  }
  
  export interface WeatherHistory {
    openWeather: WeatherData[];
    noaa: WeatherData[];
  }