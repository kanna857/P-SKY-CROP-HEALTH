import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  phone: string;
  method: 'sms' | 'whatsapp' | 'voice';
  language: 'te' | 'hi' | 'en' | 'ta' | 'kn';
  fieldName: string;
  ndvi: number;
  crop: string;
}

const alertMessages: Record<string, (fieldName: string, ndvi: number, crop: string) => string> = {
  te: (fieldName, ndvi, crop) => 
    `హెచ్చరిక: ${fieldName}లో మీ ${crop} పొలానికి శ్రద్ధ అవసరం (NDVI: ${ndvi.toFixed(2)}). నీటిపారుదల తనిఖీ చేయండి.`,
  hi: (fieldName, ndvi, crop) => 
    `सावधान: ${fieldName} पर आपकी ${crop} फसल को ध्यान देने की जरूरत है (NDVI: ${ndvi.toFixed(2)})। सिंचाई जांचें।`,
  en: (fieldName, ndvi, crop) => 
    `WARNING: Your ${crop} field at ${fieldName} needs attention (NDVI: ${ndvi.toFixed(2)}). Please check irrigation and crop health.`,
  ta: (fieldName, ndvi, crop) => 
    `கவனம்: ${fieldName}ல் உங்கள் ${crop} வயலுக்கு கவனம் தேவை (NDVI: ${ndvi.toFixed(2)}). நீர்ப்பாசனத்தை சரிபார்க்கவும்.`,
  kn: (fieldName, ndvi, crop) => 
    `ಗಮನ: ${fieldName}ನಲ್ಲಿ ನಿಮ್ಮ ${crop} ಹೊಲಕ್ಕೆ ಗಮನ ಬೇಕು (NDVI: ${ndvi.toFixed(2)}). ನೀರಾವರಿ ಪರಿಶೀಲಿಸಿ.`,
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, method, language, fieldName, ndvi, crop }: AlertRequest = await req.json();

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhone) {
      console.error('Missing Twilio credentials');
      throw new Error('Twilio credentials not configured');
    }

    const message = alertMessages[language](fieldName, ndvi, crop);
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/`;
    const authHeader = 'Basic ' + btoa(`${accountSid}:${authToken}`);

    let result;

    if (method === 'sms') {
      // Send SMS
      console.log(`Sending SMS to ${phone}`);
      const response = await fetch(`${twilioUrl}Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioPhone,
          Body: message,
        }),
      });

      result = await response.json();
      console.log('SMS result:', result);

      if (result.error_code) {
        throw new Error(result.message || 'Failed to send SMS');
      }
    } else if (method === 'whatsapp') {
      // Send WhatsApp message
      console.log(`Sending WhatsApp to ${phone}`);
      const response = await fetch(`${twilioUrl}Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:${phone}`,
          From: `whatsapp:${twilioPhone}`,
          Body: message,
        }),
      });

      result = await response.json();
      console.log('WhatsApp result:', result);

      if (result.error_code) {
        throw new Error(result.message || 'Failed to send WhatsApp');
      }
    } else if (method === 'voice') {
      // Make voice call with TwiML
      console.log(`Making voice call to ${phone}`);
      
      // Create TwiML with Say verb for the message
      const twiml = `<Response><Say voice="alice" language="${language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language === 'ta' ? 'ta-IN' : 'kn-IN'}">${message}</Say><Pause length="1"/><Say voice="alice">Thank you. Goodbye.</Say></Response>`;
      
      const response = await fetch(`${twilioUrl}Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioPhone,
          Twiml: twiml,
        }),
      });

      result = await response.json();
      console.log('Voice call result:', result);

      if (result.error_code) {
        throw new Error(result.message || 'Failed to make voice call');
      }
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in send-alert function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
