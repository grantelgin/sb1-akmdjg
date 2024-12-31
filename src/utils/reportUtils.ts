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
 * Fetches contractors from Outscraper based on damage type and location with expanding radius
 */
async function getContractorsForDamage(damageType: string, location: string): Promise<any[]> {
  try {
    console.log(`[Outscraper] Starting contractor search for ${damageType} damage near ${location}`);
    const outscraperApiKey = import.meta.env.VITE_OUTSCRAPER_API_KEY;
    
    if (!outscraperApiKey) {
      console.error('[Outscraper] API key is missing');
      throw new Error('Outscraper API key is not defined');
    }

    // Try different search radiuses until we find enough contractors
    for (const radius of SEARCH_RADIUS_INCREMENTS) {
      console.log(`[Outscraper] Trying ${radius} mile radius for ${damageType}`);
      const searchQuery = `${DAMAGE_TO_SEARCH_QUERY[damageType]} near ${location} within ${radius} miles`;
      console.log(`[Outscraper] Search query: ${searchQuery}`);
      
      try {
        const response = await fetch('https://api.outscraper.com/maps/search', {
          method: 'POST',
          headers: {
            'X-API-KEY': outscraperApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({
            query: searchQuery,
            limit: 20,
            language: 'en',
            region: 'us'
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Outscraper] API request failed for ${damageType} at ${radius} miles:`, response.status, errorText);
          throw new Error(`Failed to fetch contractors: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const contractors = data.data || [];
        console.log(`[Outscraper] Found ${contractors.length} contractors for ${damageType} at ${radius} miles`);

        // If we found contractors, add the search radius info and return
        if (contractors.length > 0) {
          const enrichedContractors = contractors.map((contractor: any) => {
            console.log(`[Outscraper] Processing contractor: ${contractor.name || 'Unknown'}`);
            return {
              ...contractor,
              searchRadius: radius,
              validationStatus: 'pending',
              rrn_member: false
            };
          });
          console.log(`[Outscraper] Successfully processed ${enrichedContractors.length} contractors for ${damageType}`);
          return enrichedContractors;
        }

        console.log(`[Outscraper] No contractors found at ${radius} miles, expanding search radius`);
      } catch (fetchError) {
        console.error(`[Outscraper] Network error at ${radius} miles:`, fetchError);
        // Continue to next radius instead of failing completely
        continue;
      }

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.warn(`[Outscraper] No contractors found for ${damageType} at any radius`);
    return [];
  } catch (error) {
    console.error(`[Outscraper] Error in contractor search for ${damageType}:`, error);
    return [];
  }
}

/**
 * Stores potential contractors in a separate table for internal processing
 */
async function storePotentialContractors(reportId: string, contractors: any): Promise<void> {
  try {
    console.log(`[Database] Starting to store contractors for report ${reportId}`);
    const timestamp = new Date().toISOString();
    
    // Store each contractor type separately
    for (const [damageType, contractorList] of Object.entries(contractors)) {
      console.log(`[Database] Processing ${(contractorList as any[]).length} contractors for ${damageType}`);
      
      const { error } = await supabase
        .from('potential_contractors')
        .insert(
          (contractorList as any[]).map(contractor => ({
            report_id: reportId,
            damage_type: damageType,
            contractor_data: contractor,
            search_radius: contractor.searchRadius,
            validation_status: contractor.validationStatus,
            rrn_member: contractor.rrn_member,
            created_at: timestamp
          }))
        );

      if (error) {
        console.error(`[Database] Error storing contractors for ${damageType}:`, error);
      } else {
        console.log(`[Database] Successfully stored contractors for ${damageType}`);
      }
    }
    console.log(`[Database] Completed storing all contractors for report ${reportId}`);
  } catch (error) {
    console.error('[Database] Error in storePotentialContractors:', error);
  }
}

/**
 * Sends contractor lookup results to GoHighLevel webhook
 */
async function sendContractorLookupToGoHighLevel(reportId: string, contractors: any): Promise<void> {
  try {
    console.log(`[GoHighLevel] Preparing to send contractor results for report ${reportId}`);
    const webhookUrl = 'https://services.leadconnectorhq.com/hooks/X3u5q9jmtuHC9kxev65r/webhook-trigger/999ff891-fde9-4d55-ade1-09be0c8b94b8';
    
    // Format the data for each damage type
    const contractorsByDamageType = Object.entries(contractors).map(([damageType, contractorList]) => {
      console.log(`[GoHighLevel] Processing ${(contractorList as any[]).length} contractors for ${damageType}`);
      return {
        damageType,
        contractors: (contractorList as any[]).map(contractor => ({
          businessName: contractor.name,
          phone: contractor.phone,
          address: contractor.address,
          website: contractor.website,
          rating: contractor.rating,
          reviewCount: contractor.reviewCount,
          searchRadius: contractor.searchRadius
        }))
      };
    });

    const webhookData = {
      reportId,
      contractorLookupResults: contractorsByDamageType,
      timestamp: new Date().toISOString()
    };

    console.log(`[GoHighLevel] Sending webhook data for report ${reportId}:`, JSON.stringify(webhookData, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      console.error(`[GoHighLevel] Webhook call failed with status ${response.status}:`, await response.text());
      throw new Error('Failed to send contractor lookup results to GoHighLevel');
    }
    console.log(`[GoHighLevel] Successfully sent contractor results for report ${reportId}`);
  } catch (error) {
    console.error('[GoHighLevel] Error sending contractor lookup results:', error);
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

    // Only fetch contractors for damaged components
    const contractorPromises = damagedComponents.map(async (component) => {
      console.log(`[Contractor Search] Looking up contractors for damaged component: ${component}`);
      const contractors = await getContractorsForDamage(component, reportData.address);
      return { [component]: contractors };
    });

    const contractorResults = await Promise.all(contractorPromises);
    const potentialContractors = Object.assign({}, ...contractorResults);

    // Store potential contractors in separate table
    await storePotentialContractors(reportId, potentialContractors);

    // Send contractor lookup results to GoHighLevel
    await sendContractorLookupToGoHighLevel(reportId, potentialContractors);

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

    // Store report data in Supabase database (removed recommended_contractors from here)
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
        image_urls: imageUrls,
        receipt_urls: receiptUrls,
        storm_reports: formattedStormReports,
        created_at: timestamp,
        owner_id: user?.id || null
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
