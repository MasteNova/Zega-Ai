import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { List, Map as MapIcon, Search } from 'lucide-react';
import clsx from 'clsx';
import { listDestinations, listCategories } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import DestinationCard from '../components/DestinationCard';
import DestinationMap from '../components/DestinationMap';
import { PageBanner, Skeleton, ErrorState, EmptyState, Input } from '../components/ui';
import { useI18n } from '../i18n';

export default function Explore({ initialView = 'list' }: { initialView?: 'list' | 'map' }) {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [view, setView] = useState<'list' | 'map'>(initialView);
  const [q, setQ] = useState(() => params.get('q') ?? '');
  const [cat, setCat] = useState<string>('all');
  const dests = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });
  const cats = useQuery({ queryKey: ['categories'], queryFn: listCategories });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (dests.data ?? []).filter((d) =>
      (cat === 'all' || d.category_id === cat) &&
      (!needle || d.name.toLowerCase().includes(needle) || (d.description ?? '').toLowerCase().includes(needle)));
  }, [dests.data, q, cat]);

  return (
    <div>
      <PageBanner
        eyebrow="Explore Arba Minch"
        title={t('explore')}
        sub="Lakes, national parks, viewpoints, and Gamo highland culture — verified spots and live map pins."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/Arba_Minch,_Chamo_and_Abaya.jpg?width=1400"
      />
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <Input aria-label={t('search')} placeholder={`${t('search')}…`} value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex rounded-lg border border-forest/20 overflow-hidden self-start">
          {(['list', 'map'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={clsx('flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium',
                view === v ? 'bg-forest text-ivory' : 'bg-white text-ink/70')}>
              {v === 'list' ? <List size={15} /> : <MapIcon size={15} />}
              {v === 'list' ? t('viewList') : t('viewMap')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button onClick={() => setCat('all')} className={clsx('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border', cat === 'all' ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>{t('all')}</button>
        {(cats.data ?? []).map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={clsx('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border capitalize', cat === c.id ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>
            {c.name_en}
          </button>
        ))}
      </div>

      {dests.isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}</div>}
      {dests.error && <ErrorState message={friendlyError(dests.error)} onRetry={() => dests.refetch()} />}
      {dests.data && filtered.length === 0 && <EmptyState title="No destinations match" hint="Try a different search or category." />}
      {dests.data && filtered.length > 0 && (view === 'list'
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
        : <DestinationMap destinations={filtered} height="65vh" />)}
    </div>
  );
}
