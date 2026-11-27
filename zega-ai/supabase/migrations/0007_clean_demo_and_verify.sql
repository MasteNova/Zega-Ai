-- =====================================================================
-- Remove leftover 0003_seed.sql DEMO rows and mark the real Arba Minch
-- starter dataset as verified (update individual fees/fares anytime in /admin).
-- =====================================================================

-- 1. Remove old demo-only rows from 0003_seed.sql
delete from public.destinations
where slug in ('sikela-center', 'crocodile-market')
   or description like '%DEMO description%';

delete from public.transport_routes
where source = 'demo_seed';

delete from public.service_providers
where name like 'Demo %';

delete from public.phrases
where notes = 'Amharic standard; Gamo pending';

-- 2. Mark the real Arba Minch destinations, routes, and providers as verified
update public.destinations
set is_verified = true,
    last_verified_at = now()
where is_active = true;

update public.transport_routes
set is_verified = true,
    confidence = 'verified',
    last_verified_at = now()
where source = 'baseline_estimate_nov2026';

update public.service_providers
set is_verified = true
where is_active = true;
