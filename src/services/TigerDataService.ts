import { supabase } from '../utils/supabase';
import { point, buffer, booleanPointInPolygon } from '@turf/turf';
import { FileWithPath } from 'react-dropzone';

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

export class TigerDataService {
    private static readonly MILES_TO_METERS = 1609.34;
    private static readonly SEARCH_RADIUS_MILES = 50;

    static async loadTigerData(file: FileWithPath): Promise<void> {
        try {
            // Convert file to ArrayBuffer
            const buffer = await file.arrayBuffer();

            // Call the Edge Function
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-tiger-data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/octet-stream'
                },
                body: buffer
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error uploading TIGER data');
            }

            const result = await response.json();
            console.log('Upload result:', result);

        } catch (error) {
            console.error('Error loading TIGER data:', error);
            throw error;
        }
    }

    static async loadTigerDataFromZip(zipFile: File): Promise<void> {
        try {
            // Convert file to ArrayBuffer
            const buffer = await zipFile.arrayBuffer();

            // Call the Edge Function
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-tiger-data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/zip'
                },
                body: buffer
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error uploading TIGER data');
            }

            const result = await response.json();
            console.log('Upload result:', result);

        } catch (error) {
            console.error('Error processing ZIP file:', error);
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