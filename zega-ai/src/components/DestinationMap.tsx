import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { LocateFixed } from 'lucide-react';
import type { Destination } from '../types';
import { useI18n } from '../i18n';

const pin = (label: string, color = '#193C32') =>
  L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#F5F0E5;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #F5F0E5;box-shadow:0 1px 4px rgba(0,0,0,.4)"><span style="transform:rotate(45deg);font-size:11px;font-weight:700">${label}</span></div>`,
    iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28]
  });

function LocateControl() {
  const map = useMap();
  const { t } = useI18n();
  const [me, setMe] = useState<[number, number] | null>(null);
  const locate = () =>
    navigator.geolocation.getCurrentPosition(
      (p) => { const ll: [number, number] = [p.coords.latitude, p.coords.longitude]; setMe(ll); map.flyTo(ll, 14); },
      () => alert('Location permission denied or unavailable.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  return (
    <>
      <button onClick={locate} aria-label={t('locateMe')}
        className="absolute bottom-4 right-3 z-[500] bg-white rounded-lg shadow-card p-2.5 border border-forest/20">
        <LocateFixed size={18} className="text-forest" />
      </button>
      {me && <Marker position={me} icon={pin('•', '#B96F46')}><Popup>You are here (approx.)</Popup></Marker>}
    </>
  );
}

export default function DestinationMap({
  destinations, route, height = '60vh', showLocate = true
}: {
  destinations: Destination[];
  route?: { lat: number; lng: number }[];
  height?: string;
  showLocate?: boolean;
}) {
  const center: [number, number] = destinations.length
    ? [destinations[0].lat, destinations[0].lng] : [6.02, 37.55];
  return (
    <div className="relative rounded-xl overflow-hidden border border-forest/10" style={{ height }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destinations.map((d, i) => (
          <Marker key={d.id} position={[d.lat, d.lng]} icon={pin(route ? String(i + 1) : '●')}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{d.name}</p>
                {!d.is_verified && <p className="text-xs text-amber-700">Unverified demo data</p>}
                <Link to={`/destination/${d.id}`} className="text-forest underline text-xs">View details →</Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {route && route.length > 1 && <Polyline positions={route.map((r) => [r.lat, r.lng])} pathOptions={{ color: '#B96F46', dashArray: '6 6' }} />}
        {showLocate && <LocateControl />}
      </MapContainer>
    </div>
  );
}
