import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as shapefile from 'npm:shapefile'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle building counts request
    if (url.pathname.endsWith('/building-counts')) {
      const params = url.searchParams
      const lat = parseFloat(params.get('lat') ?? '0')
      const lon = parseFloat(params.get('lon') ?? '0')
      const radiusMiles = parseFloat(params.get('radius') ?? '50')

      const { data: buildings, error } = await supabaseClient
        .rpc('get_buildings_in_radius', {
          search_lat: lat,
          search_lon: lon,
          radius_miles: radiusMiles
        })

      if (error) throw error

      // Count buildings by type
      const counts = {
        singleFamily: 0,
        multiFamily: 0,
        commercial: 0,
        industrial: 0
      }

      buildings.forEach((building: { type: string }) => {
        switch (building.type) {
          case 'single_family':
            counts.singleFamily++
            break
          case 'multi_family':
            counts.multiFamily++
            break
          case 'commercial':
            counts.commercial++
            break
          case 'industrial':
            counts.industrial++
            break
        }
      })

      return new Response(
        JSON.stringify({ success: true, counts }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle file upload
    const buffer = await req.arrayBuffer()
    const source = await shapefile.open(buffer)
    let result = await source.read()
    const buildings = []

    while (!result.done) {
      const feature = result.value
      const mtfcc = feature.properties.MTFCC

      // Map MTFCC codes to building types
      const buildingType = getBuildingType(mtfcc)
      if (buildingType) {
        buildings.push({
          type: buildingType,
          geometry: feature.geometry,
          properties: feature.properties
        })
      }

      result = await source.read()
    }

    // Insert buildings in batches
    const BATCH_SIZE = 1000
    for (let i = 0; i < buildings.length; i += BATCH_SIZE) {
      const batch = buildings.slice(i, i + BATCH_SIZE)
      const { error } = await supabaseClient
        .from('tiger_buildings')
        .insert(batch)

      if (error) throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${buildings.length} buildings`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function getBuildingType(mtfcc: string): string | null {
  const BUILDING_CODES: Record<string, string> = {
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
  }

  return BUILDING_CODES[mtfcc] || null
} 