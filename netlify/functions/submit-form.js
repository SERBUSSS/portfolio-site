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

    // Direct database insertion (no RPC functions)
    const { data: insertResult, error: insertError } = await supabase
      .from('form_submissions')
      .insert([{
        full_name: data.fullName,
        email: data.email.toLowerCase().trim(),
        business_name: data.businessName || '',
        social_media_profiles: socialMediaProfiles.join(', '),
        business_description: data.businessDescription || '',
        business_challenges: data.businessChallenges || '',
        services: servicesChecked,
        project_objectives: data.projectObjectives || '',
        project_vision: data.projectVision || '',
        budget: data.budget || '',
        custom_budget: data.customBudget || '',
        referral_source: data.referralSource || '',
        submitted_at: new Date().toISOString()
      }])
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      
      // Check for duplicate email
      if (insertError.code === '23505') {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            message: 'This email has already been used for an inquiry.',
            error: 'DUPLICATE_EMAIL'
          })
        };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Form submission failed',
          error: 'SUBMISSION_ERROR'
        })
      };
    }

    // Send emails (your existing email logic continues...)
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
        success: true
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