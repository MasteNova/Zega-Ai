import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Banknote, ShieldAlert, BookOpen, Bookmark, Info, Settings, LogIn, Menu, X, Mountain, WifiOff, LayoutDashboard } from 'lucide-react';
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

      <header className="sticky top-0 z-[1000] bg-ivory/95 backdrop-blur border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <button className="md:hidden p-1" aria-label="Menu" onClick={() => setDrawer(true)}><Menu size={22} /></button>
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-forest text-lg">
            <Mountain size={22} className="text-terra" /> Zega-AI
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
            {[...bottom.slice(1), ...more.slice(0, 2)].map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) =>
                clsx('px-3 py-1.5 rounded-lg font-medium', isActive ? 'bg-forest text-ivory' : 'text-ink/70 hover:bg-forest-100')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <select aria-label={t('language')} value={lang} onChange={(e) => setLang(e.target.value as Lang)}
              className="text-xs rounded-lg border border-forest/20 bg-white px-2 py-1.5">
              <option value="en">EN</option><option value="am">አማ</option><option value="gamo">Gamo</option>
            </select>
            {staff && (
              <Link to="/admin" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-forest px-2 py-1.5 rounded-lg hover:bg-forest-100">
                <LayoutDashboard size={16} /> {t('admin')}
              </Link>
            )}
            {!session && (
              <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium text-forest px-2 py-1.5 rounded-lg hover:bg-forest-100">
                <LogIn size={16} /> <span className="hidden sm:inline">{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-24 md:pb-10">{children}</main>

      <footer className="hidden md:block border-t border-forest/10 text-xs text-ink/50 py-4 text-center">
        Zega-AI · Map data © OpenStreetMap contributors · Prices are local estimates, not guarantees.
      </footer>

      {/* mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-[1000] bg-white border-t border-forest/10 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
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
