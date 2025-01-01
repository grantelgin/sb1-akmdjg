// Test script for Outscraper API using ES modules
import fetch from 'node-fetch';

async function testOutscraperApi() {
  // Replace these values with your actual API key and test data
  const API_KEY = process.env.OUTSCRAPER_API_KEY;
  const searchQuery = 'roofing contractors near Boston, MA within 10 miles';
  const webhookUrl = 'https://your-webhook-url.com';

  const encodedQuery = encodeURIComponent(searchQuery);
  const encodedWebhook = encodeURIComponent(webhookUrl);
  
  // Try different variations of the URL to debug
  const urls = [
    // Basic URL with just the query
    `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}`,
    
    // URL with webhook
    `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}&webhook=${encodedWebhook}`,
    
    // URL with all parameters
    `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}&webhook=${encodedWebhook}&limit=20&language=en&region=us&async=true`,
    
    // Alternative endpoint
    `https://api.app.outscraper.com/v2/google-maps/search?query=${encodedQuery}`
  ];

  for (const url of urls) {
    console.log('\n\nTesting URL:', url);
    console.log('-'.repeat(80));

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': API_KEY,
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Parsed response:', JSON.stringify(data, null, 2));
        } catch (e) {
          console.log('Could not parse response as JSON');
        }
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// Check for API key
if (!process.env.OUTSCRAPER_API_KEY) {
  console.error('Please set OUTSCRAPER_API_KEY environment variable');
  process.exit(1);
}

// Run the test
testOutscraperApi(); 