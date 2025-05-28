const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    // Simple ping to keep project active
    const { data, error } = await supabase
      .from('form_submissions')
      .select('count')
      .limit(1);
      
    if (error) {
      console.log('Supabase ping error:', error);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'alive', 
        timestamp: new Date().toISOString(),
        success: !error 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: 'error', 
        message: error.message 
      })
    };
  }
};