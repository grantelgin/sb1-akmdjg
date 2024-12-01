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
    'C3023': 'commercial',    // School or Academy
    'C3024': 'commercial',    // College or University
    'C3026': 'commercial',    // Library
    'C3027': 'commercial',    // Hospital
    'C3033': 'commercial',    // Shopping Center or Mall
    'C3034': 'commercial',    // Golf Course
    'C3036': 'commercial',    // Hotel, Motel, Resort
    'C3043': 'commercial',    // Stadium or Arena
    'C3052': 'industrial',    // Industrial Building or Factory
    'C3061': 'commercial',    // Church, Synagogue, Temple, Mosque
    'C3063': 'commercial',    // Post Office
    'K1237': 'single_family', // Residential Building
    'K1251': 'multi_family',  // Apartment Complex
    'K2183': 'industrial'     // Power Plant
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
    let totalFeatures = 0;
    let skippedFeatures = 0;
    let invalidFeatures = 0;
    const foundMtfccCodes = new Set<string>();
    
    try {
      const source = await shapefile.open(files.shp, files.dbf);
      let result = await source.read();

      while (!result.done) {
        totalFeatures++;
        const feature = result.value;

        if (!feature || !feature.properties) {
          invalidFeatures++;
          console.warn('Invalid feature found:', feature);
          result = await source.read();
          continue;
        }

        const mtfcc = feature.properties.MTFCC;
        foundMtfccCodes.add(mtfcc);

        if (this.BUILDING_CODES[mtfcc]) {
          try {
            buildings.push({
              type: this.BUILDING_CODES[mtfcc],
              geometry: feature.geometry,
              properties: feature.properties
            });
          } catch (err) {
            console.error('Error processing valid MTFCC feature:', err);
            invalidFeatures++;
          }
        } else {
          skippedFeatures++;
        }

        result = await source.read();
      }

      if (buildings.length === 0) {
        console.warn('Processing summary:', {
          totalFeatures,
          skippedFeatures,
          invalidFeatures,
          validBuildings: buildings.length,
          foundMtfccCodes: Array.from(foundMtfccCodes),
          expectedMtfccCodes: Object.keys(this.BUILDING_CODES)
        });
        throw new Error(`No valid buildings found in shapefile. 
          Processed ${totalFeatures} features, 
          Skipped ${skippedFeatures} features, 
          Found ${invalidFeatures} invalid features.
          Found MTFCC codes: ${Array.from(foundMtfccCodes).join(', ')}
          Expected MTFCC codes: ${Object.keys(this.BUILDING_CODES).join(', ')}`);
      }

      // Batch insert into Supabase
      const BATCH_SIZE = 1000;
      for (let i = 0; i < buildings.length; i += BATCH_SIZE) {
        const batch = buildings.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
          .from('tiger_buildings')
          .insert(batch);

        if (error) {
          console.error('Supabase insertion error:', error);
          throw error;
        }
      }

      console.log('Shapefile processing summary:', {
        totalFeatures,
        skippedFeatures,
        invalidFeatures,
        validBuildings: buildings.length,
        mtfccTypes: Object.fromEntries(
          Object.entries(
            buildings.reduce((acc, b) => {
              acc[b.type] = (acc[b.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
        )
      });

    } catch (error) {
      console.error('Error processing shapefile:', error);
      throw error;
    }
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