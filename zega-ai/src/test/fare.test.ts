import { describe, it, expect } from 'vitest';
import { compareQuote } from '../lib/fare';

describe('compareQuote', () => {
  it('flags below range', () => expect(compareQuote(30, 50, 120).verdict).toBe('below'));
  it('accepts within range inclusive', () => {
    expect(compareQuote(50, 50, 120).verdict).toBe('within');
    expect(compareQuote(120, 50, 120).verdict).toBe('within');
  });
  it('flags above range', () => expect(compareQuote(200, 50, 120).verdict).toBe('above'));
  it('returns no_data without reference', () => expect(compareQuote(100, null, null).verdict).toBe('no_data'));
  it('returns no_data for invalid quote', () => expect(compareQuote(0, 50, 120).verdict).toBe('no_data'));
});
