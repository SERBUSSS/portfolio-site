// /netlify/functions/submit-form.js
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.fullName || !data.email) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing required fields' }) };
    }

    if (data.website) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Honeypot triggered' }) };
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    const services = (data.services || []).join(', ');
    const socialMediaProfiles = [];
    let i = 0;
    while (data[`social-media-type-${i}`]) {
      const type = data[`social-media-type-${i}`];
      const profile = data[`social-media-profile-${i}`];
      if (profile && profile.trim()) socialMediaProfiles.push(`${type}: ${profile.trim()}`);
      i++;
    }

    await supabase.from('form_submissions').insert([{
      full_name: data.fullName,
      email: data.email.toLowerCase(),
      business_name: data.businessName || '',
      social_media_profiles: socialMediaProfiles.join(', '),
      business_description: data.businessDescription || '',
      business_challenges: data.businessChallenges || '',
      services,
      project_objectives: data.projectObjectives || '',
      project_vision: data.projectVision || '',
      budget: data.budget || '',
      custom_budget: data.customBudget || '',
      referral_source: data.referralSource || '',
      submitted_at: new Date().toISOString()
    }]);

    // Set up Brevo API
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'Sergiu Buștiuc', email: 'sergiu@bustiuc.digital' };
    sendSmtpEmail.to = [
      { name: 'Sergiu', email: 's1.bustiuc@gmail.com' },
      { name: data.fullName, email: data.email }
    ];
    sendSmtpEmail.subject = `New Inquiry from ${data.fullName}`;
    sendSmtpEmail.htmlContent = `
      <h2>Thank you for your inquiry</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business Name:</strong> ${data.businessName || 'Not provided'}</p>
      <p><strong>Social Media:</strong> ${socialMediaProfiles.join(', ')}</p>
      <p><strong>Services:</strong> ${services}</p>
      <p><strong>Objectives:</strong> ${data.projectObjectives}</p>
      <p><strong>Vision:</strong> ${data.projectVision}</p>
      <p><strong>Budget:</strong> ${data.budget || data.customBudget}</p>
      <p><strong>Referral:</strong> ${data.referralSource}</p>
    `;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Form submitted and email sent!' })
    };
  } catch (error) {
    console.error('🔥 Brevo or submission error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
};
