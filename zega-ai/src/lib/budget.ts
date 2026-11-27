import type { ItineraryStop, ItineraryPayload } from '../types';

export function computeTotals(stops: ItineraryStop[]): ItineraryPayload['totals'] {
  const sum = (k: keyof Pick<ItineraryStop, 'entryMin' | 'entryMax' | 'transportMin' | 'transportMax'>) =>
    stops.reduce((a, s) => a + s[k], 0);
  const entryMin = sum('entryMin'), entryMax = sum('entryMax');
  const transportMin = sum('transportMin'), transportMax = sum('transportMax');
  return { entryMin, entryMax, transportMin, transportMax, totalMin: entryMin + transportMin, totalMax: entryMax + transportMax };
}

export function remaining(budget: number, totals: ItineraryPayload['totals']) {
  return { remainingMin: budget - totals.totalMax, remainingMax: budget - totals.totalMin };
}
