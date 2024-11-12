import { supabase } from './supabase';
import { FormData } from '../components/Questionnaire/types';

/**
 * Generates a unique report ID using timestamp and random string
 */
export function generateReportId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `RPT-${timestamp}-${randomStr}`;
}

/**
 * Gets coordinates from an address using Mapbox Geocoding API
 */
export async function getCoordinatesFromAddress(address: string): Promise<{ lat: number; lon: number }> {
  try {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is not defined');
    }

    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&limit=1`
    );
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error('Address not found');
    }

    const [lon, lat] = data.features[0].center;
    return { lat, lon };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

/**
 * Stores report data in Supabase database
 * In a production environment, this would likely store to a database instead
 */
export async function storeReportData(reportData: any): Promise<void> {
  try {
    const reportId = reportData.reportId;
    const timestamp = new Date().toISOString();

    // Ensure storm reports are properly formatted for JSON storage
    const formattedStormReports = reportData.stormReports.map((report: any) => ({
      type: report.type,
      date: report.date,
      lat: report.lat,
      lon: report.lon,
      distance: report.distance,
      description: report.description
    }));

    // Upload images to Supabase Storage
    const imageUrls = await Promise.all(
      reportData.images.map(async (image: File) => {
        const fileName = `${reportId}/images/${image.name}`;
        const { data, error } = await supabase.storage
          .from('damage-reports')
          .upload(fileName, image);
        
        if (error) throw error;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('damage-reports')
          .getPublicUrl(fileName);
          
        return publicUrl;
      })
    );

    // Upload receipts to Supabase Storage
    const receiptUrls = await Promise.all(
      reportData.receipts.map(async (receipt: File) => {
        const fileName = `${reportId}/receipts/${receipt.name}`;
        const { data, error } = await supabase.storage
          .from('damage-reports')
          .upload(fileName, receipt);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('damage-reports')
          .getPublicUrl(fileName);
          
        return publicUrl;
      })
    );

    // Store report data in Supabase database
    const { error } = await supabase
      .from('damage_reports')
      .insert({
        report_id: reportId,
        property_type: reportData.propertyType,
        first_name: reportData.firstName,
        last_name: reportData.lastName,
        email: reportData.email,
        address: reportData.address,
        damage_date: reportData.damageDate,
        damage_assessment: reportData.damageAssessment,
        insurance_claim: reportData.insuranceClaim,
        contact_consent: reportData.contactConsent,
        image_urls: imageUrls,
        receipt_urls: receiptUrls,
        storm_reports: formattedStormReports,
        created_at: timestamp
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error storing report data:', error);
    throw error;
  }
}

/**
 * Retrieves report data from Supabase database
 * Helper function to get report data
 */
export async function getReportData(reportId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('damage_reports')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Report not found');

    console.log('Raw data from Supabase:', data);
    console.log('Storm reports:', data.storm_reports);

    return {
      reportId: data.report_id,
      propertyType: data.property_type,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      address: data.address,
      damageDate: data.damage_date,
      damageAssessment: data.damage_assessment,
      insuranceClaim: data.insurance_claim,
      contactConsent: data.contact_consent,
      images: data.image_urls,
      receipts: data.receipt_urls,
      stormReports: data.storm_reports || [],
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error retrieving report data:', error);
    throw error;
  }
}
