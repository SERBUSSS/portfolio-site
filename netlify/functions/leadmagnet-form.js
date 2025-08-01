const axios = require('axios');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  try {
    const { name, email, audience_type } = JSON.parse(event.body);

    const brevoApiKey = process.env.BREVO_API_KEY;

    const response = await axios.post('https://api.brevo.com/v3/contacts', {
      email: email,
      attributes: {
        FIRSTNAME: name,
        TAG: audience_type
      },
      listIds: [5], // ← înlocuiește cu ID-ul real din Brevo
      updateEnabled: true
    }, {
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Contact added successfully' })
    };

  } catch (error) {
    console.error(error.response?.data || error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to add contact' })
    };
  }
};
