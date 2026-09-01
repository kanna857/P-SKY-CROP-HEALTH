import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { LivingEarthOverlay } from './LivingEarthOverlay';
import { OfflineSyncBanner } from './OfflineSyncBanner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#060a10] text-white flex selection:bg-emerald-500/20 selection:text-emerald-400 relative overflow-x-hidden">
      {/* High-Visibility Cinematic Agriculture Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-70 pointer-events-none z-0 scale-100 transition-all duration-700"
        style={{ backgroundImage: `url('/app-dark-bg.jpg')` }}
      />

      {/* Subtle Tech Grid Overlay */}
      <div className="fixed inset-0 bg-tech-grid opacity-40 pointer-events-none z-0" />

      {/* Gentle Radial Vignette */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#060a10]/40 via-[#070c14]/50 to-[#060a10]/80 pointer-events-none z-0" />

      {/* Vibrant Multi-Color Ambient Aurora Light Orbs (Luminous Colorful Atmosphere) */}
      <div className="fixed top-[-5%] right-[-5%] w-[680px] h-[680px] bg-gradient-to-br from-emerald-400/35 via-teal-400/25 to-cyan-400/20 rounded-full blur-[130px] animate-pulse-slow pointer-events-none z-0" />
      <div className="fixed top-[15%] left-[5%] w-[580px] h-[580px] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-purple-600/20 rounded-full blur-[130px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-[-5%] left-[10%] w-[580px] h-[580px] bg-gradient-to-br from-cyan-400/35 via-sky-500/30 to-blue-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '4s' }} />
      <div className="fixed bottom-[15%] right-[5%] w-[520px] h-[520px] bg-gradient-to-br from-amber-400/30 via-orange-500/25 to-rose-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '6s' }} />
      <div className="fixed top-[45%] left-[35%] w-[450px] h-[450px] bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-amber-400/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '3s' }} />

      {/* Living Earth Dynamic Atmosphere (Sunlight rays, drifting leaves, slow fireflies) */}
      <LivingEarthOverlay />

      {/* Left Sidebar Navigation */}
      <AppSidebar />

      {/* Main View Area with Smooth Page Transition */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-60 transition-all duration-300 relative z-10">
        {/* Persistent Offline / Background Sync Alert Bar */}
        <OfflineSyncBanner />

        <main className="flex-1 pt-16 lg:pt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
