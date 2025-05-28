// netlify/functions/submit-form.js
const sgMail = require('@sendgrid/mail');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Restrict this to your domain in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Parse the incoming JSON data
    const data = JSON.parse(event.body);
    
    // Basic validation
    if (!data.fullName || !data.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }
    
    // Check honeypot field if you have one
    if (data.website) { // "website" is a hidden field that should be empty
      console.log("Bot submission detected");
      return {
        statusCode: 200, // Return 200 to not alert bots
        headers,
        body: JSON.stringify({ message: 'Form submitted successfully' })
      };
    }

    // Normalize email for consistent checking
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists in Supabase
    const { data: existingSubmission, error: checkError } = await supabase
      .from('form_submissions')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);

    if (checkError) {
      console.error('Supabase check error:', checkError);
      // Continue with submission if database check fails
    } else if (existingSubmission && existingSubmission.length > 0) {
      // Email already exists - return success but don't process
      console.log('Duplicate email submission attempted:', normalizedEmail);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Form submitted successfully',
          duplicate: true 
        })
      };
    }

    // Process service checkboxes into a comma-separated string
    const servicesChecked = Array.from(data.services || []).join(', ');
    
    // Process social media fields
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

    // Prepare complete form data for storage
    const formDataForStorage = {
      fullName: data.fullName,
      email: normalizedEmail,
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

    // Store in Supabase
    const { data: storedData, error: storeError } = await supabase
      .from('form_submissions')
      .insert([{
        email: normalizedEmail,
        form_data: formDataForStorage
      }]);

    if (storeError) {
      console.error('Supabase storage error:', storeError);
      // Continue with email sending even if storage fails
    } else {
      console.log('Form data stored successfully in Supabase');
    }

    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Format the email content
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
    
    // Email to you
    const emailToYou = {
      to: 's1.bustiuc@gmail.com', // Your email
      from: 'sergiu@bustiuc.digital', // Must be verified in SendGrid
      subject: `New Project Inquiry from ${data.fullName}`,
      html: `
        <h1>New Project Inquiry</h1>
        ${formattedDetails}
      `
    };
    
    // Email to the client
    const emailToClient = {
      to: data.email,
      from: 'sergiu@bustiuc.digital', // Must be verified in SendGrid
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
    
    // Send both emails
    await sgMail.send(emailToYou);
    await sgMail.send(emailToClient);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Form submitted successfully',
        stored: !storeError 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'An error occurred processing your request',
        error: error.message
      })
    };
  }
};