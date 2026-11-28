import { Link } from 'react-router-dom';
import { Sparkles, AlertTriangle, Lightbulb, ShieldCheck, Repeat, ExternalLink, Navigation } from 'lucide-react';
import type { ItineraryPayload, Destination } from '../types';
import { Card, Badge, UnverifiedBadge } from './ui';
import DestinationMap from './DestinationMap';
import { etb, range, mapsLink, mapsDirLink } from '../lib/format';
import { useI18n } from '../i18n';

export default function ItineraryView({ plan, catalog }: { plan: ItineraryPayload; catalog: Destination[] }) {
  const { t } = useI18n();
  const byId = new Map(catalog.map((d) => [d.id, d]));
  const routeDests = plan.stops
    .map((s) => byId.get(s.destinationId))
    .filter((d): d is Destination => Boolean(d));

  const foodMin = plan.totals.foodMin ?? 0;
  const foodMax = plan.totals.foodMax ?? 0;
  const otherMin = plan.totals.otherMin ?? 0;
  const otherMax = plan.totals.otherMax ?? 0;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-forest flex-1">{plan.title}</h2>
          {plan.source === 'ai'
            ? <Badge tone="green"><Sparkles size={12} /> AI plan</Badge>
            : <Badge tone="gold"><Repeat size={12} /> Offline sample plan</Badge>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
          <div><p className="text-ink/50 text-xs">{t('budget')}</p><p className="font-semibold">{etb(plan.budgetEtb)}</p></div>
          <div><p className="text-ink/50 text-xs">{t('total')}</p><p className="font-semibold text-forest">{range(plan.totals.totalMin, plan.totals.totalMax)}</p></div>
          <div><p className="text-ink/50 text-xs">{t('remaining')}</p>
            <p className={`font-semibold ${plan.remainingMin < 0 ? 'text-terra-700' : 'text-forest'}`}>
              {range(plan.remainingMin, plan.remainingMax)}
            </p></div>
          <div><p className="text-ink/50 text-xs">Stops</p><p className="font-semibold">{plan.stops.length}</p></div>
        </div>

        {/* Full 4-category cost breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-forest/10 text-xs">
          <div className="rounded-lg bg-ivory p-2.5">
            <p className="text-ink/55">Entry fees</p>
            <p className="font-semibold text-forest mt-0.5">{range(plan.totals.entryMin, plan.totals.entryMax)}</p>
          </div>
          <div className="rounded-lg bg-ivory p-2.5">
            <p className="text-ink/55">Transport</p>
            <p className="font-semibold text-forest mt-0.5">{range(plan.totals.transportMin, plan.totals.transportMax)}</p>
          </div>
          <div className="rounded-lg bg-ivory p-2.5">
            <p className="text-ink/55">Food &amp; drinks</p>
            <p className="font-semibold text-forest mt-0.5">{range(foodMin, foodMax)}</p>
          </div>
          <div className="rounded-lg bg-ivory p-2.5">
            <p className="text-ink/55">Guides &amp; other</p>
            <p className="font-semibold text-forest mt-0.5">{range(otherMin, otherMax)}</p>
          </div>
        </div>

        {plan.warnings.length > 0 && (
          <div className="mt-4 rounded-lg bg-gold-100 p-3 text-xs text-terra-700 space-y-1">
            {plan.warnings.map((w, i) => <p key={i} className="flex gap-1.5"><AlertTriangle size={13} className="shrink-0 mt-0.5" />{w}</p>)}
          </div>
        )}
      </Card>

      {routeDests.length > 0 && (
        <DestinationMap destinations={routeDests} route={plan.stops.map((s) => ({ lat: s.lat, lng: s.lng }))} height="45vh" />
      )}

      <ol className="space-y-3">
        {plan.stops.map((s, i) => (
          <li key={i}>
            <Card className="p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-forest text-ivory flex items-center justify-center font-bold text-sm">{i + 1}</span>
                {i < plan.stops.length - 1 && <span className="flex-1 w-px bg-forest/20 mt-2" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-terra-700">{s.arrive}–{s.depart}</span>
                  <Link to={`/destination/${s.destinationId}`} className="font-display font-semibold text-forest hover:underline">{s.name}</Link>
                  <UnverifiedBadge verified={s.isVerified} />
                </div>
                <p className="text-sm text-ink/70 mt-1">{s.activity}</p>
                <div className="flex flex-wrap gap-2 mt-2.5 text-xs">
                  <Badge>{s.minutes} min</Badge>
                  {(s.entryMin > 0 || s.entryMax > 0) && <Badge tone="blue">Entry {range(s.entryMin, s.entryMax)}</Badge>}
                  {(s.transportMin > 0 || s.transportMax > 0) && <Badge tone="blue">Transport {range(s.transportMin, s.transportMax)}</Badge>}
                  {((s.foodMin ?? 0) > 0 || (s.foodMax ?? 0) > 0) && <Badge tone="gold">Food {range(s.foodMin ?? 0, s.foodMax ?? 0)}</Badge>}
                  {((s.otherMin ?? 0) > 0 || (s.otherMax ?? 0) > 0) && <Badge tone="neutral">Guide/other {range(s.otherMin ?? 0, s.otherMax ?? 0)}</Badge>}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 pt-2.5 border-t border-forest/10 text-xs font-medium">
                  <a
                    href={mapsLink(s.lat, s.lng, s.name, plan.city)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forest hover:underline"
                  >
                    <ExternalLink size={13} /> Open exact place in Google Maps
                  </a>
                  <a
                    href={mapsDirLink(s.lat, s.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-terra-700 hover:underline"
                  >
                    <Navigation size={13} /> GPS Directions
                  </a>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div className="grid md:grid-cols-2 gap-4">
        {plan.tips.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-forest flex items-center gap-2 mb-2"><Lightbulb size={16} /> {t('tips')}</h3>
            <ul className="text-sm text-ink/70 space-y-1 list-disc pl-4">{plan.tips.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </Card>
        )}
        {plan.safety.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-forest flex items-center gap-2 mb-2"><ShieldCheck size={16} /> {t('safetyNotes')}</h3>
            <ul className="text-sm text-ink/70 space-y-1 list-disc pl-4">{plan.safety.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </Card>
        )}
      </div>

      {plan.alternatives.length > 0 && (
        <div>
          <h3 className="font-semibold text-forest mb-2">{t('alternatives')}</h3>
          <div className="flex flex-wrap gap-2">
            {plan.alternatives.map((a) => (
              <Link key={a.id} to={`/destination/${a.id}`}><Badge tone="green">{a.name}</Badge></Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
