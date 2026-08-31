import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated NDVI data for demo fields (in production, this would fetch from satellite API)
const demoFieldNDVI: Record<string, number> = {
  'field-1': 0.72,
  'field-2': 0.25, // Below typical threshold - should trigger alert
  'field-3': 0.58,
  'field-4': 0.68,
  'field-5': 0.45,
};

const alertMessages: Record<string, string> = {
  te: "⚠️ హెచ్చరిక: మీ {field} పొలంలో NDVI {ndvi}కి పడిపోయింది. పంట ఆరోగ్యం బలహీనంగా ఉంది. దయచేసి తనిఖీ చేయండి.",
  hi: "⚠️ चेतावनी: आपके {field} खेत में NDVI {ndvi} तक गिर गया है। फसल स्वास्थ्य कमजोर है। कृपया जांच करें।",
  en: "⚠️ Alert: NDVI for your {field} field has dropped to {ndvi}. Crop health is weak. Please check immediately.",
  ta: "⚠️ எச்சரிக்கை: உங்கள் {field} வயலில் NDVI {ndvi} ஆக குறைந்துள்ளது. பயிர் ஆரோக்கியம் பலவீனமாக உள்ளது.",
  kn: "⚠️ ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ {field} ಹೊಲದಲ್ಲಿ NDVI {ndvi} ಕ್ಕೆ ಇಳಿದಿದೆ. ಬೆಳೆ ಆರೋಗ್ಯ ದುರ್ಬಲವಾಗಿದೆ.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting scheduled NDVI monitoring...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all enabled alert settings
    const { data: alertSettings, error: settingsError } = await supabase
      .from('alert_settings')
      .select('*')
      .eq('enabled', true);

    if (settingsError) {
      console.error('Error fetching alert settings:', settingsError);
      throw settingsError;
    }

    console.log(`Found ${alertSettings?.length || 0} enabled alert settings`);

    const alertsSent: string[] = [];
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error('Missing Twilio credentials');
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    for (const setting of alertSettings || []) {
      // Get current NDVI for the field (demo data for now)
      const currentNdvi = demoFieldNDVI[setting.field_id] || Math.random() * 0.5 + 0.3;
      
      console.log(`Checking field ${setting.field_id}: NDVI=${currentNdvi}, threshold=${setting.threshold}`);

      // Check if NDVI is below threshold
      if (currentNdvi < setting.threshold) {
        console.log(`NDVI below threshold for field ${setting.field_id}, sending alert...`);
        
        const messageTemplate = alertMessages[setting.language] || alertMessages.en;
        const message = messageTemplate
          .replace('{field}', setting.field_id)
          .replace('{ndvi}', currentNdvi.toFixed(2));

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

        const formData = new URLSearchParams();
        formData.append('To', setting.phone);
        formData.append('Body', message);
        
        if (setting.method === 'whatsapp') {
          formData.append('From', `whatsapp:${twilioPhoneNumber}`);
          formData.append('To', `whatsapp:${setting.phone}`);
        } else {
          formData.append('From', twilioPhoneNumber);
        }

        try {
          if (setting.method === 'voice') {
            // Voice call
            const callUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`;
            const callData = new URLSearchParams();
            callData.append('To', setting.phone);
            callData.append('From', twilioPhoneNumber);
            callData.append('Twiml', `<Response><Say language="${setting.language === 'te' ? 'te-IN' : setting.language === 'hi' ? 'hi-IN' : setting.language === 'ta' ? 'ta-IN' : setting.language === 'kn' ? 'kn-IN' : 'en-US'}">${message}</Say></Response>`);

            const callResponse = await fetch(callUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: callData,
            });

            if (!callResponse.ok) {
              const errorText = await callResponse.text();
              console.error(`Twilio call error: ${errorText}`);
            } else {
              alertsSent.push(`Voice call to ${setting.phone} for field ${setting.field_id}`);
            }
          } else {
            // SMS or WhatsApp
            const response = await fetch(twilioUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formData,
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Twilio error: ${errorText}`);
            } else {
              alertsSent.push(`${setting.method.toUpperCase()} to ${setting.phone} for field ${setting.field_id}`);
            }
          }
        } catch (twilioError) {
          console.error(`Error sending alert for field ${setting.field_id}:`, twilioError);
        }
      }
    }

    console.log(`Monitoring complete. Alerts sent: ${alertsSent.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${alertSettings?.length || 0} fields, sent ${alertsSent.length} alerts`,
        alertsSent 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in NDVI monitor:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
