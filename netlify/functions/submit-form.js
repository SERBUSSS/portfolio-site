const sgMail = require('@sendgrid/mail');
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

    const data = JSON.parse(event.body);
    
    if (!data.fullName || !data.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // Honeypot check
    if (data.website) {
      console.log("Bot submission detected");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Form submitted successfully' })
      };
    }

    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    '127.0.0.1';

    // Check rate limit for submissions
    const { data: rateLimitResult, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        client_ip: clientIP,
        action_name: 'form_submit',
        max_requests: 3, // 3 submissions per hour
        window_minutes: 60
      });

    if (rateLimitError || !rateLimitResult) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          message: 'Too many submissions. Please try again later.',
          error: 'RATE_LIMITED'
        })
      };
    }

    // Process form data
    const servicesChecked = Array.from(data.services || []).join(', ');
    
    const socialMediaProfiles = [];
    let index = 0;
    while (data[`social-media-type-${index}`]) {
      const type = data[`social-media-type-${index}`];
      const profile = data[`social-media-profile-${index}`];
      
      if (profile && profile.trim()) {
        socialMediaProfiles.push(`${type}: ${profile}`);
      }
      index++;
    }

    const formDataForStorage = {
      fullName: data.fullName,
      email: data.email.toLowerCase().trim(),
      businessName: data.businessName || '',
      socialMediaProfiles: socialMediaProfiles.join(', '),
      businessDescription: data.businessDescription || '',
      businessChallenges: data.businessChallenges || '',
      services: servicesChecked,
      projectObjectives: data.projectObjectives || '',
      projectVision: data.projectVision || '',
      budget: data.budget || '',
      customBudget: data.customBudget || '',
      referralSource: data.referralSource || '',
      submittedAt: new Date().toISOString()
    };

    // Use secure database function for submission
    const { data: submitResult, error: submitError } = await supabase
      .rpc('submit_form_secure', { form_data: formDataForStorage });

    if (submitError) {
      console.error('Submission function error:', submitError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Form submission failed',
          error: 'SUBMISSION_ERROR'
        })
      };
    }

    if (!submitResult.success) {
      // Handle specific errors
      if (submitResult.error === 'DUPLICATE_EMAIL') {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            message: submitResult.message,
            error: 'DUPLICATE_EMAIL'
          })
        };
      }
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: submitResult.message,
          error: submitResult.error
        })
      };
    }

    // Send emails using SendGrid (your existing email logic)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const formattedDetails = `
      <h2>Project Inquiry Details</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business Name:</strong> ${data.businessName || 'Not specified'}</p>
      <p><strong>Social Media:</strong> ${socialMediaProfiles.join(', ') || 'Not specified'}</p>
      <p><strong>Business Description:</strong> ${data.businessDescription || 'Not specified'}</p>
      <p><strong>Business Challenges:</strong> ${data.businessChallenges || 'Not specified'}</p>
      <p><strong>Services Requested:</strong> ${servicesChecked || 'Not specified'}</p>
      <p><strong>Project Objectives:</strong> ${data.projectObjectives || 'Not specified'}</p>
      <p><strong>Project Vision:</strong> ${data.projectVision || 'Not specified'}</p>
      <p><strong>Budget Range:</strong> ${data.budget || 'Not specified'}</p>
      ${data.customBudget ? `<p><strong>Custom Budget:</strong> ${data.customBudget}</p>` : ''}
      <p><strong>Referral Source:</strong> ${data.referralSource || 'Not specified'}</p>
    `;
    
    const emailToYou = {
      to: 's1.bustiuc@gmail.com',
      from: 'sergiu@bustiuc.digital',
      subject: `New Project Inquiry from ${data.fullName}`,
      html: `<h1>New Project Inquiry</h1>${formattedDetails}`
    };
    
    const emailToClient = {
      to: data.email,
      from: 'sergiu@bustiuc.digital',
      subject: 'Thank you for your project inquiry!',
      html: `
        <h1>Thank You for Your Project Inquiry</h1>
        <p>Hello ${data.fullName},</p>
        <p>I've received your project inquiry and will review it shortly. 
           I'll be in touch within 2 business days to discuss the next steps.</p>
        <p>For your reference, here's a copy of the information you submitted:</p>
        ${formattedDetails}
        <p>Best regards,</p>
        <p>Sergiu Buștiuc</p>
        <p><a href="https://bustiuc.digital">bustiuc.digital</a></p>
      `
    };
    
    await sgMail.send(emailToYou);
    await sgMail.send(emailToClient);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Form submitted successfully',
        id: submitResult.id
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'An error occurred processing your request',
        error: 'INTERNAL_ERROR'
      })
    };
  }
};