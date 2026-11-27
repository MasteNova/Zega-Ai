import { Link } from 'react-router-dom';
import { Sparkles, Map, Banknote, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listDestinations } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import DestinationCard from '../components/DestinationCard';
import { Card, Skeleton, ErrorState, Badge } from '../components/ui';
import { useI18n } from '../i18n';

export default function Home() {
  const { t } = useI18n();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });

  const actions = [
    { to: '/planner', icon: Sparkles, title: t('planner'), desc: 'Budget-aware AI itineraries for Arba Minch.' },
    { to: '/map', icon: Map, title: t('map'), desc: 'Lakes, park, markets and viewpoints.' },
    { to: '/fares', icon: Banknote, title: t('fares'), desc: 'Check bajaj quotes against local estimates.' },
    { to: '/phrases', icon: BookOpen, title: t('phrases'), desc: 'English · Amharic · Gamo phrasebook.' },
    { to: '/safety', icon: ShieldAlert, title: t('safety'), desc: 'SOS alerts to Zega responders.' }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-forest text-ivory p-6 md:p-10">
        <Badge tone="gold">Arba Minch · Ethiopia</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3 max-w-2xl leading-tight">
          Explore the land of forty springs, intelligently.
        </h1>
        <p className="mt-3 text-ivory/80 max-w-xl text-sm md:text-base">
          Plan by budget, travel by fair estimates, speak a little Gamo, and stay safer —
          even when the network drops.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/planner" className="inline-flex items-center gap-2 bg-gold text-ink font-semibold rounded-lg px-5 py-3 text-sm hover:bg-gold/80">
            {t('generate')} <ArrowRight size={16} />
          </Link>
          <Link to="/explore" className="inline-flex items-center gap-2 border border-ivory/30 rounded-lg px-5 py-3 text-sm font-semibold hover:bg-forest-600">
            {t('explore')}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <a.icon size={22} className={a.to === '/safety' ? 'text-terra-700' : 'text-forest'} />
              <p className="font-semibold text-sm mt-2">{a.title}</p>
              <p className="text-xs text-ink/50 mt-1 hidden md:block">{a.desc}</p>
            </Card>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold text-forest">Featured destinations</h2>
          <Link to="/explore" className="text-sm text-terra-700 font-medium hover:underline">{t('explore')} →</Link>
        </div>
        {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64" />)}</div>}
        {error && <ErrorState message={friendlyError(error)} onRetry={() => refetch()} />}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.slice(0, 4).map((d) => <DestinationCard key={d.id} d={d} />)}
          </div>
        )}
      </section>
    </div>
  );
}
