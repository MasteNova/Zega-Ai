-- Zega-AI schema. Run FIRST.
create extension if not exists pgcrypto;

-- ---------- profiles / roles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'tourist' check (role in ('tourist','admin','responder')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','responder'));
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- tourism ----------
create table public.destination_categories (
  id text primary key,
  name_en text not null,
  name_am text,
  icon text
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city text not null default 'Arba Minch',
  category_id text references public.destination_categories(id),
  description text,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  entry_fee_min numeric check (entry_fee_min >= 0),
  entry_fee_max numeric check (entry_fee_max >= 0),
  currency text not null default 'ETB',
  opening_hours text,
  visit_minutes int not null default 60 check (visit_minutes between 5 and 720),
  safety_notes text,
  accessibility text,
  local_tips text,
  image_url text,
  interests text[] not null default '{}',
  is_verified boolean not null default false,
  last_verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index destinations_city_idx on public.destinations (city, is_active);

create table public.transport_routes (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  vehicle_type text not null default 'bajaj' check (vehicle_type in ('bajaj','taxi','minibus','boat','foot')),
  fare_min numeric check (fare_min >= 0),
  fare_max numeric check (fare_max >= 0),
  currency text not null default 'ETB',
  distance_km numeric,
  conditions text,
  source text,
  confidence text not null default 'unverified' check (confidence in ('verified','community','unverified')),
  is_verified boolean not null default false,
  last_verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fare_feedback (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  route_id uuid references public.transport_routes(id) on delete cascade,
  quoted_price numeric not null check (quoted_price > 0),
  paid_price numeric check (paid_price >= 0),
  passenger_count int not null default 1 check (passenger_count between 1 and 20),
  comment text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table public.phrases (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in
    ('greetings','transportation','directions','market','shopping','food','hotels','emergency','general')),
  english text not null,
  amharic text,
  gamo text,
  transliteration text,
  dialect text,
  audio_url text,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified')),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('guide','boat','hotel','restaurant','bajaj','cultural','other')),
  description text,
  location text,
  lat double precision,
  lng double precision,
  phone text,
  services text[] not null default '{}',
  price_note text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- itineraries ----------
create table public.itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  city text not null default 'Arba Minch',
  payload jsonb not null,
  source text not null default 'fallback' check (source in ('ai','fallback')),
  created_at timestamptz not null default now()
);
create index itineraries_user_idx on public.itineraries (user_id, created_at desc);

-- ---------- SOS ----------
create table public.sos_alerts (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  user_id uuid references auth.users(id),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  accuracy_m double precision,
  message text,
  status text not null default 'active' check (status in ('active','acknowledged','resolved','cancelled')),
  access_token text not null default encode(gen_random_bytes(16),'hex'),
  responder_id uuid references auth.users(id),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index sos_status_idx on public.sos_alerts (status, created_at desc);
create index sos_device_idx on public.sos_alerts (device_id, created_at desc);

create table public.sos_status_history (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.sos_alerts(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id),
  note text,
  created_at timestamptz not null default now()
);

-- ---------- ops ----------
create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  actor uuid,
  action text not null,
  table_name text not null,
  record_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  key text primary key,
  hits int not null default 0,
  window_start timestamptz not null default now()
);

-- ---------- generic triggers ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

create trigger t_destinations_updated before update on public.destinations
  for each row execute function public.set_updated_at();
create trigger t_routes_updated before update on public.transport_routes
  for each row execute function public.set_updated_at();
create trigger t_phrases_updated before update on public.phrases
  for each row execute function public.set_updated_at();
create trigger t_providers_updated before update on public.service_providers
  for each row execute function public.set_updated_at();

create or replace function public.audit_changes() returns trigger
language plpgsql security definer set search_path = public as $$
declare rid text; payload jsonb;
begin
  if TG_OP = 'DELETE' then rid := (old).id::text; payload := to_jsonb(old);
  else rid := (new).id::text; payload := to_jsonb(new); end if;
  insert into admin_audit_logs (actor, action, table_name, record_id, detail)
  values (auth.uid(), TG_OP, TG_TABLE_NAME, rid, payload);
  if TG_OP = 'DELETE' then return old; else return new; end if;
end $$;

create trigger audit_destinations after insert or update or delete on public.destinations
  for each row execute function public.audit_changes();
create trigger audit_routes after insert or update or delete on public.transport_routes
  for each row execute function public.audit_changes();
create trigger audit_phrases after insert or update or delete on public.phrases
  for each row execute function public.audit_changes();
create trigger audit_providers after insert or update or delete on public.service_providers
  for each row execute function public.audit_changes();

-- ---------- rate limiting (service-role only) ----------
create or replace function public.check_rate_limit(p_key text, p_max int, p_window_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare r public.rate_limits%rowtype;
begin
  insert into rate_limits (key, hits, window_start) values (p_key, 1, now())
  on conflict (key) do update set
    hits = case when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                then 1 else rate_limits.hits + 1 end,
    window_start = case when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                then now() else rate_limits.window_start end
  returning * into r;
  return r.hits <= p_max;
end $$;

revoke execute on function public.check_rate_limit(text,int,int) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text,int,int) to service_role;

-- ---------- SOS RPCs ----------
create or replace function public.create_sos_alert(
  p_device text, p_lat float8, p_lng float8, p_accuracy float8, p_message text
) returns json language plpgsql security definer set search_path = public as $$
declare recent int; new_id uuid; tok text;
begin
  if p_device is null or length(p_device) < 8 then raise exception 'invalid_device'; end if;
  if p_lat is null or p_lng is null or p_lat not between -90 and 90 or p_lng not between -180 and 180
    then raise exception 'invalid_coordinates'; end if;
  select count(*) into recent from sos_alerts
    where device_id = p_device and created_at > now() - interval '10 minutes';
  if recent >= 5 then raise exception 'rate_limited'; end if;
  insert into sos_alerts (device_id, user_id, lat, lng, accuracy_m, message)
  values (p_device, auth.uid(), p_lat, p_lng, p_accuracy, left(coalesce(p_message,''), 500))
  returning id, access_token into new_id, tok;
  insert into sos_status_history (alert_id, status, changed_by, note)
  values (new_id, 'active', auth.uid(), 'Alert created');
  return json_build_object('id', new_id, 'access_token', tok);
end $$;

create or replace function public.get_sos_status(p_id uuid, p_token text)
returns json language plpgsql security definer set search_path = public as $$
declare a public.sos_alerts%rowtype;
begin
  select * into a from sos_alerts where id = p_id and access_token = p_token;
  if not found then raise exception 'not_found'; end if;
  return json_build_object('status', a.status, 'created_at', a.created_at,
    'acknowledged_at', a.acknowledged_at, 'resolved_at', a.resolved_at);
end $$;

create or replace function public.cancel_sos(p_id uuid, p_token text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update sos_alerts set status = 'cancelled'
    where id = p_id and access_token = p_token and status = 'active';
  if found then
    insert into sos_status_history (alert_id, status, note) values (p_id, 'cancelled', 'Cancelled by user');
  end if;
end $$;

create or replace function public.update_sos_status(p_id uuid, p_status text, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'not_authorized'; end if;
  if p_status not in ('active','acknowledged','resolved','cancelled') then raise exception 'invalid_status'; end if;
  update sos_alerts set
    status = p_status,
    responder_id = auth.uid(),
    acknowledged_at = case when p_status = 'acknowledged' then now() else acknowledged_at end,
    resolved_at = case when p_status = 'resolved' then now() else resolved_at end
  where id = p_id;
  if not found then raise exception 'not_found'; end if;
  insert into sos_status_history (alert_id, status, changed_by, note)
  values (p_id, p_status, auth.uid(), left(coalesce(p_note,''), 500));
  insert into admin_audit_logs (actor, action, table_name, record_id, detail)
  values (auth.uid(), 'SOS_' || upper(p_status), 'sos_alerts', p_id::text, json_build_object('note', p_note));
end $$;

grant execute on function public.create_sos_alert(text,float8,float8,float8,text) to anon, authenticated;
grant execute on function public.get_sos_status(uuid,text) to anon, authenticated;
grant execute on function public.cancel_sos(uuid,text) to anon, authenticated;
grant execute on function public.update_sos_status(uuid,text,text) to authenticated;

-- ---------- realtime ----------
alter publication supabase_realtime add table public.sos_alerts;

-- ---------- storage ----------
insert into storage.buckets (id, name, public) values
  ('destinations','destinations', true),
  ('phrase-audio','phrase-audio', true)
on conflict (id) do nothing;
