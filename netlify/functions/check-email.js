const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    '127.0.0.1';

    // Check rate limit first
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        client_ip: clientIP,
        action_name: 'email_check',
        max_requests: 20, // 20 checks per minute
        window_minutes: 1
      });

    if (rateLimitError || !rateLimitResult) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMITED'
        })
      };
    }

    // Use secure database function for email checking
    const { data, error } = await supabase
      .rpc('check_email_exists', { input_email: email });

    if (error) {
      console.error('Database function error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Email validation service error',
          error: 'SERVICE_ERROR'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        exists: data.exists,
        timestamp: data.timestamp
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Server error',
        error: 'INTERNAL_ERROR'
      })
    };
  }
};