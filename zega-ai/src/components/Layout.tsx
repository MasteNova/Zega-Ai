import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home, Compass, Sparkles, Banknote, ShieldAlert, BookOpen, Bookmark,
  Info, Settings, LogIn, Menu, X, Mountain, WifiOff, LayoutDashboard, MapPin, PhoneCall
} from 'lucide-react';
import clsx from 'clsx';
import { useI18n, type Lang } from '../i18n';
import { useOnline } from '../state/online';
import { useAuth } from '../state/auth';

export default function Layout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const online = useOnline();
  const { session, profile } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const staff = profile?.role === 'admin' || profile?.role === 'responder';

  const bottom = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/explore', icon: Compass, label: t('explore') },
    { to: '/planner', icon: Sparkles, label: t('planner') },
    { to: '/fares', icon: Banknote, label: t('fares') },
    { to: '/safety', icon: ShieldAlert, label: t('safety') }
  ];
  const more = [
    { to: '/phrases', icon: BookOpen, label: t('phrases') },
    { to: '/saved', icon: Bookmark, label: t('saved') },
    { to: '/preferences', icon: Settings, label: t('preferences') },
    { to: '/about', icon: Info, label: t('about') }
  ];

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col">
      {!online && (
        <div className="bg-terra-700 text-white text-xs md:text-sm px-4 py-2 flex items-center gap-2 justify-center">
          <WifiOff size={14} /> {t('offline')}
        </div>
      )}
      {lang === 'gamo' && (
        <div className="bg-gold-100 text-terra-700 text-xs px-4 py-1.5 text-center">{t('gamoNotice')}</div>
      )}

      {/* Luxury Top Utility Bar (Desktop) */}
      <div className="hidden md:block bg-forest-700 text-ivory/80 text-xs border-b border-ivory/10">
        <div className="max-w-6xl mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-gold" /> Arba Minch · Gamo Zone, Ethiopia</span>
            <Link to="/safety" className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <PhoneCall size={12} className="text-gold" /> Emergency: 991 / 907
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gold transition-colors">{t('about')}</Link>
            <Link to="/preferences" className="hover:text-gold transition-colors">{t('preferences')}</Link>
            {staff && (
              <Link to="/admin" className="text-gold font-medium hover:underline inline-flex items-center gap-1">
                <LayoutDashboard size={12} /> {t('admin')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navbar */}
      <header className="sticky top-0 z-[1000] bg-ivory/90 backdrop-blur-md border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-forest-100" aria-label="Menu" onClick={() => setDrawer(true)}><Menu size={22} /></button>
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-forest text-xl tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-forest text-gold flex items-center justify-center shadow-sm">
              <Mountain size={20} />
            </span>
            <span>Zega<span className="text-terra-700">-AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
            {[...bottom.slice(1), ...more.slice(0, 2)].map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) =>
                clsx('px-3.5 py-2 rounded-full font-medium transition-colors',
                  isActive ? 'bg-forest text-ivory shadow-sm' : 'text-ink/75 hover:bg-forest-100 hover:text-forest')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <select aria-label={t('language')} value={lang} onChange={(e) => setLang(e.target.value as Lang)}
              className="text-xs font-medium rounded-full border border-forest/20 bg-white px-3 py-1.5 focus:outline-none focus:border-forest">
              <option value="en">EN</option><option value="am">አማ</option><option value="gamo">Gamo</option>
            </select>
            {!session && (
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest px-3 py-2 rounded-full border border-forest/20 hover:bg-forest-100 transition-colors">
                <LogIn size={14} /> <span className="hidden sm:inline">{t('login')}</span>
              </Link>
            )}
            <Link to="/planner" className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-gold text-ink px-4 py-2 text-xs font-semibold hover:bg-gold/85 shadow-sm transition-colors">
              <Sparkles size={14} /> {t('planner')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-7 pb-24 md:pb-12">{children}</main>

      {/* Luxury Multi-Column Footer (Desktop) */}
      <footer className="hidden md:block bg-forest-700 text-ivory/80 border-t border-ivory/10 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-4 gap-8 text-xs">
          <div className="col-span-2 space-y-2.5">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-ivory">
              <Mountain size={20} className="text-gold" /> Zega-AI · Arba Minch
            </div>
            <p className="text-ivory/70 leading-relaxed max-w-md">
              An intelligent, honest travel companion for Arba Minch and the Gamo Zone — combining catalog-grounded AI itineraries,
              fair transport estimates, Amharic &amp; Gamo phrases, and offline-ready safety.
            </p>
            <p className="text-ivory/45 pt-1">Map data © OpenStreetMap contributors · Prices are local estimates, not guarantees.</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gold uppercase tracking-wider text-[11px]">Explore</p>
            <ul className="space-y-1.5">
              <li><Link to="/explore" className="hover:text-ivory">Destinations</Link></li>
              <li><Link to="/planner" className="hover:text-ivory">AI Trip Planner</Link></li>
              <li><Link to="/fares" className="hover:text-ivory">Fair-Price Checker</Link></li>
              <li><Link to="/phrases" className="hover:text-ivory">Gamo &amp; Amharic Phrasebook</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gold uppercase tracking-wider text-[11px]">Support &amp; Safety</p>
            <ul className="space-y-1.5">
              <li><Link to="/safety" className="hover:text-ivory">Emergency &amp; SOS</Link></li>
              <li><Link to="/saved" className="hover:text-ivory">Saved Trips</Link></li>
              <li><Link to="/preferences" className="hover:text-ivory">Language &amp; Offline Cache</Link></li>
              <li><Link to="/about" className="hover:text-ivory">Honesty &amp; Data Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-[1000] bg-white/95 backdrop-blur border-t border-forest/10 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {bottom.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) =>
            clsx('flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium',
              isActive ? 'text-forest' : 'text-ink/50', n.to === '/safety' && 'text-terra-700')}>
            <n.icon size={20} /> {n.label}
          </NavLink>
        ))}
      </nav>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[1100] bg-ink/50 md:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-ivory p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-display font-bold text-forest">Zega-AI</span>
              <button aria-label="Close menu" onClick={() => setDrawer(false)}><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {[...bottom, ...more].map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setDrawer(false)}
                  className={({ isActive }) => clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                    isActive ? 'bg-forest text-ivory' : 'hover:bg-forest-100')}>
                  <n.icon size={18} /> {n.label}
                </NavLink>
              ))}
              {staff && (
                <NavLink to="/admin" onClick={() => setDrawer(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-forest-100">
                  <LayoutDashboard size={18} /> {t('admin')}
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
