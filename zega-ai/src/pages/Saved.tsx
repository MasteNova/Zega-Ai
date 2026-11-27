import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Cloud, Smartphone } from 'lucide-react';
import { listSaved, deleteSaved, listDestinations } from '../lib/api';
import ItineraryView from '../components/ItineraryView';
import { PageTitle, Card, Button, EmptyState, Badge, Skeleton } from '../components/ui';
import { useAuth } from '../state/auth';
import { useToast } from '../state/toast';
import { dateTime, range } from '../lib/format';
import { friendlyError } from '../lib/supabase';
import type { SavedItinerary } from '../types';

export default function Saved() {
  const { session } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState<SavedItinerary | null>(null);
  const saved = useQuery({ queryKey: ['saved', session?.user.id], queryFn: () => listSaved(session?.user.id ?? null) });
  const { data: catalog = [] } = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });

  const remove = async (s: SavedItinerary) => {
    try {
      await deleteSaved(s.id, s.cloud);
      if (open?.id === s.id) setOpen(null);
      qc.invalidateQueries({ queryKey: ['saved'] });
      toast('Trip deleted.', 'info');
    } catch (e) { toast(friendlyError(e), 'error'); }
  };

  if (open) return (
    <div className="max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => setOpen(null)}>← Back to saved trips</Button>
      <ItineraryView plan={open.payload} catalog={catalog} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageTitle title="Saved trips" sub={session ? 'Synced to your account + stored on this device.' : 'Stored on this device. Sign in to sync across devices.'} />
      {saved.isLoading && <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>}
      {saved.data?.length === 0 && <EmptyState title="Nothing saved yet" hint="Generate an itinerary and tap Save."
        action={<Link to="/planner"><Button>Plan a trip</Button></Link>} />}
      <div className="space-y-3">
        {saved.data?.map((s) => (
          <Card key={s.id} className="p-4 flex items-center gap-3">
            <button className="flex-1 text-left" onClick={() => setOpen(s)}>
              <p className="font-semibold text-forest">{s.title}</p>
              <p className="text-xs text-ink/50 mt-0.5">{dateTime(s.created_at)} · {range(s.payload.totals.totalMin, s.payload.totals.totalMax)}</p>
              <div className="flex gap-2 mt-1.5">
                <Badge tone={s.payload.source === 'ai' ? 'green' : 'gold'}>{s.payload.source}</Badge>
                <Badge>{s.cloud ? <><Cloud size={11} /> synced</> : <><Smartphone size={11} /> device</>}</Badge>
              </div>
            </button>
            <button aria-label="Delete trip" onClick={() => remove(s)} className="p-2 text-ink/40 hover:text-terra-700"><Trash2 size={18} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}
