import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Volume2, Repeat, Search, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import clsx from 'clsx';
import { listPhrases } from '../lib/api';
import { readCache, writeCache } from '../lib/cache';
import { friendlyError } from '../lib/supabase';
import { PageTitle, Card, Badge, Skeleton, ErrorState, EmptyState, Input, Modal } from '../components/ui';
import type { Phrase } from '../types';
import { useI18n } from '../i18n';

const CATS = ['all', 'greetings', 'transportation', 'directions', 'market', 'shopping', 'food', 'hotels', 'emergency', 'general'];

export default function Phrasebook() {
  const { t } = useI18n();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['phrases'], queryFn: listPhrases });
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const [showCard, setShowCard] = useState<Phrase | null>(null);
  const [loop, setLoop] = useState(false);
  const [favs, setFavs] = useState<string[]>(() => readCache<string[]>('fav-phrases') ?? []);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const toggleFav = (id: string) => {
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    setFavs(next); writeCache('fav-phrases', next);
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data ?? []).filter((p) =>
      (cat === 'all' || p.category === cat) &&
      (!onlyFavs || favs.includes(p.id)) &&
      (!needle || [p.english, p.amharic, p.gamo, p.transliteration].some((x) => x?.toLowerCase().includes(needle))));
  }, [data, q, cat, onlyFavs, favs]);

  return (
    <div className="max-w-2xl">
      <PageTitle title="Gamo · Amharic · English phrasebook" sub="Gamo text and native audio are added after speaker verification — nothing here is machine-invented." />
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <Input aria-label={t('search')} placeholder={`${t('search')}…`} value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button onClick={() => setOnlyFavs(!onlyFavs)} className={clsx('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1', onlyFavs ? 'bg-gold text-ink border-gold' : 'bg-white border-forest/20')}>
          <Star size={12} /> {t('favorites')}
        </button>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={clsx('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border capitalize', cat === c ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>
            {c === 'all' ? t('all') : c}
          </button>
        ))}
      </div>

      {isLoading && <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>}
      {error && <ErrorState message={friendlyError(error)} onRetry={() => refetch()} />}
      {data && filtered.length === 0 && <EmptyState title="No phrases found" />}
      <div className="space-y-2">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(open === p.id ? null : p.id)}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.english}</p>
                <p className="text-xs text-ink/50 capitalize">{p.category}</p>
              </div>
              <span onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }} role="button" aria-label="Favorite" className="p-1">
                <Star size={18} className={favs.includes(p.id) ? 'fill-gold text-gold' : 'text-ink/30'} />
              </span>
              {open === p.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {open === p.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-forest/10 pt-3">
                <div>
                  <p className="text-xs text-ink/50">Amharic</p>
                  <p className="text-lg font-semibold">{p.amharic ?? '—'}</p>
                  {p.transliteration && <p className="text-xs text-ink/50 italic">{p.transliteration}</p>}
                </div>
                <div>
                  <p className="text-xs text-ink/50">Gamo {p.dialect ? `(${p.dialect})` : ''}</p>
                  {p.gamo
                    ? <p className="text-lg font-semibold">{p.gamo}</p>
                    : <Badge tone="gold">Gamo translation pending native-speaker verification</Badge>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {p.verification_status === 'verified' ? <Badge tone="green">Verified</Badge> : <Badge tone="gold">Unverified</Badge>}
                  {p.notes && <span className="text-xs text-ink/50 flex-1">{p.notes}</span>}
                  <button type="button" onClick={() => setShowCard(p)}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg border border-forest/20 px-2.5 py-1 text-xs font-medium text-forest hover:bg-forest-100">
                    <Maximize2 size={13} /> Show driver / vendor
                  </button>
                </div>
                {p.audio_url ? (
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-forest" />
                    <audio controls loop={loop} src={p.audio_url} className="h-9 flex-1" preload="none" />
                    <button onClick={() => setLoop(!loop)} aria-label="Repeat audio"
                      className={clsx('p-2 rounded-lg border', loop ? 'bg-forest text-ivory border-forest' : 'border-forest/20')}>
                      <Repeat size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-ink/50">🎙 Audio not yet recorded. Native-speaker recordings are uploaded via Admin → Phrases.</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
      {showCard && (
        <Modal title={showCard.english} onClose={() => setShowCard(null)}>
          <div className="space-y-5 py-2 text-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/50">Amharic</p>
              <p className="text-3xl font-bold text-forest mt-1">{showCard.amharic ?? '—'}</p>
              {showCard.transliteration && <p className="text-sm text-ink/60 italic mt-1">{showCard.transliteration}</p>}
            </div>
            <div className="border-t border-forest/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-ink/50">Gamo {showCard.dialect ? `(${showCard.dialect})` : ''}</p>
              <p className="text-3xl font-bold text-terra-700 mt-1">{showCard.gamo ?? 'Pending native verification'}</p>
            </div>
            {showCard.audio_url && (
              <audio controls src={showCard.audio_url} className="w-full" preload="none" />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
