-- Ensure service_role (used by Edge Functions) has full table/sequence access.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
