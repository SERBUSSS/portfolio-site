const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const { createClient } = require('@supabase/supabase-js');

const mailer = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY
});

const FROM_EMAIL = "sergiu@bustiuc.digital";
const FROM_NAME = "Sergiu Buștiuc";

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method not allowed' }) };

  try {
    const data = JSON.parse(event.body);
    if (!data.fullName || !data.email) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing required fields' }) };
    }
    if (data.website) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Form submitted successfully' }) };
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const services = Array.from(data.services || []).join(', ');
    const socialProfiles = [];
    let i = 0;
    while (data[`social-media-type-${i}`]) {
      const type = data[`social-media-type-${i}`];
      const profile = data[`social-media-profile-${i}`];
      if (profile?.trim()) socialProfiles.push(`${type}: ${profile.trim()}`);
      i++;
    }

    const { error: supabaseError } = await supabase.from('form_submissions').insert([{
      full_name: data.fullName,
      email: data.email.toLowerCase().trim(),
      business_name: data.businessName || '',
      social_media_profiles: socialProfiles.join(', '),
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

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      const code = supabaseError.code === '23505' ? 409 : 500;
      const msg = supabaseError.code === '23505' 
        ? 'This email has already been used for an inquiry.'
        : 'Submission failed';
      return { statusCode: code, headers, body: JSON.stringify({ message: msg, error: supabaseError.message }) };
    }

    const detailsHtml = `
      <h2>Project Inquiry Details</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business Name:</strong> ${data.businessName || 'Not specified'}</p>
      <p><strong>Social Media:</strong> ${socialProfiles.join(', ') || 'Not specified'}</p>
      <p><strong>Business Description:</strong> ${data.businessDescription || 'Not specified'}</p>
      <p><strong>Business Challenges:</strong> ${data.businessChallenges || 'Not specified'}</p>
      <p><strong>Services Requested:</strong> ${services || 'Not specified'}</p>
      <p><strong>Project Objectives:</strong> ${data.projectObjectives || 'Not specified'}</p>
      <p><strong>Project Vision:</strong> ${data.projectVision || 'Not specified'}</p>
      <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
      ${data.customBudget ? `<p><strong>Custom Budget:</strong> ${data.customBudget}</p>` : ''}
      <p><strong>Referral Source:</strong> ${data.referralSource || 'Not specified'}</p>
    `;

    // Build two EmailParams objects
    const adminEmail = new EmailParams()
      .setFrom(new Sender(FROM_EMAIL, FROM_NAME))
      .setTo([new Recipient("s1.bustiuc@gmail.com", "Sergiu B.")])
      .setSubject(`New Project Inquiry from ${data.fullName}`)
      .setHtml(`<h1>New Project Inquiry</h1>${detailsHtml}`);

    const clientEmail = new EmailParams()
      .setFrom(new Sender(FROM_EMAIL, FROM_NAME))
      .setTo([new Recipient(data.email, data.fullName)])
      .setSubject('Thank you for your project inquiry!')
      .setHtml(`<h1>Thank You for Your Project Inquiry</h1><p>Hello ${data.fullName},</p><p>I've received your project inquiry and will review it shortly. I’ll be in touch within 2 business days.</p><hr />${detailsHtml}<p>— Sergiu Buștiuc<br><a href="https://bustiuc.digital">bustiuc.digital</a></p>`);

    await mailer.email.send(adminEmail);
    await mailer.email.send(clientEmail);

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Form submitted and emails sent successfully', success: true }) };
  } catch (err) {
    console.error("🔥 Handler error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal error', error: err.message }) };
  }
};