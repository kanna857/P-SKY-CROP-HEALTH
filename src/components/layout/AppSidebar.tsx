import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Satellite, 
  Home, 
  LayoutDashboard, 
  BarChart2, 
  Bot, 
  FileText, 
  CloudSun, 
  History, 
  Settings, 
  ChevronDown, 
  User, 
  Menu, 
  X,
  Scan,
  Sparkles,
  Radio,
  ShieldCheck,
  Search,
  MessageSquare,
  TrendingUp,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  color: string;
  iconBg: string;
  activeGradient: string;
  activeBorder: string;
  glow: string;
}

const navItems: NavItem[] = [
  { 
    href: '/', 
    label: 'Home', 
    icon: Home, 
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    activeGradient: 'from-emerald-500/30 via-teal-500/20 to-emerald-500/5',
    activeBorder: 'border-emerald-400',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]'
  },
  { 
    href: '/diagnose', 
    label: 'AI Disease Scanner', 
    icon: Scan, 
    color: 'text-amber-400', 
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    activeGradient: 'from-amber-500/30 via-orange-500/20 to-amber-500/5',
    activeBorder: 'border-amber-400',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]'
  },
  { 
    href: '/analyze', 
    label: 'Satellite Multi-Index', 
    icon: Satellite, 
    color: 'text-cyan-400', 
    iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    activeGradient: 'from-cyan-500/30 via-sky-500/20 to-cyan-500/5',
    activeBorder: 'border-cyan-400',
    glow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]'
  },
  { 
    href: '/search', 
    label: 'SkySearch Ag Engine', 
    icon: Search, 
    color: 'text-emerald-400', 
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    activeGradient: 'from-emerald-500/30 via-teal-500/20 to-emerald-500/5',
    activeBorder: 'border-emerald-400',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]'
  },
  { 
    href: '/feed', 
    label: 'AgriTweets (AgriX)', 
    icon: MessageSquare, 
    color: 'text-sky-400', 
    iconBg: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    activeGradient: 'from-sky-500/30 via-blue-500/20 to-sky-500/5',
    activeBorder: 'border-sky-400',
    glow: 'shadow-[0_0_25px_rgba(56,189,248,0.35)]'
  },
  { 
    href: '/yield-market', 
    label: 'Yield & Mandi Profit', 
    icon: TrendingUp, 
    color: 'text-amber-400', 
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    activeGradient: 'from-amber-500/30 via-yellow-500/20 to-amber-500/5',
    activeBorder: 'border-amber-400',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]'
  },
  { 
    href: '/hotline', 
    label: 'Kisan Voice Hotline', 
    icon: Phone, 
    color: 'text-rose-400', 
    iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    activeGradient: 'from-rose-500/30 via-red-500/20 to-rose-500/5',
    activeBorder: 'border-rose-400',
    glow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)]'
  },
  { 
    href: '/dashboard', 
    label: 'Farm Dashboard', 
    icon: LayoutDashboard, 
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    activeGradient: 'from-purple-500/30 via-violet-500/20 to-purple-500/5',
    activeBorder: 'border-purple-400',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]'
  },
  { 
    href: '/compare', 
    label: 'Compare Fields', 
    icon: BarChart2, 
    color: 'text-pink-400',
    iconBg: 'bg-pink-500/15 border-pink-500/30 text-pink-300',
    activeGradient: 'from-pink-500/30 via-rose-500/20 to-pink-500/5',
    activeBorder: 'border-pink-400',
    glow: 'shadow-[0_0_25px_rgba(236,72,153,0.35)]'
  },
  { 
    href: '/chatbot', 
    label: 'AI Agronomist Voice', 
    icon: Bot, 
    color: 'text-teal-400', 
    iconBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
    activeGradient: 'from-teal-500/30 via-emerald-500/20 to-teal-500/5',
    activeBorder: 'border-teal-400',
    glow: 'shadow-[0_0_25px_rgba(20,184,166,0.35)]'
  },
  { 
    href: '/history', 
    label: 'Field History', 
    icon: History, 
    color: 'text-indigo-400', 
    iconBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    activeGradient: 'from-indigo-500/30 via-blue-500/20 to-indigo-500/5',
    activeBorder: 'border-indigo-400',
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.35)]'
  },
  { 
    href: '/about', 
    label: 'Settings & Model', 
    icon: Settings, 
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
    activeGradient: 'from-orange-500/30 via-amber-500/20 to-orange-500/5',
    activeBorder: 'border-orange-400',
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.35)]'
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 bg-gradient-to-b from-[#080f1b]/95 via-[#060a12]/95 to-[#08101a]/95 text-white">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-cyan-500/25 to-purple-500/30 border border-emerald-400/50 text-emerald-300 group-hover:scale-105 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SkyCrop<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400"> Health</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-emerald-400/80 font-mono font-medium">Precision Agriculture AI</p>
          </div>
        </Link>

        {/* Aerospace System Telemetry Status Pill */}
        <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/25 font-mono text-[10px] shadow-inner">
          <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              TELEMETRY HUD
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">ONLINE</span>
          </div>
          <div className="text-gray-400 text-[9px] flex items-center justify-between">
            <span>S2B-MSI 10M</span>
            <span className="text-cyan-400/70">38ms STAC</span>
          </div>
        </div>

        {/* Vertical Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDiagnose = item.href === '/diagnose' && location.pathname === '/diagnose';
            const isActive = location.pathname === item.href || (isDiagnose && item.href.startsWith('/diagnose'));

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <div
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-all duration-300 group border',
                    isActive
                      ? cn('bg-gradient-to-r text-white font-bold border-l-4 shadow-lg scale-[1.02]', item.activeGradient, item.activeBorder, item.glow)
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/15 border-transparent hover:scale-[1.01]'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-sm border',
                      item.iconBg,
                      isActive ? 'ring-2 ring-white/20' : ''
                    )}>
                      <Icon className={cn('w-4 h-4 shrink-0', item.color)} />
                    </div>
                    <span className={cn('truncate font-medium', isActive ? 'text-white font-bold' : 'group-hover:text-white')}>
                      {item.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Account / Green Farmer Profile */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-[#0c1420] border border-emerald-500/30 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-[2px] shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full rounded-full bg-[#081018] flex items-center justify-center text-emerald-400 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.email ? user.email.split('@')[0] : 'Green Farmer'}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-semibold">Pro Agronomist</span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-60 border-r border-white/10 shadow-2xl backdrop-blur-xl">
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 bg-[#080d18]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Satellite className="w-5 h-5" />
          </div>
          <span className="font-display text-base font-bold text-white">
            SkyCrop<span className="text-emerald-400"> Health</span>
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="fixed inset-y-0 left-0 w-64 bg-[#080d18] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-display text-base font-bold text-white">
                SkyCrop<span className="text-emerald-400"> Health</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-8 w-8"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
