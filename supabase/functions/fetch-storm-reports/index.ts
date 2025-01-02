// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MAPBOX_ACCESS_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface StormReport {
  report_date: string
  county: string
  state: string
  tornado_reports: TornadoReport[]
  hail_reports: HailReport[]
  wind_reports: WindReport[]
  hurricane_reports: any[]
  map_image_url: string
}

interface TornadoReport {
  time: string
  f_scale: string
  location: string
  county: string
  state: string
  lat: number
  lon: number
  comments: string
}

interface HailReport {
  time: string
  size: string
  location: string
  county: string
  state: string
  lat: number
  lon: number
  comments: string
}

interface WindReport {
  time: string
  speed: string
  location: string
  county: string
  state: string
  lat: number
  lon: number
  comments: string
}

async function parseReportCSV(csvText: string) {
  const lines = csvText.split('\n')
  const reports = {
    tornado_reports: [] as TornadoReport[],
    hail_reports: [] as HailReport[],
    wind_reports: [] as WindReport[],
    hurricane_reports: [] as any[],
    affected_counties: new Set<string>(),
    affected_states: new Set<string>()
  }

  let currentSection = ''
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    const [time, value, location, county, state, lat, lon, comments] = line.split(',').map(s => s.trim())
    
    if (line.startsWith('Time,F_Scale')) {
      currentSection = 'tornado'
      continue
    } else if (line.startsWith('Time,Speed')) {
      currentSection = 'wind'
      continue
    } else if (line.startsWith('Time,Size')) {
      currentSection = 'hail'
      continue
    } else if (time === 'Time') {
      continue
    }

    if (county && state) {
      reports.affected_counties.add(`${county},${state}`)
      reports.affected_states.add(state)
    }

    if (currentSection === 'tornado' && time) {
      reports.tornado_reports.push({
        time,
        f_scale: value,
        location,
        county,
        state,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        comments
      })
    } else if (currentSection === 'wind' && time) {
      reports.wind_reports.push({
        time,
        speed: value,
        location,
        county,
        state,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        comments
      })
    } else if (currentSection === 'hail' && time) {
      reports.hail_reports.push({
        time,
        size: value,
        location,
        county,
        state,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        comments
      })
    }
  }

  return reports
}

async function getMapboxImage(county: string, state: string): Promise<string> {
  try {
    // Get coordinates for the county
    const geocodingResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(`${county} County,${state}`)}.json?types=place,district&access_token=${MAPBOX_ACCESS_TOKEN}`
    )
    const geocodingData = await geocodingResponse.json()
    
    if (!geocodingData.features || geocodingData.features.length === 0) {
      console.error(`No geocoding results found for ${county}, ${state}`)
      throw new Error(`Location not found: ${county}, ${state}`)
    }

    // Log the first result for debugging
    console.log(`Geocoding result for ${county}, ${state}:`, geocodingData.features[0])

    const [lng, lat] = geocodingData.features[0].center

    // Generate static map URL with a slightly higher zoom level for counties
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${lng},${lat},7,0/800x400@2x?access_token=${MAPBOX_ACCESS_TOKEN}`
  } catch (error) {
    console.error(`Error generating map for ${county}, ${state}:`, error)
    // Return a default map of the US as fallback
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-98.5795,39.8283,3,0/800x400@2x?access_token=${MAPBOX_ACCESS_TOKEN}`
  }
}

async function downloadFromSPC(date: string): Promise<string> {
  const [year, month, day] = date.split('-').map(Number)
  const fileName = `${year.toString().slice(-2)}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}_rpts.csv`
  const spcUrl = `https://www.spc.noaa.gov/climo/reports/${fileName}`
  
  console.log(`Downloading from SPC: ${spcUrl}`)
  const response = await fetch(spcUrl)
  
  if (!response.ok) {
    throw new Error(`Failed to download from SPC: ${response.status} ${response.statusText}`)
  }
  
  return await response.text()
}

serve(async (req) => {
  try {
    console.log('Function started')
    
    let date: string
    
    // Check if this is a cron job request
    const isCronJob = req.headers.get('Authorization')?.startsWith('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    
    if (isCronJob) {
      // Get yesterday's date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      date = yesterday.toISOString().split('T')[0]
      console.log('Cron job triggered, processing yesterday:', date)
    } else {
      // Parse the request body to get the date
      const body = await req.json()
      date = body.date
      if (!date) {
        throw new Error('Date parameter is required (YYYY-MM-DD format)')
      }
    }
    
    console.log(`Processing reports for date: ${date}`)
    
    const [year, month, day] = date.split('-').map(Number)
    if (!year || !month || !day) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD')
    }

    // Convert year to YY format and pad month/day with zeros
    const yyStr = year.toString().slice(-2)
    const mmStr = month.toString().padStart(2, '0')
    const ddStr = day.toString().padStart(2, '0')
    const fileName = `${yyStr}${mmStr}${ddStr}_rpts.csv`
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY
      })
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    console.log('Supabase client created')
    
    let csvText: string
    
    // Try to get the file from storage first
    console.log(`Looking for file: ${fileName} in storage`)
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('spc')
      .download(fileName)
    
    if (storageError) {
      console.log('File not found in storage, downloading from SPC...')
      try {
        csvText = await downloadFromSPC(date)
        
        // Save to storage for future use
        const { error: uploadError } = await supabase
          .storage
          .from('spc')
          .upload(fileName, new Blob([csvText], { type: 'text/csv' }))
        
        if (uploadError) {
          console.error('Error saving file to storage:', uploadError)
        } else {
          console.log('File saved to storage')
        }
      } catch (error) {
        console.error('Error downloading from SPC:', error)
        throw error
      }
    } else {
      console.log('File found in storage')
      csvText = await storageData.text()
    }

    console.log(`CSV content length: ${csvText.length} characters`)
    
    console.log('Parsing CSV data...')
    const reports = await parseReportCSV(csvText)
    console.log(`Found reports:`, {
      tornadoes: reports.tornado_reports.length,
      hail: reports.hail_reports.length,
      wind: reports.wind_reports.length,
      counties: Array.from(reports.affected_counties).length
    })
    
    // Create a report for each affected county
    for (const countyState of reports.affected_counties) {
      const [county, state] = countyState.split(',')
      console.log(`Processing reports for ${county}, ${state}`)
      
      try {
        const mapImageUrl = await getMapboxImage(county, state)
        console.log(`Generated map image URL for ${county}, ${state}`)
        
        const stormReport: StormReport = {
          report_date: date,
          county,
          state,
          tornado_reports: reports.tornado_reports.filter(r => r.county === county && r.state === state),
          hail_reports: reports.hail_reports.filter(r => r.county === county && r.state === state),
          wind_reports: reports.wind_reports.filter(r => r.county === county && r.state === state),
          hurricane_reports: [],
          map_image_url: mapImageUrl
        }

        // Only create a report if there are actual reports for this county
        if (stormReport.tornado_reports.length > 0 || 
            stormReport.hail_reports.length > 0 || 
            stormReport.wind_reports.length > 0) {
          console.log(`Inserting storm report for ${county}, ${state}`)
          const { error } = await supabase
            .from('storm_reports')
            .insert(stormReport)

          if (error) {
            console.error(`Error inserting report for ${county}, ${state}:`, error)
            throw error
          }
          console.log(`Successfully inserted report for ${county}, ${state}`)
        } else {
          console.log(`No reports to insert for ${county}, ${state}`)
        }
      } catch (error) {
        console.error(`Error processing county ${county}, ${state}:`, error)
      }
    }

    console.log('Function completed successfully')
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error('Function failed:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetch-storm-reports' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
