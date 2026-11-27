import { describe, it, expect } from 'vitest';
import { computeTotals, remaining } from '../lib/budget';
import type { ItineraryStop } from '../types';

const stop = (a: number, b: number, c: number, d: number): ItineraryStop => ({
  destinationId: 'x', name: 'X', lat: 6, lng: 37.5, arrive: '08:00', depart: '09:00',
  minutes: 60, activity: '', entryMin: a, entryMax: b, transportMin: c, transportMax: d, isVerified: false
});

describe('budget math', () => {
  it('sums entries and transport', () => {
    const t = computeTotals([stop(100, 150, 50, 120), stop(0, 0, 30, 80)]);
    expect(t.totalMin).toBe(180);
    expect(t.totalMax).toBe(350);
  });
  it('computes remaining against budget', () => {
    const t = computeTotals([stop(100, 150, 50, 120)]);
    const r = remaining(1500, t);
    expect(r.remainingMin).toBe(1230);
    expect(r.remainingMax).toBe(1350);
  });
  it('allows negative remaining (over budget signal)', () => {
    const r = remaining(100, computeTotals([stop(100, 150, 50, 120)]));
    expect(r.remainingMin).toBeLessThan(0);
  });
});
