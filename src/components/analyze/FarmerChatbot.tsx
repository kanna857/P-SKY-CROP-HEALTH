import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, Loader2, Wheat, Mic, MicOff, Volume2, VolumeX, Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DemoField } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useVoice, SUPPORTED_LANGUAGES } from '@/hooks/useVoice';

interface FarmerChatbotProps {
  field: DemoField | null;
  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    rainfall: number;
  } | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function FarmerChatbot({ field, weather }: FarmerChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Hello! I am your AI Agronomist. Select a language and speak or type your question! 🌾',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } =
    useVoice({ language: selectedLang.code, onResult: handleVoiceResult });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride ?? input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const langInstruction = selectedLang.code !== 'en-IN'
        ? `IMPORTANT: You must reply ONLY in ${selectedLang.label} language. Do not use English.`
        : '';

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${langInstruction}\n\n${userMessage.content}`,
          field: field
            ? {
                name: field.name,
                crop: field.crop,
                ndvi: field.ndvi,
                area: field.area,
                weather: weather || undefined,
                disease: 'No reported diseases',
              }
            : {},
        }),
      });

      if (!response.ok) throw new Error('Failed to get a response from the AI');

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'AI returned an error');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Auto-speak reply if enabled
      if (autoSpeak) speak(data.reply);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: 'Chat Error',
        description: error.message || 'Unable to connect to AI Agronomist.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  if (!field) {
    return (
      <div className="glass-card p-6 rounded-xl min-h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground border-primary/20">
        <Bot className="w-12 h-12 mb-4 text-primary/40" />
        <h3 className="font-display text-lg font-semibold mb-2">Farmer AI Chatbot</h3>
        <p className="text-sm">Select a field to start chatting with your AI Agronomist.</p>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col rounded-xl overflow-hidden h-[580px] border-primary/20 shadow-md">
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b border-primary/20 flex items-center gap-3 flex-wrap">
        <div className="bg-primary/20 p-2 rounded-full">
          <Wheat className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-primary-foreground">Farmer AI Chatbot</h3>
          <p className="text-xs text-muted-foreground truncate">Context: {field.name} ({field.crop})</p>
        </div>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-primary/30">
              <Globe className="w-3 h-3" />
              {selectedLang.flag} {selectedLang.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 max-h-72 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`gap-2 ${selectedLang.code === lang.code ? 'bg-primary/10 font-semibold' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {selectedLang.code === lang.code && (
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1 py-0">✓</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auto-speak toggle */}
        <Button
          variant={autoSpeak ? 'default' : 'outline'}
          size="sm"
          className="h-8 w-8 p-0 border-primary/30"
          title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
          onClick={() => { setAutoSpeak(!autoSpeak); stopSpeaking(); }}
        >
          {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-secondary' : 'bg-primary'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-secondary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                )}
              </div>

              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={`rounded-2xl p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-secondary text-secondary-foreground rounded-tr-none'
                      : 'bg-muted/50 text-foreground border border-border rounded-tl-none'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.content}
                </div>

                {/* Speak button on bot messages */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speak(msg.content)}
                    className="self-start flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors mt-0.5"
                  >
                    {isSpeaking ? (
                      <><VolumeX className="w-3 h-3" /> Stop</>
                    ) : (
                      <><Volume2 className="w-3 h-3" /> Listen</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted/50 border border-border rounded-2xl p-3 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice Status Bar */}
      {isListening && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">
            Listening in {selectedLang.label}... speak now
          </span>
        </div>
      )}
      {isSpeaking && (
        <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-1 bg-primary rounded-full animate-bounce"
                style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <span className="text-xs text-primary font-medium">Speaking...</span>
          <button onClick={stopSpeaking} className="ml-auto text-xs text-muted-foreground hover:text-destructive">
            Stop
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex gap-2">
          {/* Mic Button */}
          <Button
            size="icon"
            variant={isListening ? 'destructive' : 'outline'}
            onClick={toggleMic}
            title={isListening ? 'Stop listening' : `Speak in ${selectedLang.label}`}
            className={`flex-shrink-0 transition-all ${isListening ? 'ring-2 ring-red-500 ring-offset-1' : 'border-primary/30'}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask in ${selectedLang.label}...`}
              className="pr-10 bg-background"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-1 top-1 h-8 w-8"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          🎤 Tap mic → speak → AI replies in {selectedLang.label} {autoSpeak ? '& reads aloud' : ''}
        </p>
      </div>
    </div>
  );
}
