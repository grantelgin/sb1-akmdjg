import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const SEARCH_RADIUS_INCREMENTS = [10, 25, 50, 100, 150, 200];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { damageType, location, reportId } = await req.json();
    const outscraperApiKey = Deno.env.get('OUTSCRAPER_API_KEY');
    const baseUrl = Deno.env.get('SUPABASE_URL');

    if (!outscraperApiKey || !baseUrl) {
      throw new Error('Required environment variables are not configured');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      baseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Starting contractor search for ${damageType} near ${location}`);

    // Construct webhook URL for this search
    const webhookUrl = `${baseUrl}/functions/v1/outscraper-webhook`;
    
    // Start with smallest radius
    const radius = SEARCH_RADIUS_INCREMENTS[0];
    const searchQuery = `${damageType} contractors near ${location} within ${radius} miles`;
    
    // Initialize or update the search status in damage_reports
    const { data: report, error: reportError } = await supabaseClient
      .from('damage_reports')
      .select('contractor_search_status')
      .eq('report_id', reportId)
      .single();

    if (reportError) {
      throw reportError;
    }

    const currentStatus = report?.contractor_search_status || {};
    currentStatus[damageType] = {
      status: 'searching',
      timestamp: new Date().toISOString()
    };

    const { error: updateError } = await supabaseClient
      .from('damage_reports')
      .update({ contractor_search_status: currentStatus })
      .eq('report_id', reportId);

    if (updateError) {
      throw updateError;
    }

    // Start the Outscraper search with webhook
    const response = await fetch('https://api.outscraper.com/maps/search-async', {
      method: 'POST',
      headers: {
        'X-API-KEY': outscraperApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        language: 'en',
        region: 'us',
        webhook_url: webhookUrl,
        webhook_data: {
          reportId,
          damageType
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${errorText}`);
      throw new Error(`Failed to start contractor search: ${errorText}`);
    }

    const { search_id } = await response.json();
    console.log(`Initiated Outscraper search ${search_id} for ${damageType}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contractor search initiated',
        searchId: search_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 