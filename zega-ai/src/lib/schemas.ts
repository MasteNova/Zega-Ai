import { z } from 'zod';

export const itineraryInputSchema = z.object({
  city: z.string().min(2).max(80),
  budgetEtb: z.number().positive('Budget must be positive').max(1_000_000),
  hours: z.number().min(1).max(12),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM'),
  startLocation: z.string().min(1, 'Starting location required').max(120),
  interests: z.array(z.string()).max(8),
  groupSize: z.number().int().min(1).max(20),
  travelStyle: z.enum(['relaxed', 'balanced', 'packed']),
  transport: z.enum(['bajaj', 'taxi', 'foot', 'any'])
});

const stopSchema = z.object({
  destinationId: z.string(), name: z.string(), lat: z.number(), lng: z.number(),
  arrive: z.string(), depart: z.string(), minutes: z.number(), activity: z.string(),
  description: z.string().optional(),
  entryMin: z.number().min(0), entryMax: z.number().min(0),
  transportMin: z.number().min(0), transportMax: z.number().min(0),
  foodMin: z.number().min(0).default(0), foodMax: z.number().min(0).default(0),
  otherMin: z.number().min(0).default(0), otherMax: z.number().min(0).default(0),
  isVerified: z.boolean()
});

export const itineraryPayloadSchema = z.object({
  title: z.string(), city: z.string(), source: z.enum(['ai', 'fallback']),
  budgetEtb: z.number(), startTime: z.string(), groupSize: z.number(),
  stops: z.array(stopSchema).min(1),
  totals: z.object({
    entryMin: z.number(), entryMax: z.number(),
    transportMin: z.number(), transportMax: z.number(),
    foodMin: z.number().default(0), foodMax: z.number().default(0),
    otherMin: z.number().default(0), otherMax: z.number().default(0),
    totalMin: z.number(), totalMax: z.number()
  }),
  remainingMin: z.number(), remainingMax: z.number(),
  tips: z.array(z.string()), safety: z.array(z.string()),
  alternatives: z.array(z.object({ id: z.string(), name: z.string() })),
  warnings: z.array(z.string())
});
