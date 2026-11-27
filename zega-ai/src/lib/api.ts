import { requireClient } from './supabase';
import { cached, readCache, writeCache, removeCache } from './cache';
import { getDeviceId } from './device';
import { itineraryPayloadSchema } from './schemas';
import { buildFallbackItinerary } from './fallback';
import type {
  Destination, Category, TransportRoute, Phrase, FareFeedback, Provider,
  ItineraryInput, ItineraryPayload, SavedItinerary, SosAlert, SosStatus, AuditLog
} from '../types';

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// ---------- public catalog (offline-cached) ----------
export const listCategories = () =>
  cached('categories', async () =>
    unwrap(await requireClient().from('destination_categories').select('*').order('name_en')) as Category[]);

export const listDestinations = () =>
  cached('destinations', async () =>
    unwrap(await requireClient().from('destinations').select('*').eq('is_active', true).order('name')) as Destination[]);

export async function getDestination(id: string): Promise<Destination> {
  const all = await listDestinations();
  const hit = all.find((d) => d.id === id || d.slug === id);
  if (hit) return hit;
  return unwrap(await requireClient().from('destinations').select('*').eq('id', id).single()) as Destination;
}

export const listRoutes = () =>
  cached('routes', async () =>
    unwrap(await requireClient().from('transport_routes').select('*').eq('is_active', true)
      .order('origin')) as TransportRoute[]);

export const listPhrases = () =>
  cached('phrases', async () =>
    unwrap(await requireClient().from('phrases').select('*').eq('is_active', true)
      .order('category')) as Phrase[]);

export const listProviders = () =>
  cached('providers', async () =>
    unwrap(await requireClient().from('service_providers').select('*').eq('is_active', true)) as Provider[]);

// ---------- fares ----------
export async function submitFareFeedback(input: {
  route_id: string | null; quoted_price: number; paid_price: number | null;
  passenger_count: number; comment: string;
}) {
  unwrap(await requireClient().from('fare_feedback').insert({ ...input, device_id: getDeviceId() }));
}

// ---------- itinerary ----------
export async function generateItinerary(input: ItineraryInput): Promise<ItineraryPayload> {
  const dests = await listDestinations();
  try {
    if (!navigator.onLine) throw new Error('offline');
    const { data, error } = await requireClient().functions.invoke('generate-itinerary', { body: input });
    if (error) throw error;
    const parsed = itineraryPayloadSchema.safeParse(data);
    if (!parsed.success) throw new Error('invalid_ai_payload');
    return parsed.data;
  } catch {
    const fallback = buildFallbackItinerary(dests, input);
    if (!fallback.stops.length) throw new Error('No destinations available to build a plan.');
    return fallback;
  }
}

export function saveItineraryLocal(payload: ItineraryPayload): SavedItinerary {
  const item: SavedItinerary = {
    id: `local-${Date.now()}`, title: payload.title, payload, created_at: new Date().toISOString(), cloud: false
  };
  const list = readCache<SavedItinerary[]>('saved') ?? [];
  writeCache('saved', [item, ...list].slice(0, 30));
  return item;
}

export async function saveItinerary(payload: ItineraryPayload, userId: string | null): Promise<SavedItinerary> {
  const local = saveItineraryLocal(payload);
  if (userId) {
    try {
      const row = unwrap(await requireClient().from('itineraries')
        .insert({ user_id: userId, title: payload.title, city: payload.city, payload, source: payload.source })
        .select('id, created_at').single()) as { id: string; created_at: string };
      const list = readCache<SavedItinerary[]>('saved') ?? [];
      writeCache('saved', list.map((s) => (s.id === local.id ? { ...s, id: row.id, cloud: true } : s)));
      return { ...local, id: row.id, cloud: true };
    } catch { /* keep local copy; cloud sync optional */ }
  }
  return local;
}

export async function listSaved(userId: string | null): Promise<SavedItinerary[]> {
  const local = readCache<SavedItinerary[]>('saved') ?? [];
  if (!userId) return local;
  try {
    const cloud = unwrap(await requireClient().from('itineraries')
      .select('id,title,payload,created_at').order('created_at', { ascending: false })) as
      { id: string; title: string; payload: ItineraryPayload; created_at: string }[];
    const cloudItems: SavedItinerary[] = cloud.map((r) => ({ ...r, cloud: true }));
    const cloudIds = new Set(cloudItems.map((c) => c.id));
    return [...cloudItems, ...local.filter((l) => !cloudIds.has(l.id) && !l.cloud)];
  } catch { return local; }
}

export async function deleteSaved(id: string, cloud: boolean) {
  writeCache('saved', (readCache<SavedItinerary[]>('saved') ?? []).filter((s) => s.id !== id));
  if (cloud) unwrap(await requireClient().from('itineraries').delete().eq('id', id));
}

export const setLastItinerary = (p: ItineraryPayload) => writeCache('last-itinerary', p);
export const getLastItinerary = () => readCache<ItineraryPayload>('last-itinerary');

// ---------- SOS ----------
export async function createSos(lat: number, lng: number, accuracy: number | null, message: string) {
  const res = unwrap(await requireClient().rpc('create_sos_alert', {
    p_device: getDeviceId(), p_lat: lat, p_lng: lng, p_accuracy: accuracy, p_message: message
  })) as { id: string; access_token: string };
  writeCache('last-sos', { ...res, lat, lng, accuracy, created_at: new Date().toISOString() });
  return res;
}
export const getLastSos = () =>
  readCache<{ id: string; access_token: string; lat: number; lng: number; accuracy: number | null; created_at: string }>('last-sos');

export async function getSosStatus(id: string, token: string): Promise<SosStatus> {
  return unwrap(await requireClient().rpc('get_sos_status', { p_id: id, p_token: token })) as SosStatus;
}
export async function cancelSos(id: string, token: string) {
  unwrap(await requireClient().rpc('cancel_sos', { p_id: id, p_token: token }));
}
export async function listSosAlerts(): Promise<SosAlert[]> {
  return unwrap(await requireClient().from('sos_alerts').select('*')
    .order('created_at', { ascending: false }).limit(100)) as SosAlert[];
}
export async function updateSosStatus(id: string, status: SosAlert['status'], note: string) {
  unwrap(await requireClient().rpc('update_sos_status', { p_id: id, p_status: status, p_note: note }));
}

// ---------- admin ----------
export type AdminTable = 'destinations' | 'transport_routes' | 'phrases' | 'service_providers';

export async function adminList(table: AdminTable): Promise<any[]> {
  return unwrap(await requireClient().from(table).select('*').order('created_at', { ascending: false }));
}
export async function adminUpsert(table: AdminTable, row: Record<string, unknown>) {
  unwrap(await requireClient().from(table).upsert(row));
}
export async function adminDelete(table: AdminTable, id: string) {
  unwrap(await requireClient().from(table).delete().eq('id', id));
}
export async function adminFeedback(): Promise<FareFeedback[]> {
  return unwrap(await requireClient().from('fare_feedback').select('*')
    .order('created_at', { ascending: false }).limit(100)) as FareFeedback[];
}
export async function moderateFeedback(id: string, status: 'approved' | 'rejected') {
  unwrap(await requireClient().from('fare_feedback').update({ status }).eq('id', id));
}
export async function listAudit(): Promise<AuditLog[]> {
  return unwrap(await requireClient().from('admin_audit_logs').select('*')
    .order('created_at', { ascending: false }).limit(100)) as AuditLog[];
}
export async function uploadAsset(bucket: 'destinations' | 'phrase-audio', file: File): Promise<string> {
  const client = requireClient();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${crypto.randomUUID()}-${safe}`;
  const { error } = await client.storage.from(bucket).upload(path, file, { cacheControl: '2592000', upsert: false });
  if (error) throw new Error(error.message);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
export { removeCache };
