-- Create alert_settings table for storing user alert configurations
CREATE TABLE public.alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  field_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  phone TEXT NOT NULL,
  threshold DOUBLE PRECISION NOT NULL DEFAULT 0.3,
  method TEXT NOT NULL DEFAULT 'sms',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, field_id)
);

-- Enable RLS
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own alert settings"
ON public.alert_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alert settings"
ON public.alert_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert settings"
ON public.alert_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alert settings"
ON public.alert_settings FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_alert_settings_updated_at
BEFORE UPDATE ON public.alert_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron and pg_net for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;