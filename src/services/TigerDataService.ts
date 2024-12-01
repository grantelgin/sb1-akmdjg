import { supabase } from '../utils/supabase';
import * as shapefile from 'shapefile';
import { point, buffer, booleanPointInPolygon } from '@turf/turf';
import { FileWithPath } from 'react-dropzone';
import JSZip from 'jszip';

interface BuildingData {
    type: 'single_family' | 'multi_family' | 'commercial' | 'industrial' | 'other';
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
        // Residential
        'K1200': 'single_family',  // General residential
        'K1237': 'single_family', // Single-family residential
        'K1250': 'multi_family',  // General multi-unit
        'K1251': 'multi_family',  // Apartment building/complex
        'K1252': 'multi_family',  // Rowhomes
        'K1253': 'multi_family',  // Mobile home park

        // Commercial
        'K2100': 'commercial',    // General commercial
        'K2110': 'commercial',    // Shopping center
        'K2167': 'commercial',    // Hotel/motel
        'K2190': 'commercial',    // General retail

        // Industrial
        'K2180': 'industrial',    // General industrial
        'K2181': 'industrial',    // Factory
        'K2182': 'industrial',    // Warehouse
        'K2183': 'industrial',    // Tank farm
        'K2184': 'industrial',    // Processing plant

        // Additional Commercial/Institutional
        'C3020': 'commercial',    // Educational institution
        'C3023': 'commercial',    // School
        'C3024': 'commercial',    // University
        'C3026': 'commercial',    // Library
        'C3027': 'commercial',    // Hospital
        'C3030': 'commercial',    // Retail
        'C3033': 'commercial',    // Shopping center
        'C3034': 'commercial',    // Golf course
        'C3036': 'commercial',    // Hotel
        'C3043': 'commercial',    // Stadium
        'C3052': 'industrial',    // Industrial building
        'C3061': 'commercial',    // Religious building
        'C3063': 'commercial'     // Post office
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

                if (!this.BUILDING_CODES[mtfcc] && !this.debuggedCodes?.has(mtfcc)) {
                    console.log(`Unhandled MTFCC code: ${mtfcc}, properties:`, feature.properties);
                    this.debuggedCodes = this.debuggedCodes || new Set();
                    this.debuggedCodes.add(mtfcc);
                }

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

            // Constants for retry logic
            const MAX_RETRIES = 3;
            const BATCH_SIZE = 500;
            const INITIAL_TIMEOUT = 30000; // 30 seconds

            async function insertBatchWithRetry(
                batch: BuildingData[],
                retryCount = 0
            ): Promise<void> {
                try {
                    // Create a promise that rejects after timeout
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => {
                            reject(new Error('timeout'));
                        }, INITIAL_TIMEOUT * Math.pow(2, retryCount));
                    });

                    // Create the database operation promise
                    const dbPromise = supabase
                        .rpc('upsert_buildings', { 
                            buildings: batch 
                        });

                    // Race between timeout and db operation
                    const { error } = await Promise.race([dbPromise, timeoutPromise]);
                    if (error) throw error;

                } catch (error) {
                    if (retryCount < MAX_RETRIES) {
                        const delay = Math.pow(2, retryCount) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        
                        if (batch.length > 1) {
                            const mid = Math.floor(batch.length / 2);
                            const batch1 = batch.slice(0, mid);
                            const batch2 = batch.slice(mid);
                            
                            await insertBatchWithRetry(batch1, retryCount + 1);
                            await insertBatchWithRetry(batch2, retryCount + 1);
                        } else {
                            await insertBatchWithRetry(batch, retryCount + 1);
                        }
                    } else {
                        throw new Error(`Failed to insert batch after ${MAX_RETRIES} retries: ${error}`);
                    }
                }
            }

            // Process batches with some concurrency but not too much
            const CONCURRENT_BATCHES = 3;
            for (let i = 0; i < buildings.length; i += CONCURRENT_BATCHES) {
                const batchPromises = buildings
                    .slice(i, i + CONCURRENT_BATCHES)
                    .map(building => insertBatchWithRetry([building]));

                await Promise.all(batchPromises).catch(error => {
                    console.error('Batch processing error:', error);
                    throw error;
                });

                // Log progress
                const processedCount = Math.min((i + CONCURRENT_BATCHES) * BATCH_SIZE, buildings.length);
                console.log(`Processed ${processedCount}/${buildings.length} buildings`);
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
                        default:
                            counts.other++;
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