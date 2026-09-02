import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Sparkles, AlertCircle, Upload, CheckCircle2, RotateCcw, Video, Volume2 } from 'lucide-react';
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
  const nativeFileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Play gentle synthesized camera shutter click sound
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext not allowed or not supported, ignore silently
    }
  };

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser environment.');
      return;
    }

    setIsInitializing(true);
    setCameraError(null);
    stopStream();

    try {
      // Enumerate available video inputs to check device capabilities
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch (enumErr) {
        console.warn('Could not enumerate media devices:', enumErr);
      }

      let activeStream: MediaStream | null = null;

      // Tier 1: Try requested facing mode with high-definition resolution
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (tier1Err) {
        console.warn('Tier 1 constraint failed, attempting Tier 2:', tier1Err);
        // Tier 2: Try requested facing mode without strict resolution
        try {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false,
          });
        } catch (tier2Err) {
          console.warn('Tier 2 constraint failed, attempting Tier 3 (generic video):', tier2Err);
          // Tier 3: Any video device available (works on laptop webcams such as HP Wide Vision)
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (!activeStream) {
        throw new Error('Could not establish video stream from any available device.');
      }

      setStream(activeStream);

      if (videoRef.current) {
        videoRef.current.srcObject = activeStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((playErr) => {
            console.warn('Autoplay prevented or paused:', playErr);
          });
        };
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown camera error';
      if (msg.includes('Permission') || msg.includes('denied') || msg.includes('NotAllowedError')) {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFoundError')) {
        setCameraError('No video camera was detected on this device.');
      } else if (msg.includes('NotReadableError') || msg.includes('TrackStartError')) {
        setCameraError('Camera is currently in use by another application (e.g. Zoom, Teams, or another tab).');
      } else {
        setCameraError(`Camera initialization failed: ${msg}`);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, stopStream]);

  // Keep video element synchronized with stream whenever videoRef attaches or stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Autoplay handled:', e));
        };
      }
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
      setCameraError(null);
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

    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    canvas.width = vw;
    canvas.height = vh;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, vw, vh);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `leaf_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopStream();
      onCapture(file, previewUrl);
      onClose();
      toast({
        title: 'Leaf Captured Successfully! 📸',
        description: 'Analyzing scanned foliar specimen with AI vision model...',
      });
    }, 'image/jpeg', 0.95);
  };

  // Fallback: Handle native device file / camera app capture
  const handleNativeFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const previewUrl = ev.target?.result as string;
      stopStream();
      onCapture(file, previewUrl);
      onClose();
      toast({
        title: 'Photo Uploaded from Camera',
        description: 'Analyzing foliar specimen with AI model...',
      });
    };
    reader.readAsDataURL(file);
  };

  // Fallback: Simulated foliage test capture (allows immediate testing without physical camera)
  const handleSimulatedCapture = async () => {
    try {
      playShutterSound();
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);

      const response = await fetch('/samples/tomato_early_blight.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'tomato_early_blight.jpg', { type: 'image/jpeg' });
      const previewUrl = '/samples/tomato_early_blight.jpg';

      stopStream();
      onCapture(file, previewUrl);
      onClose();
      toast({
        title: 'Test Foliage Captured! 🌿',
        description: 'Analyzing simulated foliar frame with AI...',
      });
    } catch {
      toast({
        title: 'Could not load sample foliage',
        description: 'Please upload a photo using the file upload button.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-[#060c16] border border-emerald-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <DialogHeader className="p-4 bg-background/90 backdrop-blur-md flex flex-row items-center justify-between z-10 border-b border-white/10">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400 animate-pulse" />
            Live Foliar Scanner & Camera
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 rounded-lg">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Viewfinder Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden select-none">
          {/* Video Stream */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              cameraError ? 'opacity-20' : 'opacity-100'
            }`}
          />

          {/* Shutter Flash Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white/90 z-30 pointer-events-none transition-opacity duration-150" />
          )}

          {/* Active Laser Scan & Reticle Guide (when camera is running) */}
          {!cameraError && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 z-10">
              <div className="relative w-64 h-64 border-2 border-emerald-400/70 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col justify-between p-3">
                {/* Corner accents */}
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                {/* Laser scan animation bar */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 left-0 -translate-y-1/2 shadow-[0_0_10px_#10b981]" />

                <div className="text-center text-[11px] text-emerald-400 font-bold bg-black/70 backdrop-blur-md px-3 py-1 rounded-full mx-auto border border-emerald-500/30">
                  Align Crop Leaf Inside Reticle
                </div>
              </div>
            </div>
          )}

          {/* Camera Error / Fallback UI */}
          {cameraError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 text-center backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Live Camera Notice</p>
                <p className="text-xs text-gray-300 max-w-sm mt-1 leading-relaxed">{cameraError}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={startCamera}
                  disabled={isInitializing}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Camera
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => nativeFileInputRef.current?.click()}
                  className="border-white/20 hover:bg-white/10 text-white text-xs gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Use Camera App / File
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSimulatedCapture}
                  className="text-emerald-400 hover:bg-emerald-500/10 text-xs gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Test With Sample Foliage
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={nativeFileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleNativeFileSelected}
          />
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-background/90 backdrop-blur-md flex items-center justify-between border-t border-white/10 px-6">
          {/* Left: Flip camera button if multiple cameras, or upload from device */}
          {hasMultipleCameras ? (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-11 h-11 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={toggleCamera}
              title="Flip Camera (Front/Rear)"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-11 h-11 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => nativeFileInputRef.current?.click()}
              title="Upload / Device Camera"
            >
              <Upload className="w-4 h-4" />
            </Button>
          )}

          {/* Center: Shutter Capture Button */}
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform flex items-center justify-center p-0"
              onClick={cameraError ? handleSimulatedCapture : handleCapture}
              disabled={isInitializing}
              title={cameraError ? 'Capture Sample' : 'Take Snapshot'}
            >
              <div className="w-13 h-13 rounded-full border-2 border-black/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
            </Button>
            <span className="text-[10px] text-gray-400 mt-1 font-medium">
              {cameraError ? 'Test Capture' : 'Take Snapshot'}
            </span>
          </div>

          {/* Right: Cancel / Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
