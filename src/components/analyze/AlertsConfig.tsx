import { useState, useEffect } from 'react';
import { AlertSettings, ALERT_LANGUAGES, AlertLanguage, AlertMethod, DemoField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Phone, MessageSquare, Save, Volume2, Languages, PhoneCall, Send, Loader2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AlertsConfigProps {
  selectedField?: DemoField | null;
  currentNdvi?: number;
}

export function AlertsConfig({ selectedField, currentNdvi }: AlertsConfigProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: false,
    phone: '',
    threshold: 0.4,
    method: 'sms',
    language: 'te',
  });
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing settings from database when field changes
  useEffect(() => {
    const loadSettings = async () => {
      if (!user || !selectedField) return;
      
      const { data } = await supabase
        .from('alert_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('field_id', selectedField.id)
        .maybeSingle();
      
      if (data) {
        setSettings({
          enabled: data.enabled,
          phone: data.phone,
          threshold: data.threshold,
          method: data.method as AlertMethod,
          language: data.language as AlertLanguage,
        });
      }
    };
    
    loadSettings();
  }, [user, selectedField]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to save alert settings',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedField) {
      toast({
        title: 'Select a Field',
        description: 'Please select a field to configure alerts for',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('alert_settings')
        .upsert({
          user_id: user.id,
          field_id: selectedField.id,
          enabled: settings.enabled,
          phone: settings.phone,
          threshold: settings.threshold,
          method: settings.method,
          language: settings.language,
        }, { onConflict: 'user_id,field_id' });

      if (error) throw error;

      const methodLabels: Record<AlertMethod, string> = {
        sms: 'SMS',
        whatsapp: 'WhatsApp',
        voice: 'Voice Call',
      };
      
      const langName = ALERT_LANGUAGES.find(l => l.code === settings.language)?.nativeName || 'English';
      
      toast({
        title: 'Scheduled Alerts Enabled',
        description: `You'll receive ${methodLabels[settings.method]} alerts in ${langName} when NDVI drops below ${settings.threshold}. Monitoring runs every hour.`,
      });
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Failed to Save',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sendAlert = async (isTest: boolean = false) => {
    if (!settings.phone) {
      toast({
        title: 'Phone Required',
        description: 'Please enter a phone number to send alerts',
        variant: 'destructive',
      });
      return;
    }

    if (isTest) {
      setIsTesting(true);
    } else {
      setIsSending(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-alert', {
        body: {
          phone: settings.phone,
          method: settings.method,
          language: settings.language,
          fieldName: selectedField?.name || 'Your Field',
          ndvi: currentNdvi || 0.35,
          crop: selectedField?.crop || 'Crop',
        },
      });

      if (error) throw error;

      const methodLabels: Record<AlertMethod, string> = {
        sms: 'SMS',
        whatsapp: 'WhatsApp message',
        voice: 'Voice call',
      };

      toast({
        title: isTest ? 'Test Alert Sent!' : 'Alert Sent!',
        description: `${methodLabels[settings.method]} ${isTest ? 'test ' : ''}sent to ${settings.phone}`,
      });
    } catch (error: any) {
      console.error('Failed to send alert:', error);
      toast({
        title: 'Failed to Send Alert',
        description: error.message || 'Please check your phone number and try again',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
      setIsTesting(false);
    }
  };

  const alertMethods: { id: AlertMethod; icon: React.ComponentType<{ className?: string }>; label: string; sublabel: string }[] = [
    { id: 'sms', icon: Phone, label: 'SMS', sublabel: 'Text message' },
    { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', sublabel: 'Rich messages' },
    { id: 'voice', icon: PhoneCall, label: 'Voice Call', sublabel: 'Audio alerts' },
  ];

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        Alert Settings
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-normal flex items-center gap-1">
          <Languages className="w-3 h-3" />
          Multi-Language
        </span>
      </h3>

      <div className="space-y-6">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Enable Alerts</p>
            <p className="text-sm text-muted-foreground">Get notified when crop health drops</p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" />
                Alert Language / భాష / भाषा
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALERT_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSettings({ ...settings, language: lang.code })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      settings.language === lang.code
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                        : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <span className="block text-lg font-medium">{lang.nativeName}</span>
                    <span className="block text-xs opacity-70">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91 for India)</p>
            </div>

            {/* Alert Method */}
            <div>
              <label className="block text-sm font-medium mb-2">Alert Method</label>
              <div className="grid grid-cols-3 gap-2">
                {alertMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSettings({ ...settings, method: method.id })}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                        settings.method === method.id
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                          : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{method.label}</span>
                      <span className="text-xs opacity-70">{method.sublabel}</span>
                    </button>
                  );
                })}
              </div>
              
              {settings.method === 'voice' && (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
                  <Volume2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Voice Call Alerts</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      You'll receive automated voice calls in {ALERT_LANGUAGES.find(l => l.code === settings.language)?.nativeName} 
                      {' '}when crop health drops below threshold. Perfect for farmers who prefer audio updates.
                    </p>
                  </div>
                </div>
              )}

              {settings.method === 'whatsapp' && (
                <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">WhatsApp Alerts</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Note: Your number must be registered with Twilio's WhatsApp sandbox. 
                      Send "join &lt;sandbox-code&gt;" to your Twilio WhatsApp number first.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Threshold */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Alert Threshold: NDVI &lt; {settings.threshold}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={settings.threshold}
                onChange={(e) => setSettings({ ...settings, threshold: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.1 (Critical only)</span>
                <span>0.6 (Early warning)</span>
              </div>
            </div>

            {/* Preview Message */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Sample Alert Preview
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {settings.language === 'te' && `హెచ్చరిక: ${selectedField?.name || 'గుంటూరు'}లో మీ ${selectedField?.crop || 'వరి'} పొలానికి శ్రద్ధ అవసరం (NDVI: ${(currentNdvi || 0.35).toFixed(2)}). నీటిపారుదల తనిఖీ చేయండి.`}
                {settings.language === 'hi' && `सावधान: ${selectedField?.name || 'गुंटूर'} पर आपकी ${selectedField?.crop || 'धान'} फसल को ध्यान देने की जरूरत है (NDVI: ${(currentNdvi || 0.35).toFixed(2)})। सिंचाई जांचें।`}
                {settings.language === 'en' && `WARNING: Your ${selectedField?.crop || 'Crop'} field at ${selectedField?.name || 'Field'} needs attention (NDVI: ${(currentNdvi || 0.35).toFixed(2)}). Please check irrigation.`}
                {settings.language === 'ta' && `கவனம்: ${selectedField?.name || 'குண்டூர்'}ல் உங்கள் ${selectedField?.crop || 'நெல்'} வயலுக்கு கவனம் தேவை (NDVI: ${(currentNdvi || 0.35).toFixed(2)}). நீர்ப்பாசனத்தை சரிபார்க்கவும்.`}
                {settings.language === 'kn' && `ಗಮನ: ${selectedField?.name || 'ಗುಂಟೂರ್'}ನಲ್ಲಿ ನಿಮ್ಮ ${selectedField?.crop || 'ಭತ್ತ'} ಹೊಲಕ್ಕೆ ಗಮನ ಬೇಕು (NDVI: ${(currentNdvi || 0.35).toFixed(2)}). ನೀರಾವರಿ ಪರಿಶೀಲಿಸಿ.`}
              </p>
            </div>

            {/* Scheduled Monitoring Info */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
              <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Automatic Monitoring</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Once saved, your field will be monitored automatically every hour. 
                  You'll receive alerts when NDVI drops below your threshold.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} className="w-full" disabled={isSaving || !user}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {user ? 'Enable Scheduled Monitoring' : 'Login to Enable Monitoring'}
              </Button>
              
              <Button
                onClick={() => sendAlert(true)} 
                className="w-full"
                disabled={isTesting || !settings.phone}
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Test Alert Now
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
