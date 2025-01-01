// Test script for Outscraper API
async function testOutscraperApi() {
  const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
  const searchQuery = 'roofing contractors near Boston, MA within 10 miles';
  const webhookUrl = 'https://your-webhook-url.com'; // Replace with your test webhook URL

  const encodedQuery = encodeURIComponent(searchQuery);
  const encodedWebhook = encodeURIComponent(webhookUrl);
  
  const searchUrl = `https://api.app.outscraper.com/maps/search-v3?query=${encodedQuery}&webhook=${encodedWebhook}`;

  console.log('Making API request to:', searchUrl);

  try {
    const response = await fetch(searchUrl, {
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

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Could not parse response as JSON');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testOutscraperApi(); 