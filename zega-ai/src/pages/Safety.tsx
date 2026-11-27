import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, MapPin, WifiOff, Loader2 } from 'lucide-react';
import { createSos } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import { Button, Card, Modal, Textarea, PageTitle, Badge } from '../components/ui';
import { useOnline } from '../state/online';
import { useI18n } from '../i18n';

export default function Safety() {
  const { t } = useI18n();
  const online = useOnline();
  const nav = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState<{ lat: number; lng: number; acc: number | null } | null>(null);

  const send = async (coords?: { lat: number; lng: number; acc: number | null }) => {
    setBusy(true); setErr(null);
    try {
      const c = coords ?? pending ?? await new Promise<{ lat: number; lng: number; acc: number | null }>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
          () => reject(new Error('Location permission denied. Enable GPS/location to send an SOS.')),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
        ));
      setPending(c);
      await createSos(c.lat, c.lng, c.acc, message);
      setConfirm(false);
      nav('/sos/status');
    } catch (e) {
      setErr(friendlyError(e));
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <PageTitle title={t('safety')} sub="Zega SOS alerts go to trained Zega responders — NOT to police or ambulance services." />
      <Card className="p-5 border-terra/30">
        <div className="flex items-start gap-3">
          <ShieldAlert size={28} className="text-terra-700 shrink-0" />
          <div>
            <h2 className="font-display font-semibold text-lg">Emergency SOS</h2>
            <p className="text-sm text-ink/60 mt-1">
              Sends your GPS coordinates, accuracy and time to the responder dashboard.
              For life-threatening emergencies, also contact local authorities and your hotel directly —
              confirm local emergency numbers on arrival.
            </p>
          </div>
        </div>
        {!online && <p className="mt-3 text-sm text-terra-700 flex items-center gap-2"><WifiOff size={15} /> You are offline — SOS cannot be transmitted until network returns.</p>}
        <Button variant="danger" className="w-full mt-4 py-4 text-base" onClick={() => { setErr(null); setConfirm(true); }}>
          <ShieldAlert size={20} /> {t('sendSOS')}
        </Button>
        <Link to="/sos/status" className="block text-center text-sm text-forest underline mt-3">Check status of my last alert</Link>
      </Card>

      <Card className="p-5 text-sm space-y-2">
        <h3 className="font-semibold text-forest">Ethiopian national emergency numbers</h3>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <a href="tel:991" className="rounded-lg border border-forest/20 p-2.5 text-center hover:bg-forest-100">
            <p className="font-bold text-forest">991</p>
            <p className="text-xs text-ink/60">Police</p>
          </a>
          <a href="tel:907" className="rounded-lg border border-forest/20 p-2.5 text-center hover:bg-forest-100">
            <p className="font-bold text-forest">907</p>
            <p className="text-xs text-ink/60">Red Cross</p>
          </a>
          <a href="tel:939" className="rounded-lg border border-forest/20 p-2.5 text-center hover:bg-forest-100">
            <p className="font-bold text-forest">939</p>
            <p className="text-xs text-ink/60">Fire</p>
          </a>
        </div>
        <p className="text-xs text-ink/50 pt-1">Confirm local Arba Minch hospital & tourist police desk numbers on arrival.</p>
      </Card>

      <Card className="p-5 text-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-semibold text-forest">Local Arba Minch desks</h3>
          <Badge tone="gold">Directory listing — confirm by call</Badge>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            { name: 'Arba Minch Police (Gamo Zone)', tel: '+251462220991', label: '+251 46 222 0991' },
            { name: 'Shecha Police', tel: '+251910532089', label: '+251 91 053 2089' },
            { name: 'Sikela Police', tel: '+251931530138', label: '+251 93 153 0138' },
            { name: 'Nech Sar Police', tel: '+251925547971', label: '+251 92 554 7971' },
            { name: 'Arba Minch General Hospital', tel: '+251911985962', label: '+251 91 198 5962' },
            { name: 'General Hospital Ambulance', tel: '+251916270018', label: '+251 91 627 0018' },
            { name: 'Dilfana Hospital', tel: '+251911044826', label: '+251 91 104 4826' },
            { name: 'Dilfana Ambulance', tel: '+251913440733', label: '+251 91 344 0733' }
          ].map((c) => (
            <a key={c.tel} href={`tel:${c.tel}`} className="flex items-center justify-between rounded-lg border border-forest/15 px-3 py-2 hover:bg-forest-100">
              <span className="font-medium text-ink">{c.name}</span>
              <span className="font-mono text-forest">{c.label}</span>
            </a>
          ))}
        </div>
      </Card>

      <Card className="p-5 text-sm space-y-2">
        <h3 className="font-semibold text-forest">Before you travel</h3>
        <ul className="list-disc pl-4 text-ink/70 space-y-1">
          <li>Share your itinerary with someone you trust (use Saved trips).</li>
          <li>Carry your hotel's phone number and a paper copy of key addresses.</li>
          <li>On Lake Chamo always wear a life jacket; use licensed operators.</li>
          <li>In Nech Sar, walk with a guide; heat and terrain are serious.</li>
        </ul>
        <Badge tone="gold">Safety guidance is general — verify locally</Badge>
      </Card>

      {confirm && (
        <Modal title="Confirm SOS alert" onClose={() => !busy && setConfirm(false)}>
          <div className="space-y-4">
            <p className="text-sm text-ink/70">
              This will request your location and send an alert with: <strong>GPS coordinates, accuracy radius, timestamp</strong> and your optional message.
              Only authorized responders can see it.
            </p>
            <Textarea label="Optional message (what's happening?)" rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} />
            {err && (
              <div className="rounded-lg bg-terra-100 text-terra-700 text-sm p-3">
                <p className="font-semibold">Alert NOT transmitted.</p>
                <p>{err}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" disabled={busy} onClick={() => setConfirm(false)}>{t('cancel')}</Button>
              <Button variant="danger" className="flex-1" disabled={busy} onClick={() => send()}>
                {busy ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                {busy ? 'Sending…' : pending && err ? t('retry') : t('confirm')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
