// netlify/functions/submit-form.js
const sgMail = require('@sendgrid/mail');

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
    // Parse the incoming JSON data
    const data = JSON.parse(event.body);
    
    // Basic validation
    if (!data.name || !data.email || !data.description) {
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

    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Format the email content
    const formattedDetails = `
      <h2>Project Inquiry Details</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
      <p><strong>Budget Range:</strong> ${data.budget || 'Not specified'}</p>
    `;
    
    // Email to you
    const emailToYou = {
      to: 'your-email@example.com', // Replace with your email
      from: 'your-verified-email@yourdomain.com', // Must be verified in SendGrid
      subject: `New Project Inquiry from ${data.name}`,
      html: `
        <h1>New Project Inquiry</h1>
        ${formattedDetails}
      `
    };
    
    // Email to the client
    const emailToClient = {
      to: data.email,
      from: 'your-verified-email@yourdomain.com', // Must be verified in SendGrid
      subject: 'Thank you for your project inquiry!',
      html: `
        <h1>Thank You for Your Project Inquiry</h1>
        <p>Hello ${data.name},</p>
        <p>I've received your project inquiry and will review it shortly. 
           I'll be in touch within 2 business days to discuss the next steps.</p>
        
        <p>For your reference, here's a copy of the information you submitted:</p>
        
        ${formattedDetails}
        
        <p>Best regards,</p>
        <p>Your Name</p>
        <p>Your Website</p>
      `
    };
    
    // Send both emails
    await sgMail.send(emailToYou);
    await sgMail.send(emailToClient);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Form submitted successfully' })
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