import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reportId, damageType, contractors } = await req.json();
    console.log(`[Outscraper Webhook] Received results for ${damageType} in report ${reportId}`);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the contractors in the database
    const timestamp = new Date().toISOString();
    const enrichedContractors = contractors.map((contractor: any) => ({
      ...contractor,
      validationStatus: 'pending',
      rrn_member: false
    }));

    // Store in potential_contractors table
    const { error: dbError } = await supabaseClient
      .from('potential_contractors')
      .insert(
        enrichedContractors.map((contractor: any) => ({
          report_id: reportId,
          damage_type: damageType,
          contractor_data: contractor,
          search_radius: contractor.searchRadius,
          validation_status: contractor.validationStatus,
          rrn_member: contractor.rrn_member,
          created_at: timestamp
        }))
      );

    if (dbError) {
      throw dbError;
    }

    // Update the contractor_search_status in damage_reports
    const { data: report, error: reportError } = await supabaseClient
      .from('damage_reports')
      .select('contractor_search_status')
      .eq('report_id', reportId)
      .single();

    if (reportError) {
      throw reportError;
    }

    // Update the status for this damage type
    const currentStatus = report.contractor_search_status || {};
    const searchStatus = currentStatus[damageType];

    // If no contractors were found in the webhook data, try fetching from results_location
    if (!contractors || contractors.length === 0) {
      console.log(`[Outscraper Webhook] No contractors in webhook data, checking results location for ${reportId}`);
      
      if (searchStatus?.results_location) {
        try {
          const resultsResponse = await fetch(searchStatus.results_location, {
            headers: {
              'X-API-KEY': Deno.env.get('OUTSCRAPER_API_KEY') ?? '',
              'Accept': 'application/json'
            }
          });

          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json();
            if (resultsData.data && resultsData.data.length > 0) {
              contractors = resultsData.data;
              console.log(`[Outscraper Webhook] Found ${contractors.length} contractors from results location`);
            }
          }
        } catch (error) {
          console.error('[Outscraper Webhook] Error fetching results:', error);
        }
      }
    }

    // Proceed only if we have contractors
    if (!contractors || contractors.length === 0) {
      console.log(`[Outscraper Webhook] No contractors found for ${damageType} in report ${reportId}`);
      currentStatus[damageType] = {
        ...searchStatus,
        status: 'completed',
        count: 0,
        timestamp: new Date().toISOString()
      };
    } else {
      // Store the contractors in the database
      const timestamp = new Date().toISOString();
      const enrichedContractors = contractors.map((contractor: any) => ({
        ...contractor,
        validationStatus: 'pending',
        rrn_member: false
      }));

      // Store in potential_contractors table
      const { error: dbError } = await supabaseClient
        .from('potential_contractors')
        .insert(
          enrichedContractors.map((contractor: any) => ({
            report_id: reportId,
            damage_type: damageType,
            contractor_data: contractor,
            search_radius: contractor.searchRadius,
            validation_status: contractor.validationStatus,
            rrn_member: contractor.rrn_member,
            created_at: timestamp
          }))
        );

      if (dbError) {
        throw dbError;
      }

      // Update the status for this damage type
      currentStatus[damageType] = {
        status: 'completed',
        count: enrichedContractors.length,
        timestamp
      };

      const { error: updateError } = await supabaseClient
        .from('damage_reports')
        .update({ contractor_search_status: currentStatus })
        .eq('report_id', reportId);

      if (updateError) {
        throw updateError;
      }
    }

    // If all damage types are complete, send to GoHighLevel
    const allComplete = Object.values(currentStatus).every(
      (status: any) => status.status === 'completed'
    );

    if (allComplete) {
      // Fetch all contractors for this report
      const { data: allContractors, error: fetchError } = await supabaseClient
        .from('potential_contractors')
        .select('*')
        .eq('report_id', reportId);

      if (fetchError) {
        throw fetchError;
      }

      // Send to GoHighLevel webhook
      const ghlWebhookUrl = 'https://services.leadconnectorhq.com/hooks/X3u5q9jmtuHC9kxev65r/webhook-trigger/999ff891-fde9-4d55-ade1-09be0c8b94b8';
      const contractorsByType = allContractors.reduce((acc: any, curr: any) => {
        if (!acc[curr.damage_type]) {
          acc[curr.damage_type] = [];
        }
        acc[curr.damage_type].push({
          businessName: curr.contractor_data.name,
          phone: curr.contractor_data.phone,
          address: curr.contractor_data.address,
          website: curr.contractor_data.website,
          rating: curr.contractor_data.rating,
          reviewCount: curr.contractor_data.reviewCount,
          searchRadius: curr.search_radius
        });
        return acc;
      }, {});

      const webhookResponse = await fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          contractorLookupResults: Object.entries(contractorsByType).map(([type, contractors]) => ({
            damageType: type,
            contractors
          })),
          timestamp
        })
      });

      if (!webhookResponse.ok) {
        console.error('[Outscraper Webhook] Failed to send results to GoHighLevel');
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Outscraper Webhook] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 