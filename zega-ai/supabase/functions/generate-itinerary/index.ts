// Zega-AI secure AI endpoint. Gemini key lives ONLY here (Supabase secrets).
// Deploy: npx supabase functions deploy generate-itinerary --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { z } from 'npm:zod@3.23.8';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const Input = z.object({
  city: z.string().min(2).max(80).default('Arba Minch'),
  budgetEtb: z.number().positive().max(1_000_000),
  hours: z.number().min(1).max(12),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  startLocation: z.string().min(1).max(120),
  interests: z.array(z.string().max(30)).max(8).default([]),
  groupSize: z.number().int().min(1).max(20).default(1),
  travelStyle: z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
  transport: z.enum(['bajaj', 'taxi', 'foot', 'any']).default('bajaj')
});

const AiPlan = z.object({
  title: z.string().min(3).max(120),
  stops: z.array(z.object({
    destination_id: z.string().uuid(),
    minutes: z.number().int().min(5).max(480),
    activity: z.string().max(300),
    transport_cost_min: z.number().min(0).max(100_000).default(0),
    transport_cost_max: z.number().min(0).max(100_000).default(0),
    food_cost_min: z.number().min(0).max(100_000).default(0),
    food_cost_max: z.number().min(0).max(100_000).default(0),
    other_cost_min: z.number().min(0).max(100_000).default(0),
    other_cost_max: z.number().min(0).max(100_000).default(0)
  })).min(1).max(8),
  tips: z.array(z.string().max(300)).max(6).default([]),
  safety: z.array(z.string().max(300)).max(6).default([]),
  alternatives: z.array(z.string().uuid()).max(4).default([])
});

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const toHHMM = (m: number) =>
  `${String(Math.floor((m % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

let cachedModel: string | null = null;

async function listGeminiModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    headers: { 'x-goog-api-key': apiKey }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.models ?? [])
    .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m: any) => String(m.name).replace(/^models\//, ''));
}

async function callGemini(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
        })
      }
    );
    if (!res.ok) throw new Error(`gemini_http_${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('gemini_empty');
    return text;
  } finally { clearTimeout(timer); }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'invalid_input', detail: parsed.error.flatten() }, 400);
  const input = parsed.data;

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const [{ data: allowed }, { data: dests, error: dErr }] = await Promise.all([
    db.rpc('check_rate_limit', { p_key: `ai:${ip}`, p_max: 20, p_window_seconds: 3600 }),
    db.from('destinations').select('*').ilike('city', `%${input.city}%`).eq('is_active', true)
  ]);
  if (allowed === false) return json({ error: 'rate_limited' }, 429);
  if (dErr) return json({ error: 'db_error', detail: dErr.message }, 500);
  if (!dests?.length) return json({ error: 'no_destinations' }, 400);

  const catalog = dests.map((d) => ({
    id: d.id, name: d.name, category: d.category_id, interests: d.interests,
    lat: d.lat, lng: d.lng, opening_hours: d.opening_hours,
    visit_minutes: d.visit_minutes, entry_fee_min: d.entry_fee_min, entry_fee_max: d.entry_fee_max,
    description: (d.description ?? '').slice(0, 180)
  }));

  const targetStops = input.hours <= 3 ? '2-3' : input.hours <= 6 ? '3-4' : '4-6';
  const system = [
    'You are Zega-AI, an expert Arba Minch, Ethiopia travel planner.',
    'HARD RULES: Use ONLY destinations from the catalog by exact uuid. Never invent places or entry fees.',
    `Plan ${targetStops} geographically logical stops (use lat/lng so stops flow smoothly from ${input.startLocation})`,
    `that fit ${input.hours} hours (including ~15-20 min travel between stops) and stay within ${input.budgetEtb} ETB total.`,
    `Match interests (${input.interests.join(', ') || 'any'}) and ${input.travelStyle} pace using ${input.transport}.`,
    'Write concise, practical activity instructions (what to see/do) and realistic ETB estimates per stop for:',
    'transport_cost_min/max (bajaj/taxi/boat), food_cost_min/max (snacks/meals/water/coffee), and other_cost_min/max (local guide/scout/tips).',
    'Respond ONLY with JSON:',
    '{"title":string,"stops":[{"destination_id":uuid,"minutes":int,"activity":string,',
    '"transport_cost_min":number,"transport_cost_max":number,"food_cost_min":number,"food_cost_max":number,"other_cost_min":number,"other_cost_max":number}],"tips":string[],"safety":string[],"alternatives":uuid[]}'
  ].join(' ');

  const user = JSON.stringify({ request: input, catalog });

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json({ error: 'ai_unavailable', reason: 'missing_key' }, 502);

  let plan: z.infer<typeof AiPlan>;
  try {
    let raw = '';
    if (cachedModel) {
      try {
        raw = await callGemini(apiKey, cachedModel, system, user);
      } catch (err) {
        if (String(err).includes('404')) cachedModel = null;
        else throw err;
      }
    }
    if (!cachedModel) {
      const preferred = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite';
      try {
        raw = await callGemini(apiKey, preferred, system, user);
        cachedModel = preferred;
      } catch (err) {
        if (!String(err).includes('404')) throw err;
        const avail = await listGeminiModels(apiKey);
        const pick = avail.find((m) => m.includes('flash-lite')) ?? avail.find((m) => m.includes('flash')) ?? avail[0];
        if (!pick) throw new Error('gemini_no_models_available');
        raw = await callGemini(apiKey, pick, system, user);
        cachedModel = pick;
      }
    }
    const candidate = AiPlan.safeParse(JSON.parse(raw));
    if (!candidate.success) throw new Error('ai_schema_invalid');
    plan = candidate.data;
  } catch (e) {
    return json({ error: 'ai_unavailable', reason: e instanceof Error ? e.message : String(e) }, 502);
  }

  // Server-side truth: costs & schedule from DB, never from the model.
  const byId = new Map(dests.map((d) => [d.id, d]));
  let stops = plan.stops.filter((s) => byId.has(s.destination_id)).map((s) => {
    const d = byId.get(s.destination_id)!;
    return {
      destinationId: d.id as string, name: d.name as string, lat: d.lat as number, lng: d.lng as number,
      minutes: Math.min(s.minutes, d.visit_minutes as number), activity: s.activity,
      description: (d.description ?? '') as string,
      entryMin: Number(d.entry_fee_min ?? 0), entryMax: Number(d.entry_fee_max ?? d.entry_fee_min ?? 0),
      transportMin: Math.min(s.transport_cost_min, s.transport_cost_max),
      transportMax: Math.max(s.transport_cost_min, s.transport_cost_max),
      foodMin: Math.min(s.food_cost_min, s.food_cost_max),
      foodMax: Math.max(s.food_cost_min, s.food_cost_max),
      otherMin: Math.min(s.other_cost_min, s.other_cost_max),
      otherMax: Math.max(s.other_cost_min, s.other_cost_max),
      isVerified: Boolean(d.is_verified),
      arrive: '', depart: ''
    };
  });
  if (!stops.length) return json({ error: 'ai_unavailable', reason: 'no_valid_stops' }, 502);

  const warnings: string[] = [];
  const totalMax = () => stops.reduce((a, s) => a + s.entryMax + s.transportMax + s.foodMax + s.otherMax, 0);
  while (stops.length > 1 && totalMax() > input.budgetEtb) {
    stops.pop();
    warnings.push('A stop was removed to keep the plan within your budget.');
  }
  const maxMinutes = input.hours * 60;
  let cursor = toMin(input.startTime);
  stops = stops.filter((s, i) => {
    const travel = i === 0 ? 10 : 20;
    if (cursor + travel + s.minutes - toMin(input.startTime) > maxMinutes) return false;
    cursor += travel; s.arrive = toHHMM(cursor); cursor += s.minutes; s.depart = toHHMM(cursor);
    return true;
  });

  const sum = (k: 'entryMin' | 'entryMax' | 'transportMin' | 'transportMax' | 'foodMin' | 'foodMax' | 'otherMin' | 'otherMax') =>
    stops.reduce((a, s) => a + s[k], 0);
  const totals = {
    entryMin: sum('entryMin'), entryMax: sum('entryMax'),
    transportMin: sum('transportMin'), transportMax: sum('transportMax'),
    foodMin: sum('foodMin'), foodMax: sum('foodMax'),
    otherMin: sum('otherMin'), otherMax: sum('otherMax'),
    totalMin: sum('entryMin') + sum('transportMin') + sum('foodMin') + sum('otherMin'),
    totalMax: sum('entryMax') + sum('transportMax') + sum('foodMax') + sum('otherMax')
  };
  if (stops.some((s) => !s.isVerified))
    warnings.push('Some places/prices are unverified demo data — confirm locally before paying.');
  warnings.push('Transport figures are estimates, not guaranteed prices.');

  return json({
    title: plan.title, city: input.city, source: 'ai', budgetEtb: input.budgetEtb,
    startTime: input.startTime, groupSize: input.groupSize, stops, totals,
    remainingMin: input.budgetEtb - totals.totalMax, remainingMax: input.budgetEtb - totals.totalMin,
    tips: plan.tips, safety: plan.safety,
    alternatives: plan.alternatives.filter((id) => byId.has(id)).map((id) => ({ id, name: byId.get(id)!.name })),
    warnings
  });
});
