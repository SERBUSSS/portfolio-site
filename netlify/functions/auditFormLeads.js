const axios = require('axios');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  console.log("📩 Request received:", event.httpMethod);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const {
      name,
      email,
      funnel_link,
      offer_audience,
      funnel_problem_goal
    } = body;

    console.log("✅ Received form data:", body);

    if (!name || !email || !funnel_link || !offer_audience || !funnel_problem_goal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    const response = await axios.post('https://api.brevo.com/v3/contacts', {
      email,
      attributes: {
        FIRSTNAME: name,
        FUNNEL_LINK: funnel_link,
        AUDIENCE: offer_audience,
        FUNNEL_ISSUE: funnel_problem_goal
      },
      listIds: [6], 
      updateEnabled: true
    }, {
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("✅ Contact added:", response.data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Contact added successfully' })
    };

  } catch (error) {
    console.error("❌ Error adding contact:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to add contact', error: error.message })
    };
  }
};