-- Zega-AI security. Run SECOND.
alter table public.profiles enable row level security;
alter table public.destination_categories enable row level security;
alter table public.destinations enable row level security;
alter table public.transport_routes enable row level security;
alter table public.fare_feedback enable row level security;
alter table public.phrases enable row level security;
alter table public.service_providers enable row level security;
alter table public.itineraries enable row level security;
alter table public.sos_alerts enable row level security;
alter table public.sos_status_history enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.rate_limits enable row level security; -- no policies: service-role only

-- profiles: read own or staff; users may edit display_name ONLY (column grant blocks role escalation)
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_staff());
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- public catalog: active rows readable by everyone; admins see/manage all
create policy categories_read on public.destination_categories for select using (true);
create policy categories_admin on public.destination_categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy destinations_read on public.destinations for select
  using (is_active or public.is_admin());
create policy destinations_admin on public.destinations for all
  using (public.is_admin()) with check (public.is_admin());

create policy routes_read on public.transport_routes for select
  using (is_active or public.is_admin());
create policy routes_admin on public.transport_routes for all
  using (public.is_admin()) with check (public.is_admin());

create policy phrases_read on public.phrases for select
  using (is_active or public.is_admin());
create policy phrases_admin on public.phrases for all
  using (public.is_admin()) with check (public.is_admin());

create policy providers_read on public.service_providers for select
  using (is_active or public.is_admin());
create policy providers_admin on public.service_providers for all
  using (public.is_admin()) with check (public.is_admin());

-- fare feedback: anyone may submit PENDING feedback; only staff read/moderate
create policy feedback_insert on public.fare_feedback for insert
  with check (status = 'pending' and quoted_price > 0 and length(device_id) >= 8);
create policy feedback_staff_read on public.fare_feedback for select using (public.is_staff());
create policy feedback_staff_update on public.fare_feedback for update
  using (public.is_staff()) with check (public.is_staff());

-- itineraries: private to owner
create policy itineraries_owner on public.itineraries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- SOS: NO public read, NO direct insert/update — only the security-definer RPCs above.
create policy sos_staff_read on public.sos_alerts for select using (public.is_staff());
create policy sos_history_staff on public.sos_status_history for select using (public.is_staff());

-- audit: admin only
create policy audit_admin_read on public.admin_audit_logs for select using (public.is_admin());

-- storage: public read, admin write
create policy storage_public_read on storage.objects for select
  using (bucket_id in ('destinations','phrase-audio'));
create policy storage_admin_write on storage.objects for insert
  with check (bucket_id in ('destinations','phrase-audio') and public.is_admin());
create policy storage_admin_update on storage.objects for update
  using (bucket_id in ('destinations','phrase-audio') and public.is_admin());
create policy storage_admin_delete on storage.objects for delete
  using (bucket_id in ('destinations','phrase-audio') and public.is_admin());
