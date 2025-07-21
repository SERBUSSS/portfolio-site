const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  console.log("🚀 Netlify function submit-form STARTED");
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

    if (data.website) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Form submitted successfully' })
      };
    }

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
      }]);

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);

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
          message: 'Submission failed',
          error: insertError.message || 'SUBMISSION_ERROR'
        })
      };
    }

    console.log('✅ Supabase insert succeeded — proceeding to MailerSend');

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

    const emailPayload = {
      from: {
        email: 'sergiu@bustiuc.digital',
        name: 'Sergiu Buștiuc'
      },
      to: [
        { email: data.email, name: data.fullName },
        { email: 's1.bustiuc@gmail.com', name: 'Sergiu B.' }
      ],
      subject: 'New Project Inquiry',
      html: `
        <p>Hello ${data.fullName},</p>
        <p>Thanks for submitting your project! I’ll be reviewing your inquiry and will get back to you soon.</p>
        <hr />
        ${formattedDetails}
        <p>— Sergiu Buștiuc<br><a href="https://bustiuc.digital">bustiuc.digital</a></p>
      `
    };

    console.log('📤 Sending email with MailerSend...');

    const mailerResponse = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('📤 MailerSend status:', mailerResponse.status);
    const responseText = await mailerResponse.text();
    console.log('📤 MailerSend response:', responseText);

    if (!mailerResponse.ok) {
      console.error('❌ MailerSend email failed:', responseText);
      throw new Error(`MailerSend error: ${responseText}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Form submitted and emails sent successfully',
        success: true
      })
    };

  } catch (err) {
    console.error("🔥 Final function-level error:", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal error', error: err.message })
      
    };
  }
};
