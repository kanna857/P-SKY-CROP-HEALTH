import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { LivingEarthOverlay } from './LivingEarthOverlay';

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

      {/* Atmospheric Ambient Glowing Orbs */}
      <div className="fixed top-[-5%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[130px] animate-pulse-slow pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[5%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '3s' }} />

      {/* Living Earth Dynamic Atmosphere (Sunlight rays, drifting leaves, slow fireflies) */}
      <LivingEarthOverlay />

      {/* Left Sidebar Navigation */}
      <AppSidebar />

      {/* Main View Area with Smooth Page Transition */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-60 transition-all duration-300 relative z-10">
        <main className="flex-1 pt-16 lg:pt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
