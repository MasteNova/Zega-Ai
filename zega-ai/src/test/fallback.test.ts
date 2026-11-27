import { describe, it, expect } from 'vitest';
import { buildFallbackItinerary } from '../lib/fallback';
import type { Destination, ItineraryInput } from '../types';

const dest = (id: string, minutes: number, fee: number, interests: string[]): Destination => ({
  id, slug: id, name: id, city: 'Arba Minch', category_id: 'nature', description: '',
  lat: 6, lng: 37.5, entry_fee_min: fee, entry_fee_max: fee, currency: 'ETB',
  opening_hours: null, visit_minutes: minutes, safety_notes: null, accessibility: null,
  local_tips: null, image_url: null, interests, is_verified: false, last_verified_at: null, is_active: true
});

const input: ItineraryInput = {
  city: 'Arba Minch', budgetEtb: 300, hours: 4, startTime: '08:00', startLocation: 'Sikela',
  interests: ['nature'], groupSize: 1, travelStyle: 'balanced', transport: 'bajaj'
};

describe('fallback planner', () => {
  const catalog = [dest('a', 90, 100, ['nature']), dest('b', 90, 500, ['nature']), dest('c', 60, 50, ['culture'])];

  it('never exceeds budget', () => {
    const plan = buildFallbackItinerary(catalog, input);
    expect(plan.totals.totalMax).toBeLessThanOrEqual(300);
    expect(plan.stops.some((s) => s.destinationId === 'b')).toBe(false);
  });
  it('only uses catalog ids and labels source', () => {
    const plan = buildFallbackItinerary(catalog, input);
    expect(plan.source).toBe('fallback');
    plan.stops.forEach((s) => expect(catalog.map((d) => d.id)).toContain(s.destinationId));
    expect(plan.warnings.join(' ')).toContain('rule-based');
  });
  it('respects total time window', () => {
    const plan = buildFallbackItinerary(catalog, { ...input, hours: 1 });
    const total = plan.stops.reduce((a, s) => a + s.minutes, 0) + plan.stops.length * 20;
    expect(total).toBeLessThanOrEqual(60 + 10);
  });
});
