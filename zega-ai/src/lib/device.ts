import { readCache, writeCache } from './cache';

export function getDeviceId(): string {
  let id = readCache<string>('device-id');
  if (!id) { id = crypto.randomUUID(); writeCache('device-id', id); }
  return id;
}
