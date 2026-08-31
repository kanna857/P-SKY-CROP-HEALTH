import { Leaf, Sparkles } from 'lucide-react';

export function LivingEarthOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Subtle Moving Sunlight Rays Beam */}
      <div 
        className="absolute -top-32 right-1/4 w-[500px] h-[700px] bg-gradient-to-b from-emerald-300/10 via-amber-200/5 to-transparent blur-3xl transform -rotate-12 animate-sunray origin-top"
      />

      {/* 2. Floating Firefly & Spore Particles */}
      <div className="absolute top-[18%] left-[22%] w-2 h-2 rounded-full bg-emerald-400/90 blur-[1px] animate-firefly-1" />
      <div className="absolute top-[45%] right-[28%] w-2.5 h-2.5 rounded-full bg-teal-300/80 blur-[1.5px] animate-firefly-2" />
      <div className="absolute bottom-[30%] left-[38%] w-1.5 h-1.5 rounded-full bg-emerald-300/90 blur-[1px] animate-firefly-3" />
      <div className="absolute top-[32%] right-[12%] w-2 h-2 rounded-full bg-green-400/75 blur-[1px] animate-firefly-1" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-[15%] right-[40%] w-1.5 h-1.5 rounded-full bg-teal-400/80 blur-[1px] animate-firefly-2" style={{ animationDelay: '7s' }} />

      {/* 3. Faint Drifting Leaf Silhouettes */}
      <div className="absolute top-0 left-[15%] text-emerald-500/15 animate-leaf-drift">
        <Leaf className="w-8 h-8 transform rotate-45" />
      </div>
      <div className="absolute top-0 right-[25%] text-teal-400/10 animate-leaf-drift" style={{ animationDelay: '9s' }}>
        <Leaf className="w-6 h-6 transform -rotate-12" />
      </div>
    </div>
  );
}
