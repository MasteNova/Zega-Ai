export const etb = (n: number) => `${Math.round(n).toLocaleString('en-US')} ETB`;

export const range = (min: number, max: number) =>
  min === max ? etb(min) : `${Math.round(min).toLocaleString()}–${Math.round(max).toLocaleString()} ETB`;

export const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export const toHHMM = (m: number) =>
  `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String(((m % 60) + 60) % 60).padStart(2, '0')}`;

export const dateTime = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
export const mapsLink = (lat: number, lng: number, name?: string, city = 'Arba Minch, Ethiopia') =>
  name
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${city}`)}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
export const mapsDirLink = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
