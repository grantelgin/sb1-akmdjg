import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { URL } from 'url'

interface FileObject {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

// Get the directory name of the current module
const __filename = fileURLToPath(new URL('', import.meta.url))
const __dirname = dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '.env') })

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const currentDate = new Date(startDate)
  const end = new Date(endDate)
  
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  
  const startDate = '2024-11-03'
  const endDate = '2024-12-31'
  const dates = getDatesInRange(startDate, endDate)
  
  console.log(`Processing ${dates.length} dates from ${startDate} to ${endDate}`)
  
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }
  
  // Process each date
  for (const date of dates) {
    console.log(`\nProcessing ${date}...`)
    
    try {
      const response = await fetch(
        'https://acltziqyxiugurpdduim.supabase.co/functions/v1/fetch-storm-reports',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ date })
        }
      )
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`✓ Successfully processed ${date}`)
        results.success.push(date)
      } else {
        console.error(`✗ Failed to process ${date}:`, result.error)
        results.failed.push(date)
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`✗ Error processing ${date}:`, error)
      results.failed.push(date)
    }
  }
  
  // Print summary
  console.log('\nProcessing complete!')
  console.log(`Successfully processed: ${results.success.length} dates`)
  console.log(`Failed to process: ${results.failed.length} dates`)
  
  if (results.failed.length > 0) {
    console.log('\nFailed dates:')
    results.failed.forEach(date => console.log(`- ${date}`))
  }
}

main().catch(console.error) 