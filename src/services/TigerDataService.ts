import { supabase } from '../utils/supabase';
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
            // Call the Edge Function
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-tiger-data/building-counts?` +
                new URLSearchParams({
                    lat: lat.toString(),
                    lon: lon.toString(),
                    radius: this.SEARCH_RADIUS_MILES.toString()
                }),
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    }
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error getting building counts');
            }

            const { counts } = await response.json();
            return counts;
        } catch (error) {
            console.error('Error getting building counts:', error);
            throw error;
        }
    }
} 