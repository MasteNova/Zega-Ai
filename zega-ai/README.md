# Zega-AI — Intelligent Tourism Assistant for Arba Minch, Ethiopia

React + TypeScript + Vite + Tailwind + Supabase + Gemini + PWA.

## ⚠️ Data honesty
ALL seeded destinations, coordinates, fares and fees are **DEMO / UNVERIFIED samples**.
The UI badges them. Gamo translations/audio are intentionally empty pending native-speaker
verification. Replace everything via the Admin dashboard before any public launch.
SOS alerts reach **Zega responders only** — not police or ambulance services.

## 1. Prerequisites
- Node 20+, npm
- A Supabase project (free tier works): https://supabase.com
- A Gemini API key: https://aistudio.google.com/apikey
- Supabase CLI: `npm i -g supabase` (or use `npx supabase`)

## 2. Frontend setup
```bash
git clone <your-repo> zega-ai && cd zega-ai
npm install
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   # Project Settings → API → anon public key
```
**Never put the Gemini key or service-role key in `.env` or any `VITE_*` variable.**

Run: `npm run dev` → http://localhost:5173

## 3. Database setup (choose ONE path)

### Path A — Supabase CLI (recommended)
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push          # runs 0001_schema, 0002_rls, 0003_seed in order
```

### Path B — SQL Editor
Open Supabase Dashboard → SQL Editor. Paste and run, **in order**:
1. `supabase/migrations/0001_schema.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_seed.sql`

This creates: tables, RLS policies, role helpers, SOS RPCs, rate limiting, audit triggers,
storage buckets (`destinations`, `phrase-audio`), realtime publication for `sos_alerts`, demo seed.

## 4. AI Edge Function (Gemini)
```bash
npx supabase functions deploy generate-itinerary --no-verify-jwt
npx supabase secrets set GEMINI_API_KEY=your_key_here
npx supabase secrets set GEMINI_MODEL=gemini-2.0-flash   # optional, this is the default
```
`--no-verify-jwt` lets anonymous tourists call it; abuse is controlled by a DB rate limit
(10 requests/hour/IP). The function:
- fetches destinations from the DB (AI can never invent places),
- forces Gemini JSON output, validates it with Zod,
- recomputes ALL costs and budget math server-side from DB values,
- returns 502 on any AI failure → the frontend automatically builds a rule-based fallback itinerary.

### Swapping the AI provider later
All AI logic lives in `supabase/functions/generate-itinerary/index.ts`.
The frontend only knows the response contract (`ItineraryPayload` in `src/types.ts`).
Replace the `callGemini()` function with any provider; keep the returned shape and you're done.

## 5. Create your admin / responder account
1. Run the app, go to `/login`, sign up with email + password.
   (For demo convenience: Dashboard → Authentication → Providers → Email → disable "Confirm email".)
2. Promote the account in SQL Editor:
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```
Use `'responder'` for SOS-only staff. Admins see everything; responders see the SOS tab.
Roles are enforced by Postgres RLS — hiding UI is never the security layer.

## 6. Verify the 4 MVP workflows
1. **Planner:** `/planner` → budget 1500 ETB, 4 hours, interests nature+wildlife → Generate.
   Timeline + map + totals + "estimate/unverified" badges. Kill your network → generate again →
   labeled offline fallback plan.
2. **Map:** `/explore` → toggle Map → markers, filters, search, locate-me, detail pages.
3. **Fares + Phrases:** `/fares` → pick route, enter quote → below/within/above/no-data verdict,
   submit feedback (lands in Admin → Feedback). `/phrases` → Amharic text, favorites, audio
   player appears once you upload recordings in Admin.
4. **SOS:** `/safety` → Send SOS → confirm → allow GPS → `/sos/status` shows "Transmitted".
   In a second browser, log in as admin → `/admin?tab=sos` → the alert appears live (Realtime),
   Acknowledge → Resolve. The tourist's status page updates on its 10s poll.

## 7. Adding real content (Admin)
- `/admin?tab=destinations` — edit coords/fees, upload images, tick **is_verified** only after
  ground-truth checking; set `last_verified_at`.
- `/admin?tab=fares` — set real fare ranges, `confidence='verified'`, source, verification date.
- `/admin?tab=phrases` — add Gamo text from a native speaker, upload MP3 recordings
  (bucket `phrase-audio`), then set `verification_status='verified'`.
- Fare feedback never overwrites reference ranges — moderate it, then update routes manually.

## 8. PWA / offline behavior
- Installable (manifest + service worker via `vite-plugin-pwa`). Chrome/Android: menu → Install.
- Cached offline: app shell, destination/route/phrase JSON (localStorage + network-first API cache),
  audio/images (cache-first), **previously viewed** map tiles (cache-first, 600 tiles/30 days).
- NOT offline: AI generation (falls back to a labeled local plan), SOS sending (shows
  "NOT transmitted" + retry), realtime. The app never pretends otherwise.
- Icons: `public/icon.svg` works on Chromium. For iOS home-screen polish, add 180/192/512 PNGs
  and list them in `vite.config.ts` manifest.

## 9. Testing
```bash
npm run test        # Vitest unit: fare logic, budget math, fallback builder, UI smoke
npm run test:e2e    # Playwright (npx playwright install first). Static pages; no backend needed.
npm run lint && npm run typecheck && npm run build
```
Coverage is a starter suite, not exhaustive. Prioritize expanding SOS + RLS tests before launch.
Recommended manual security test: with the anon key, `select * from sos_alerts` via REST must
return `[]`; a tourist must not read another user's itineraries.

## 10. Deploy
- **Frontend (Vercel):** import repo → framework Vite → env vars `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY` → deploy. `vercel.json` handles SPA rewrites. HTTPS is automatic
  (required for PWA + geolocation).
- **Backend:** already on Supabase. Re-run `db push` + `functions deploy` on schema changes.
- CI: `.github/workflows/ci.yml` runs lint/typecheck/unit/build on every push.

## 11. Known limitations (deliberate, documented)
- SOS device rate-limit can be bypassed by clearing localStorage → add CAPTCHA/IP limits pre-launch.
- No offline tile pre-download packs (only tiles you've already viewed are cached).
- Gamo UI falls back to English with a notice; Amharic UI is partial (nav + key labels).
- Bookings, payments, reviews, multi-city data: schema-ready, not built.
- Error tracking (e.g. Sentry) not wired — add before pilot.

## 12. Environment reference
| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | frontend `.env` / Vercel | Supabase API URL |
| `VITE_SUPABASE_ANON_KEY` | frontend `.env` / Vercel | public anon key (RLS-protected) |
| `GEMINI_API_KEY` | `supabase secrets` ONLY | Gemini access |
| `GEMINI_MODEL` | `supabase secrets` (optional) | default `gemini-2.0-flash` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | auto-injected into Edge Functions | server-side DB access |
