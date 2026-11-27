import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, ShieldAlert, Lightbulb, Accessibility, ExternalLink, Mountain, ArrowLeft } from 'lucide-react';
import { getDestination } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import DestinationMap from '../components/DestinationMap';
import { Card, Badge, Skeleton, ErrorState, UnverifiedBadge, PageTitle } from '../components/ui';
import { range, mapsLink } from '../lib/format';
import { useI18n } from '../i18n';

export default function DestinationDetail() {
  const { id = '' } = useParams();
  const { t } = useI18n();
  const { data: d, isLoading, error, refetch } = useQuery({ queryKey: ['destination', id], queryFn: () => getDestination(id) });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-56" /><Skeleton className="h-8 w-64" /><Skeleton className="h-32" /></div>;
  if (error || !d) return <ErrorState message={friendlyError(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-5 max-w-3xl">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-terra-700 font-medium"><ArrowLeft size={15} /> {t('explore')}</Link>
      <div className="rounded-2xl overflow-hidden h-56 bg-forest flex items-center justify-center">
        {d.image_url ? <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" /> : <Mountain size={56} className="text-ivory/40" />}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PageTitle title={d.name} sub={d.city} />
        <div className="mb-5 flex gap-2"><UnverifiedBadge verified={d.is_verified} />{d.category_id && <Badge>{d.category_id}</Badge>}</div>
      </div>
      <p className="text-ink/80">{d.description}</p>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <Card className="p-4 flex items-center gap-3"><Clock size={18} className="text-forest" />
          <div><p className="text-xs text-ink/50">Suggested visit</p><p className="font-semibold">{d.visit_minutes} min{d.opening_hours ? ` · ${d.opening_hours}` : ''}</p></div></Card>
        <Card className="p-4 flex items-center gap-3"><MapPin size={18} className="text-forest" />
          <div><p className="text-xs text-ink/50">Entry fee ({t('estimated')})</p>
            <p className="font-semibold">{d.entry_fee_min != null ? range(Number(d.entry_fee_min), Number(d.entry_fee_max ?? d.entry_fee_min)) : 'No fee data'}</p></div></Card>
      </div>

      {d.safety_notes && <Card className="p-4 text-sm"><p className="font-semibold text-terra-700 flex items-center gap-2 mb-1"><ShieldAlert size={16} /> Safety</p><p className="text-ink/70">{d.safety_notes}</p></Card>}
      {d.local_tips && <Card className="p-4 text-sm"><p className="font-semibold text-forest flex items-center gap-2 mb-1"><Lightbulb size={16} /> Local tips</p><p className="text-ink/70">{d.local_tips}</p></Card>}
      {d.accessibility && <Card className="p-4 text-sm"><p className="font-semibold text-forest flex items-center gap-2 mb-1"><Accessibility size={16} /> Accessibility</p><p className="text-ink/70">{d.accessibility}</p></Card>}

      <DestinationMap destinations={[d]} height="40vh" showLocate={false} />
      <div className="flex flex-wrap gap-3">
        <a href={mapsLink(d.lat, d.lng)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-forest underline">
          <ExternalLink size={15} /> {t('openMap')}
        </a>
        <Link to="/planner" className="text-sm font-medium text-terra-700 underline">Add to a plan → {t('planner')}</Link>
      </div>
      {d.last_verified_at && <p className="text-xs text-ink/40">Last verified: {new Date(d.last_verified_at).toLocaleDateString()}</p>}
    </div>
  );
}
