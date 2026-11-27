import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Banknote, CheckCircle2, TrendingDown, TrendingUp, HelpCircle } from 'lucide-react';
import { listRoutes, submitFareFeedback } from '../lib/api';
import { compareQuote, type FareVerdict } from '../lib/fare';
import { friendlyError } from '../lib/supabase';
import { Button, Card, Input, Select, Textarea, PageTitle, Skeleton, ErrorState, Badge, UnverifiedBadge } from '../components/ui';
import { range } from '../lib/format';
import { useI18n } from '../i18n';
import { useToast } from '../state/toast';

const verdictUI: Record<FareVerdict, { label: string; tone: 'green' | 'gold' | 'red' | 'neutral'; icon: typeof CheckCircle2; note: string }> = {
  below: { label: 'Below estimated range', tone: 'gold', icon: TrendingDown, note: 'Lower than typical estimates — great, but confirm what is included (private vs shared).' },
  within: { label: 'Within estimated range', tone: 'green', icon: CheckCircle2, note: 'This quote is inside the local estimate range.' },
  above: { label: 'Above estimated range', tone: 'red', icon: TrendingUp, note: 'Higher than typical estimates. Polite negotiation is normal; night/luggage can raise prices.' },
  no_data: { label: 'No verified fare data', tone: 'neutral', icon: HelpCircle, note: 'We have no reference range for this route yet. Ask locals and please submit feedback.' }
};

export default function Fares() {
  const { t } = useI18n();
  const toast = useToast();
  const { data: routes, isLoading, error, refetch } = useQuery({ queryKey: ['routes'], queryFn: listRoutes });
  const [routeId, setRouteId] = useState('');
  const [quote, setQuote] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [paid, setPaid] = useState('');
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const route = useMemo(() => routes?.find((r) => r.id === routeId) ?? null, [routes, routeId]);
  const result = route && quote ? compareQuote(Number(quote), route.fare_min != null ? Number(route.fare_min) : null, route.fare_max != null ? Number(route.fare_max) : null) : null;

  const feedback = async () => {
    if (!route || !quote) return;
    try {
      await submitFareFeedback({
        route_id: route.id, quoted_price: Number(quote),
        paid_price: paid ? Number(paid) : null, passenger_count: passengers, comment
      });
      setSent(true);
      toast('Thank you — feedback queued for moderation. It will not change reference prices automatically.', 'success');
    } catch (e) { toast(friendlyError(e), 'error'); }
  };

  return (
    <div className="max-w-2xl">
      <PageTitle title="Bajaj fair-price assistant" sub="Local estimates only — not official or guaranteed prices." />
      {isLoading && <Skeleton className="h-72" />}
      {error && <ErrorState message={friendlyError(error)} onRetry={() => refetch()} />}
      {routes && (
        <Card className="p-5 space-y-4">
          <Select label="Route" value={routeId} onChange={(e) => { setRouteId(e.target.value); setSent(false); }}>
            <option value="">Select origin → destination…</option>
            {routes.map((r) => <option key={r.id} value={r.id}>{r.origin} → {r.destination} ({r.vehicle_type})</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('quote')} type="number" min={1} value={quote} onChange={(e) => setQuote(e.target.value)} />
            <Input label={t('passengers')} type="number" min={1} max={20} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
          </div>

          {route && (
            <div className="text-xs text-ink/60 space-y-1">
              <div className="flex flex-wrap gap-2 items-center">
                <UnverifiedBadge verified={route.is_verified} />
                <Badge>{route.confidence}</Badge>
                {route.source && <span>Source: {route.source}</span>}
              </div>
              {route.fare_min != null && route.fare_max != null && <p>Reference estimate: <strong>{range(Number(route.fare_min), Number(route.fare_max))}</strong>{route.distance_km ? ` · ~${route.distance_km} km` : ''}</p>}
              {route.conditions && <p>{route.conditions}</p>}
            </div>
          )}

          {result && (() => {
            const ui = verdictUI[result.verdict];
            return (
              <div className={`rounded-xl p-4 border ${ui.tone === 'green' ? 'bg-forest-100 border-forest/20' : ui.tone === 'red' ? 'bg-terra-100 border-terra/30' : ui.tone === 'gold' ? 'bg-gold-100 border-gold' : 'bg-ivory-dark border-forest/10'}`}>
                <p className="font-semibold flex items-center gap-2"><ui.icon size={18} /> {ui.label}</p>
                <p className="text-sm text-ink/70 mt-1">{ui.note}</p>
                <p className="text-xs text-ink/50 mt-2 flex items-center gap-1"><Banknote size={12} /> Estimates, not guarantees. Conditions (night, rain, luggage) change real prices.</p>
              </div>
            );
          })()}

          {route && quote && !sent && (
            <div className="border-t border-forest/10 pt-4 space-y-3">
              <p className="text-sm font-medium">{t('feedback')} — helps improve estimates</p>
              <Input label="What did you actually pay? (optional)" type="number" min={0} value={paid} onChange={(e) => setPaid(e.target.value)} />
              <Textarea label="Comment (optional)" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button variant="secondary" onClick={feedback}>{t('feedback')}</Button>
            </div>
          )}
          {sent && <p className="text-sm text-forest font-medium">Feedback submitted — pending moderation. ✓</p>}
        </Card>
      )}
    </div>
  );
}
