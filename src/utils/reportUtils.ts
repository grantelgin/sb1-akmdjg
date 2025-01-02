import { supabase } from './supabase';
import { FormData } from '../components/Questionnaire/types';
import { StormReportService } from '../services/StormReportService';
import { WeatherService } from '../services/WeatherService';

// Define contractor search queries for each damage type
const DAMAGE_TO_SEARCH_QUERY: { [key: string]: string } = {
  roof: "roofing contractors",
  siding: "siding contractors",
  windows: "window replacement contractors",
  gutters: "gutter installation contractors",
  fence: "fence repair contractors",
  deck: "deck repair contractors",
  garage: "garage door repair",
  trees: "tree removal service",
  other: "general contractors"
};

// Search radius increments in miles
const SEARCH_RADIUS_INCREMENTS = [10, 25, 50, 100, 150, 200];

// Add these type definitions at the top of the file with other imports
type DamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';

interface DamageAssessment {
  hasDamage: boolean;
  severity: DamageSeverity;
}

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
 * Calls the GoHighLevel webhook with user information
 */
async function callGoHighLevelWebhook(reportData: any): Promise<void> {
  try {
    const webhookUrl = 'https://services.leadconnectorhq.com/hooks/X3u5q9jmtuHC9kxev65r/webhook-trigger/ffa3f220-2c01-41c4-9fa2-50c0ce2a51d9';
    const webhookData = {
      reportId: reportData.reportId,
      firstName: reportData.firstName,
      lastName: reportData.lastName,
      email: reportData.email,
      phone: reportData.phoneNumber,
      smsConsent: reportData.smsConsent,
      contactConsent: reportData.contactConsent,
      address: reportData.address
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error('Failed to call GoHighLevel webhook');
    }
  } catch (error) {
    console.error('Error calling GoHighLevel webhook:', error);
    // Don't throw the error - we don't want to fail the report submission if the webhook fails
  }
}

/**
 * Fetches contractors from Outscraper based on damage type and location
 */
async function initiateContractorSearch(damageType: string, location: string, reportId: string): Promise<void> {
  try {
    console.log(`[Contractor Search] Initiating search for ${damageType} damage near ${location}`);
    
    // Construct the search query with initial radius
    const radius = SEARCH_RADIUS_INCREMENTS[0];
    const searchQuery = `${DAMAGE_TO_SEARCH_QUERY[damageType]} near ${location} within ${radius} miles`;
    
    // Construct webhook URL using Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const webhookUrl = `${supabaseUrl}/functions/v1/outscraper-webhook`;
    
    // Encode parameters
    const encodedQuery = encodeURIComponent(searchQuery);
    const encodedWebhook = encodeURIComponent(webhookUrl);
    
    // Construct Outscraper API URL with webhook
    const outscraperUrl = `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}&webhook=${encodedWebhook}&async=true`;
    
    console.log('[Contractor Search] Making request to Outscraper:', outscraperUrl);
    
    const response = await fetch(outscraperUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': import.meta.env.VITE_OUTSCRAPER_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Contractor Search] API request failed:`, response.status, errorText);
      throw new Error(`Failed to initiate contractor search: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Contractor Search] Successfully initiated search ${data.id} for ${damageType}`);
    
    // Update the search status to indicate search is in progress
    const { error: updateError } = await supabase
      .from('damage_reports')
      .update({
        [`contractor_search_status.${damageType}`]: {
          status: 'searching',
          timestamp: new Date().toISOString(),
          search_id: data.id,
          search_radius: radius
        }
      })
      .eq('report_id', reportId);

    if (updateError) {
      console.error(`[Contractor Search] Error updating search status:`, updateError);
    }

  } catch (error: any) {
    console.error(`[Contractor Search] Error initiating search for ${damageType}:`, error);
    
    // Update the search status to indicate failure
    const { error: updateError } = await supabase
      .from('damage_reports')
      .update({
        [`contractor_search_status.${damageType}`]: {
          status: 'failed',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      })
      .eq('report_id', reportId);

    if (updateError) {
      console.error(`[Contractor Search] Error updating failure status:`, updateError);
    }
  }
}

/**
 * Stores report data in Supabase database
 */
export async function storeReportData(reportData: any): Promise<void> {
  try {
    const reportId = reportData.reportId;
    const timestamp = new Date().toISOString();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Call initial GoHighLevel webhook for user data
    await callGoHighLevelWebhook(reportData);

    // Filter for components that actually have damage
    console.log('[Contractor Search] Raw damage assessment:', JSON.stringify(reportData.damageAssessment, null, 2));
    
    const damagedComponents = Object.entries(reportData.damageAssessment)
      .filter(([component, assessment]) => {
        console.log(`[Contractor Search] Checking damage for ${component}:`, assessment);
        
        // Handle both object format and direct severity string
        if (typeof assessment === 'string') {
          return ['minor', 'moderate', 'severe'].includes(assessment);
        }
        
        if (assessment && typeof assessment === 'object') {
          // Handle both possible formats of the assessment object
          if ('severity' in assessment) {
            const severity = (assessment as { severity: string }).severity;
            return ['minor', 'moderate', 'severe'].includes(severity);
          }
          if ('hasDamage' in assessment) {
            return (assessment as { hasDamage: boolean }).hasDamage === true;
          }
        }
        
        return false;
      })
      .map(([component]) => component);

    console.log(`[Contractor Search] Found damaged components:`, damagedComponents);

    // Initialize contractor search status
    const contractorSearchStatus = damagedComponents.reduce((acc, component) => {
      acc[component] = { status: 'pending', timestamp };
      return acc;
    }, {} as Record<string, { status: string; timestamp: string }>);

    // Store report data in Supabase database first
    const { error } = await supabase
      .from('damage_reports')
      .insert({
        report_id: reportId,
        property_type: reportData.propertyType,
        first_name: reportData.firstName,
        last_name: reportData.lastName,
        email: reportData.email,
        phone_number: reportData.phoneNumber,
        sms_consent: reportData.smsConsent,
        address: reportData.address,
        damage_date: reportData.damageDate,
        damage_assessment: reportData.damageAssessment,
        insurance_claim: reportData.insuranceClaim,
        contact_consent: reportData.contactConsent,
        image_urls: [],  // Will update these after contractor search is initiated
        receipt_urls: [],
        storm_reports: reportData.stormReports,
        contractor_search_status: contractorSearchStatus,
        created_at: timestamp,
        owner_id: user?.id || null
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // Initiate contractor searches in parallel
    await Promise.all(
      damagedComponents.map(component => 
        initiateContractorSearch(component, reportData.address, reportId)
      )
    );

    // Now handle file uploads
    const imageUrls = await Promise.all(
      reportData.images.map(async (image: File) => {
        const fileName = `${reportId}/images/${image.name}`;
        const { data, error } = await supabase.storage
          .from('damage-reports')
          .upload(fileName, image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('damage-reports')
          .getPublicUrl(fileName);
          
        return publicUrl;
      })
    );

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

    // Update the report with file URLs
    const { error: updateError } = await supabase
      .from('damage_reports')
      .update({
        image_urls: imageUrls,
        receipt_urls: receiptUrls
      })
      .eq('report_id', reportId);

    if (updateError) {
      console.error('Error updating report with file URLs:', updateError);
      throw updateError;
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
export async function getReportData(reportId: string) {
  const report = await fetchReport(reportId);
  
  // Fetch storm reports and weather data in parallel
  const [stormReports, weatherHistory] = await Promise.all([
    StormReportService.getStormReports(
      report.damageDate,
      report.coordinates.lat,
      report.coordinates.lon
    ),
    WeatherService.getWeatherHistory(
      report.coordinates.lat,
      report.coordinates.lon,
      report.damageDate
    )
  ]);

  return {
    ...report,
    stormReports,
    weatherHistory
  };
}

async function fetchReport(reportId: string) {
  try {
    // Fetch report data from Supabase
    const { data: report, error } = await supabase
      .from('damage_reports')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (error) throw error;
    if (!report) throw new Error('Report not found');

    // Transform the database record into the expected ReportData format
    return {
      reportId: report.report_id,
      propertyType: report.property_type,
      firstName: report.first_name,
      lastName: report.last_name,
      email: report.email,
      phoneNumber: report.phone_number,
      smsConsent: report.sms_consent,
      address: report.address,
      damageDate: report.damage_date,
      damageAssessment: report.damage_assessment,
      insuranceClaim: report.insurance_claim,
      contactConsent: report.contact_consent,
      images: report.image_urls || [],
      receipts: report.receipt_urls || [],
      coordinates: await getCoordinatesFromAddress(report.address)
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}
