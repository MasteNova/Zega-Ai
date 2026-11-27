export type FareVerdict = 'below' | 'within' | 'above' | 'no_data';

export interface FareResult { verdict: FareVerdict; min: number | null; max: number | null; }

/** Pure comparison logic. Estimates only — never claims official fairness. */
export function compareQuote(
  quote: number,
  fareMin: number | null,
  fareMax: number | null
): FareResult {
  if (fareMin == null || fareMax == null || !Number.isFinite(quote) || quote <= 0)
    return { verdict: 'no_data', min: fareMin, max: fareMax };
  if (quote < fareMin) return { verdict: 'below', min: fareMin, max: fareMax };
  if (quote > fareMax) return { verdict: 'above', min: fareMin, max: fareMax };
  return { verdict: 'within', min: fareMin, max: fareMax };
}
