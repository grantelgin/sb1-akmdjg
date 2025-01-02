import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CRON_SCHEDULE = "0 0 * * *" // Run at midnight every day

serve(async (_req) => {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/fetch-storm-reports`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
}) 