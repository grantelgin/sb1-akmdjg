import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const CRON_KEY = Deno.env.get('CRON_KEY');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify request is from our CRON job
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${CRON_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch active storms from NHC
    const nhcResponse = await fetch('https://www.nhc.noaa.gov/CurrentStorms.json');
    const nhcData = await nhcResponse.json();
    const activeStorms = nhcData?.activeStorms || [];

    for (const storm of activeStorms) {
      try {
        // Get detailed advisory data
        const advisoryUrl = `https://www.nhc.noaa.gov/text/MIATCP${storm.id}.${storm.advisoryNumber}.txt`;
        const advisoryResponse = await fetch(advisoryUrl);
        const advisoryText = await advisoryResponse.text();

        // Parse advisory data
        const locationMatch = advisoryText.match(/LOCATION\.\.\.(\d+\.\d+)N\s+(\d+\.\d+)W/);
        const windMatch = advisoryText.match(/MAXIMUM SUSTAINED WINDS\.\.\.(\d+)\s+MPH/);

        if (!locationMatch || !windMatch) {
          console.log(`Skipping storm ${storm.name} - insufficient data`);
          continue;
        }

        const lat = parseFloat(locationMatch[1]);
        const lon = -parseFloat(locationMatch[2]); // Convert to negative for western hemisphere
        const windSpeedKnots = Math.round(parseInt(windMatch[1]) * 0.868976); // Convert MPH to knots

        // Determine hurricane category
        let category = 0;
        if (windSpeedKnots >= 137) category = 5;
        else if (windSpeedKnots >= 113) category = 4;
        else if (windSpeedKnots >= 96) category = 3;
        else if (windSpeedKnots >= 83) category = 2;
        else if (windSpeedKnots >= 64) category = 1;

        // Check for existing recent record
        const { data: existingData } = await supabaseClient
          .from('hurricanes')
          .select('*')
          .eq('name', storm.name)
          .order('date', { ascending: false })
          .limit(1);

        const lastRecord = existingData?.[0];
        const timeSinceLastUpdate = lastRecord 
          ? Date.now() - new Date(lastRecord.date).getTime()
          : Infinity;
        
        // Update if:
        // 1. No previous record exists
        // 2. More than 6 hours have passed
        // 3. Position has changed significantly
        // 4. Wind speed has changed significantly
        const shouldUpdate = !lastRecord ||
          timeSinceLastUpdate >= 6 * 60 * 60 * 1000 ||
          Math.abs(lastRecord.lat - lat) > 0.1 ||
          Math.abs(lastRecord.lon - lon) > 0.1 ||
          Math.abs(lastRecord.wind_speed - windSpeedKnots) > 5;

        if (shouldUpdate) {
          const { error } = await supabaseClient
            .from('hurricanes')
            .insert([{
              name: storm.name,
              date: new Date().toISOString(),
              lat,
              lon,
              wind_speed: windSpeedKnots,
              category
            }]);

          if (error) throw error;
          console.log(`Updated data for hurricane ${storm.name}`);
        } else {
          console.log(`No significant changes for hurricane ${storm.name}, skipping update`);
        }
      } catch (error) {
        console.error(`Error processing storm ${storm.name}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 