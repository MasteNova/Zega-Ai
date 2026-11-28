import type { ItineraryStop, ItineraryPayload } from '../types';

export function computeTotals(stops: ItineraryStop[]): ItineraryPayload['totals'] {
  const sum = (k: 'entryMin' | 'entryMax' | 'transportMin' | 'transportMax' | 'foodMin' | 'foodMax' | 'otherMin' | 'otherMax') =>
    stops.reduce((a, s) => a + (s[k] ?? 0), 0);
  const entryMin = sum('entryMin'), entryMax = sum('entryMax');
  const transportMin = sum('transportMin'), transportMax = sum('transportMax');
  const foodMin = sum('foodMin'), foodMax = sum('foodMax');
  const otherMin = sum('otherMin'), otherMax = sum('otherMax');
  return {
    entryMin, entryMax,
    transportMin, transportMax,
    foodMin, foodMax,
    otherMin, otherMax,
    totalMin: entryMin + transportMin + foodMin + otherMin,
    totalMax: entryMax + transportMax + foodMax + otherMax
  };
}

export function remaining(budget: number, totals: ItineraryPayload['totals']) {
  return { remainingMin: budget - totals.totalMax, remainingMax: budget - totals.totalMin };
}
