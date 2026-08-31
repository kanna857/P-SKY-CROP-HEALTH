import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Satellite, 
  Home, 
  Stethoscope, 
  Map, 
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
  Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diagnose', label: 'AI Disease Scanner', icon: Scan },
  { href: '/analyze', label: 'Satellite Analysis', icon: Satellite },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compare', label: 'Compare Fields', icon: BarChart2 },
  { href: '/chatbot', label: 'AI Agronomist', icon: Bot },
  { href: '/diagnose#prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/diagnose#radar', label: 'Weather Radar', icon: CloudSun },
  { href: '/analyze#history', label: 'Field History', icon: History },
  { href: '/about', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 bg-[#090e17] text-white">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Satellite className="w-5 h-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            SkyCrop<span className="text-emerald-400"> Health</span>
          </span>
        </Link>

        {/* Vertical Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDiagnose = item.href === '/diagnose' && location.pathname === '/diagnose';
            const isActive = location.pathname === item.href || isDiagnose;

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-emerald-400' : 'text-gray-400')} />
                  <span className="truncate">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Account / Green Farmer Profile */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.email ? user.email.split('@')[0] : 'Green Farmer'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">Premium Plan</p>
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
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-60 border-r border-white/10 shadow-2xl">
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 bg-[#090e17]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
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
          <div className="fixed inset-y-0 left-0 w-64 bg-[#090e17] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300">
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
