import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const SEARCH_RADIUS_INCREMENTS = [10, 25, 50, 100, 150, 200];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Method ${req.method} not allowed. Only POST requests are accepted.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    );
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
    console.log('Webhook URL:', webhookUrl);
    
    // Start with smallest radius
    const radius = SEARCH_RADIUS_INCREMENTS[0];
    const searchQuery = `${damageType} contractors near ${location} within ${radius} miles`;
    console.log('Search query:', searchQuery);
    
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
    const encodedQuery = encodeURIComponent(searchQuery);
    const encodedWebhook = encodeURIComponent(webhookUrl);
    const searchUrl = `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}&webhook=${encodedWebhook}`;

    console.log('Making API request to:', searchUrl);

    try {
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'X-API-KEY': outscraperApiKey,
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response:', JSON.stringify(data, null, 2));

      // Update the search status with Outscraper request details
      currentStatus[damageType] = {
        status: 'searching',
        timestamp: new Date().toISOString(),
        outscraper_request_id: data.id,
        results_location: data.results_location
      };

      const { error: finalUpdateError } = await supabaseClient
        .from('damage_reports')
        .update({ contractor_search_status: currentStatus })
        .eq('report_id', reportId);

      if (finalUpdateError) {
        throw finalUpdateError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contractor search initiated',
          searchId: data.id,
          resultsLocation: data.results_location
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

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