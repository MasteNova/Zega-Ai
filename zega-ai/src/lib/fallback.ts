import type { Destination, ItineraryInput, ItineraryPayload, ItineraryStop } from '../types';
import { computeTotals, remaining } from './budget';
import { toMin, toHHMM } from './format';

/**
 * Deterministic, rule-based planner used when AI is unavailable/offline.
 * Uses ONLY catalog destinations and their stored fees. Clearly labeled source:'fallback'.
 */
export function buildFallbackItinerary(dests: Destination[], input: ItineraryInput): ItineraryPayload {
  const active = dests.filter((d) => d.is_active && d.city.toLowerCase().includes(input.city.toLowerCase()));
  const scored = active
    .map((d) => ({ d, score: d.interests.filter((i) => input.interests.includes(i)).length }))
    .sort((a, b) => b.score - a.score || a.d.visit_minutes - b.d.visit_minutes);

  const maxMinutes = input.hours * 60;
  const stops: ItineraryStop[] = [];
  let elapsed = 0, spentMax = 0, cursor = toMin(input.startTime);

  for (const { d } of scored) {
    const travel = stops.length === 0 ? 10 : 20;
    const entryMin = Number(d.entry_fee_min ?? 0);
    const entryMax = Number(d.entry_fee_max ?? d.entry_fee_min ?? 0);
    const minutes = Math.min(d.visit_minutes, input.travelStyle === 'packed' ? d.visit_minutes : Math.ceil(d.visit_minutes * 0.8));
    if (elapsed + travel + minutes > maxMinutes) continue;
    if (spentMax + entryMax > input.budgetEtb) continue;
    cursor += travel;
    const arrive = toHHMM(cursor);
    cursor += minutes;
    stops.push({
      destinationId: d.id, name: d.name, lat: d.lat, lng: d.lng,
      arrive, depart: toHHMM(cursor), minutes,
      activity: d.description?.slice(0, 140) ?? `Visit ${d.name}.`,
      description: d.description ?? undefined,
      entryMin, entryMax, transportMin: 0, transportMax: 0, isVerified: d.is_verified
    });
    elapsed += travel + minutes;
    spentMax += entryMax;
    if (stops.length >= 5) break;
  }

  const totals = computeTotals(stops);
  const rem = remaining(input.budgetEtb, totals);
  const used = new Set(stops.map((s) => s.destinationId));

  return {
    title: `${input.city} highlights — ${input.hours}h plan`,
    city: input.city, source: 'fallback', budgetEtb: input.budgetEtb,
    startTime: input.startTime, groupSize: input.groupSize,
    stops, totals, ...rem,
    tips: ['Carry small bills for bajaj and markets.', 'Start early — midday heat is strong.', 'Ask your hotel to confirm current prices.'],
    safety: ['Stay with licensed guides in the park and on boats.', 'Wear a life jacket on Lake Chamo.'],
    alternatives: active.filter((d) => !used.has(d.id)).slice(0, 3).map((d) => ({ id: d.id, name: d.name })),
    warnings: [
      'AI was unavailable — this is a rule-based sample plan built from the destination catalog.',
      'Transport costs are NOT included in totals; use the Fair-Price checker per leg.',
      ...(stops.some((s) => !s.isVerified) ? ['Some entries use unverified demo data — confirm locally.'] : [])
    ]
  };
}
