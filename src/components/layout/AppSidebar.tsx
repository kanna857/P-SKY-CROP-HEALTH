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
  ShieldCheck
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
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, color: 'text-emerald-400' },
  { href: '/diagnose', label: 'AI Disease Scanner', icon: Scan, color: 'text-amber-400', badge: '38 Crops' },
  { href: '/analyze', label: 'Satellite Multi-Index', icon: Satellite, color: 'text-cyan-400', badge: '5 Bands' },
  { href: '/dashboard', label: 'Farm Dashboard', icon: LayoutDashboard, color: 'text-violet-400' },
  { href: '/compare', label: 'Compare Fields', icon: BarChart2, color: 'text-pink-400' },
  { href: '/chatbot', label: 'AI Agronomist Voice', icon: Bot, color: 'text-teal-400', badge: '8 Langs' },
  { href: '/history', label: 'Field History', icon: History, color: 'text-indigo-400', badge: 'Search' },
  { href: '/about', label: 'Settings & Model', icon: Settings, color: 'text-gray-400' },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 bg-[#080d18] text-white">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-teal-500/20 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SkyCrop<span className="text-emerald-400"> Health</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-gray-400 font-mono">Precision Agriculture AI</p>
          </div>
        </Link>

        {/* Vertical Navigation */}
        <nav className="space-y-1">
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
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent text-white font-bold border-l-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      'p-1 rounded-lg transition-transform group-hover:scale-110',
                      isActive ? 'bg-white/10' : 'bg-transparent'
                    )}>
                      <Icon className={cn('w-4 h-4 shrink-0', item.color)} />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Account / Green Farmer Profile */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0c1420] to-[#0c1420] border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.email ? user.email.split('@')[0] : 'Green Farmer'}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-semibold">Pro Agronomist</span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
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
