import { supabase } from '../utils/supabase';
import * as shapefile from 'shapefile';
import { point, buffer, booleanPointInPolygon } from '@turf/turf';
import { FileWithPath } from 'react-dropzone';
import JSZip from 'jszip';

interface BuildingData {
  type: 'single_family' | 'multi_family' | 'commercial' | 'industrial';
  geometry: GeoJSON.Geometry;
  properties: {
    MTFCC: string;
    FULLNAME: string;
    STATEFP: string;
    COUNTYFP: string;
  };
}

interface ShapefileSet {
  shp: ArrayBuffer;
  dbf: ArrayBuffer;
  shx?: ArrayBuffer;
  prj?: ArrayBuffer;
}

export class TigerDataService {
  private static readonly MILES_TO_METERS = 1609.34;
  private static readonly SEARCH_RADIUS_MILES = 50;

  private static readonly BUILDING_CODES = {
    'R1': 'single_family',
    'R2': 'multi_family',
    'C1': 'commercial',
    'I1': 'industrial'
  };

  static async loadTigerData(file: FileWithPath): Promise<void> {
    try {
      const buildings: BuildingData[] = [];
      
      // Create a FileReader to handle the uploaded file
      const reader = new FileReader();
      const fileBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });

      // Read shapefile from buffer
      const source = await shapefile.open(fileBuffer);
      let result = await source.read();

      while (!result.done) {
        const feature = result.value;
        const mtfcc = feature.properties.MTFCC;

        if (this.BUILDING_CODES[mtfcc]) {
          buildings.push({
            type: this.BUILDING_CODES[mtfcc],
            geometry: feature.geometry,
            properties: feature.properties
          });
        }

        result = await source.read();
      }

      // Batch insert into Supabase
      const BATCH_SIZE = 1000;
      for (let i = 0; i < buildings.length; i += BATCH_SIZE) {
        const batch = buildings.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
          .from('tiger_buildings')
          .insert(batch);

        if (error) throw error;
      }

      console.log(`Loaded ${buildings.length} buildings into database`);

    } catch (error) {
      console.error('Error loading TIGER data:', error);
      throw error;
    }
  }

  static async loadTigerDataFromZip(zipFile: File): Promise<void> {
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipFile);
      const shapefileSets: Map<string, ShapefileSet> = new Map();

      // Group related files by base name (without extension)
      for (const [path, file] of Object.entries(zipContent.files)) {
        if (file.dir) continue;

        const fileName = path.split('/').pop()!;
        const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        if (!shapefileSets.has(baseName)) {
          shapefileSets.set(baseName, {} as ShapefileSet);
        }

        const buffer = await file.async('arraybuffer');
        const currentSet = shapefileSets.get(baseName)!;

        switch (extension) {
          case 'shp':
            currentSet.shp = buffer;
            break;
          case 'dbf':
            currentSet.dbf = buffer;
            break;
          case 'shx':
            currentSet.shx = buffer;
            break;
          case 'prj':
            currentSet.prj = buffer;
            break;
        }
      }

      // Process each complete shapefile set
      for (const [baseName, files] of shapefileSets.entries()) {
        if (files.shp && files.dbf) {
          await this.processShapefile(files);
        }
      }

    } catch (error) {
      console.error('Error processing ZIP file:', error);
      throw error;
    }
  }

  private static async processShapefile(files: ShapefileSet): Promise<void> {
    const buildings: BuildingData[] = [];
    
    // Read shapefile from buffers
    const source = await shapefile.open(files.shp, files.dbf);
    let result = await source.read();

    while (!result.done) {
      const feature = result.value;
      const mtfcc = feature.properties.MTFCC;

      if (this.BUILDING_CODES[mtfcc]) {
        buildings.push({
          type: this.BUILDING_CODES[mtfcc],
          geometry: feature.geometry,
          properties: feature.properties
        });
      }

      result = await source.read();
    }

    // Batch insert into Supabase
    const BATCH_SIZE = 1000;
    for (let i = 0; i < buildings.length; i += BATCH_SIZE) {
      const batch = buildings.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('tiger_buildings')
        .insert(batch);

      if (error) throw error;
    }

    console.log(`Loaded ${buildings.length} buildings from shapefile`);
  }

  static async getBuildingCounts(lat: number, lon: number): Promise<{
    singleFamily: number;
    multiFamily: number;
    commercial: number;
    industrial: number;
  }> {
    try {
      // Create a point and buffer for the search radius
      const searchPoint = point([lon, lat]);
      const searchArea = buffer(searchPoint, this.SEARCH_RADIUS_MILES * this.MILES_TO_METERS);

      // Query buildings within the search area
      const { data: buildings, error } = await supabase
        .rpc('get_buildings_in_radius', {
          search_lat: lat,
          search_lon: lon,
          radius_miles: this.SEARCH_RADIUS_MILES
        });

      if (error) throw error;

      // Count buildings by type
      const counts = {
        singleFamily: 0,
        multiFamily: 0,
        commercial: 0,
        industrial: 0
      };

      buildings.forEach(building => {
        if (booleanPointInPolygon(point([building.lon, building.lat]), searchArea)) {
          switch (building.type) {
            case 'single_family':
              counts.singleFamily++;
              break;
            case 'multi_family':
              counts.multiFamily++;
              break;
            case 'commercial':
              counts.commercial++;
              break;
            case 'industrial':
              counts.industrial++;
              break;
          }
        }
      });

      return counts;

    } catch (error) {
      console.error('Error getting building counts:', error);
      throw error;
    }
  }
} 