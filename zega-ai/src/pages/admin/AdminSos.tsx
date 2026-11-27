import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, BellRing } from 'lucide-react';
import clsx from 'clsx';
import { supabase, friendlyError } from '../../lib/supabase';
import { listSosAlerts, updateSosStatus } from '../../lib/api';
import { Button, Card, Badge, Skeleton, ErrorState, EmptyState } from '../../components/ui';
import DestinationMap from '../../components/DestinationMap';
import { dateTime, mapsLink } from '../../lib/format';
import { useToast } from '../../state/toast';
import type { SosAlert, Destination } from '../../types';

const tone = (s: SosAlert['status']) => s === 'active' ? 'red' : s === 'acknowledged' ? 'gold' : s === 'resolved' ? 'green' : 'neutral';

export default function AdminSos() {
  const toast = useToast();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'all' | SosAlert['status']>('all');
  const q = useQuery({ queryKey: ['sos-alerts'], queryFn: listSosAlerts, refetchInterval: 30000 });

  useEffect(() => {
    if (!supabase) return;
    const ch = supabase.channel('sos-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sos_alerts' }, (payload) => {
        qc.invalidateQueries({ queryKey: ['sos-alerts'] });
        if (payload.eventType === 'INSERT') toast('🚨 NEW SOS ALERT received', 'error');
      })
      .subscribe();
    return () => { supabase?.removeChannel(ch); };
  }, [qc, toast]);

  const act = async (a: SosAlert, status: SosAlert['status']) => {
    const note = window.prompt(`Note for "${status}" (optional):`) ?? '';
    try {
      await updateSosStatus(a.id, status, note);
      qc.invalidateQueries({ queryKey: ['sos-alerts'] });
      toast(`Alert ${status}.`, 'success');
    } catch (e) { toast(friendlyError(e), 'error'); }
  };

  const alerts = (q.data ?? []).filter((a) => filter === 'all' || a.status === filter);
  const activeMarkers: Destination[] = alerts
    .filter((a) => a.status === 'active' || a.status === 'acknowledged')
    .map((a) => ({
      id: a.id, slug: a.id, name: `SOS ${a.id.slice(0, 6)} (${a.status})`, city: '', category_id: null,
      description: a.message, lat: a.lat, lng: a.lng, entry_fee_min: null, entry_fee_max: null,
      currency: 'ETB', opening_hours: null, visit_minutes: 0, safety_notes: null, accessibility: null,
      local_tips: null, image_url: null, interests: [], is_verified: true, last_verified_at: null, is_active: true
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <BellRing size={18} className="text-terra-700" />
        <h2 className="font-display font-semibold text-lg text-forest flex-1">SOS alerts (live)</h2>
        {(['all', 'active', 'acknowledged', 'resolved', 'cancelled'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('rounded-full px-3 py-1 text-xs font-medium border capitalize', filter === f ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>
            {f}
          </button>
        ))}
      </div>

      {q.isLoading && <Skeleton className="h-64" />}
      {q.error && <ErrorState message={friendlyError(q.error)} onRetry={() => q.refetch()} />}
      {activeMarkers.length > 0 && <DestinationMap destinations={activeMarkers} height="40vh" showLocate={false} />}
      {q.data && alerts.length === 0 && <EmptyState title="No alerts in this view" />}

      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-ink/50">{a.id.slice(0, 8)}</span>
              <Badge tone={tone(a.status)}>{a.status}</Badge>
              <span className="text-xs text-ink/50">{dateTime(a.created_at)}</span>
              <span className="text-xs text-ink/50">±{a.accuracy_m ? Math.round(a.accuracy_m) : '?'} m GPS</span>
              <a href={mapsLink(a.lat, a.lng)} target="_blank" rel="noreferrer" className="text-xs text-forest underline inline-flex items-center gap-1">
                <ExternalLink size={12} /> {a.lat.toFixed(5)}, {a.lng.toFixed(5)}
              </a>
            </div>
            {a.message && <p className="text-sm text-ink/70 mt-2">“{a.message}”</p>}
            <div className="flex gap-2 mt-3">
              {a.status === 'active' && <Button onClick={() => act(a, 'acknowledged')}>Acknowledge</Button>}
              {(a.status === 'active' || a.status === 'acknowledged') && (
                <Button variant="secondary" onClick={() => act(a, 'resolved')}>Resolve</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
