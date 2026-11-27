-- Explicit table grants for anon & authenticated roles (RLS still enforces row/column access).
grant usage on schema public to anon, authenticated;

grant select on
  public.destination_categories,
  public.destinations,
  public.transport_routes,
  public.phrases,
  public.service_providers
to anon, authenticated;

grant insert, update, delete on
  public.destination_categories,
  public.destinations,
  public.transport_routes,
  public.phrases,
  public.service_providers
to authenticated;

grant insert on public.fare_feedback to anon, authenticated;
grant select, update on public.fare_feedback to authenticated;

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.itineraries to authenticated;
grant select on public.sos_alerts, public.sos_status_history, public.admin_audit_logs to authenticated;
