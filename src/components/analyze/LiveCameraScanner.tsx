import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface LiveCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, previewUrl: string) => void;
}

export function LiveCameraScanner({ isOpen, onClose, onCapture }: LiveCameraScannerProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    stopStream();

    try {
      // Check available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      toast({
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to scan leaves live.',
        variant: 'destructive',
      });
      onClose();
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, onClose, stopStream, toast]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `leaf_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = canvas.toDataURL('image/jpeg');
      stopStream();
      onCapture(file, previewUrl);
      onClose();
      toast({
        title: 'Leaf Captured!',
        description: 'Analyzing scanned leaf with AI model...',
      });
    }, 'image/jpeg', 0.95);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-black border-primary/30 text-white">
        <DialogHeader className="p-4 bg-background/80 backdrop-blur-md flex flex-row items-center justify-between z-10">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary animate-pulse" />
            Live Leaf Scanner
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Viewfinder Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner Overlay Guide */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
            <div className="relative w-64 h-64 border-2 border-primary/70 rounded-2xl shadow-[0_0_25px_rgba(74,222,128,0.3)] flex flex-col justify-between p-3">
              {/* Corner accents */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

              {/* Laser scan animation bar */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse absolute top-1/2 left-0 -translate-y-1/2" />

              <div className="text-center text-xs text-primary font-medium bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full mx-auto">
                Align Leaf Inside Frame
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-background/90 backdrop-blur-md flex items-center justify-around border-t border-white/10">
          {hasMultipleCameras ? (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={toggleCamera}
              title="Flip Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-12 h-12" />
          )}

          {/* Shutter Capture Button */}
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center p-0"
            onClick={handleCapture}
            disabled={isInitializing}
          >
            <div className="w-13 h-13 rounded-full border-2 border-primary-foreground/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
