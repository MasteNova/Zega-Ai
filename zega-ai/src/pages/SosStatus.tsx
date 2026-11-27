import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, ShieldAlert, ExternalLink, XCircle } from 'lucide-react';
import { getLastSos, getSosStatus, cancelSos } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import { Button, Card, PageTitle, EmptyState, Badge, ErrorState } from '../components/ui';
import { dateTime, mapsLink } from '../lib/format';
import { useToast } from '../state/toast';

export default function SosStatus() {
  const last = getLastSos();
  const toast = useToast();
  const [cancelled, setCancelled] = useState(false);
  const q = useQuery({
    queryKey: ['sos-status', last?.id],
    queryFn: () => getSosStatus(last!.id, last!.access_token),
    enabled: Boolean(last),
    refetchInterval: 10000
  });

  useEffect(() => { if (q.data?.status === 'cancelled') setCancelled(true); }, [q.data?.status]);

  if (!last) return <EmptyState title="No SOS alert on this device"
    action={<Link to="/safety"><Button variant="secondary">Safety center</Button></Link>} />;

  const s = q.data?.status;
  const steps = [
    { key: 'sent', label: 'Transmitted to Zega responders', done: true, icon: CheckCircle2 },
    { key: 'ack', label: 'Acknowledged by a responder', done: s === 'acknowledged' || s === 'resolved', icon: Clock },
    { key: 'res', label: 'Resolved', done: s === 'resolved', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-xl space-y-4">
      <PageTitle title="SOS alert status" sub="Polls every 10 seconds while this page is open." />
      {q.error && <ErrorState message={friendlyError(q.error)} onRetry={() => q.refetch()} />}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-terra-700" />
          <span className="font-semibold">Alert {last.id.slice(0, 8)}…</span>
          {s && <Badge tone={s === 'resolved' ? 'green' : s === 'active' ? 'red' : s === 'cancelled' ? 'neutral' : 'gold'}>{s}</Badge>}
        </div>
        {cancelled || s === 'cancelled'
          ? <p className="text-sm text-ink/60 flex items-center gap-2"><XCircle size={16} /> This alert was cancelled.</p>
          : (
            <ol className="space-y-3">
              {steps.map((st) => (
                <li key={st.key} className="flex items-center gap-3 text-sm">
                  <st.icon size={18} className={st.done ? 'text-forest' : 'text-ink/30'} />
                  <span className={st.done ? 'font-medium' : 'text-ink/50'}>{st.label}</span>
                </li>
              ))}
            </ol>
          )}
        <div className="text-xs text-ink/60 space-y-1 border-t border-forest/10 pt-3">
          <p>Sent: {dateTime(last.created_at)}</p>
          <p>Location: {last.lat.toFixed(5)}, {last.lng.toFixed(5)} {last.accuracy ? `(±${Math.round(last.accuracy)} m)` : ''}</p>
          <a className="inline-flex items-center gap-1 text-forest underline" target="_blank" rel="noreferrer" href={mapsLink(last.lat, last.lng)}>
            <ExternalLink size={13} /> Open location in Google Maps
          </a>
        </div>
        <p className="text-xs text-ink/50">Acknowledgement means a Zega responder saw the alert — it does not guarantee emergency services dispatch.</p>
        {(s === 'active' || !s) && !cancelled && (
          <Button variant="secondary" onClick={async () => {
            try { await cancelSos(last.id, last.access_token); setCancelled(true); toast('Alert cancelled.', 'info'); }
            catch (e) { toast(friendlyError(e), 'error'); }
          }}>Cancel this alert</Button>
        )}
      </Card>
    </div>
  );
}
