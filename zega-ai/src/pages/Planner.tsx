import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import { generateItinerary, setLastItinerary } from '../lib/api';
import { itineraryInputSchema } from '../lib/schemas';
import { friendlyError } from '../lib/supabase';
import { Button, Input, Select, PageTitle, Card } from '../components/ui';
import { useI18n } from '../i18n';
import { useOnline } from '../state/online';
import { useToast } from '../state/toast';
import type { ItineraryInput } from '../types';

const INTERESTS = ['nature', 'wildlife', 'culture', 'water', 'market', 'shopping', 'food', 'viewpoint'];

export default function Planner() {
  const { t } = useI18n();
  const online = useOnline();
  const toast = useToast();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<ItineraryInput>({
    city: 'Arba Minch', budgetEtb: 1500, hours: 4, startTime: '08:00',
    startLocation: 'Sikela', interests: ['nature', 'wildlife'], groupSize: 1,
    travelStyle: 'balanced', transport: 'bajaj'
  });
  const set = <K extends keyof ItineraryInput>(k: K, v: ItineraryInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const parsed = itineraryInputSchema.safeParse(form);
    if (!parsed.success) { toast(parsed.error.issues[0].message, 'error'); return; }
    setBusy(true);
    try {
      const plan = await generateItinerary(parsed.data);
      setLastItinerary(plan);
      toast(plan.source === 'ai' ? 'Itinerary ready.' : 'AI unavailable — labeled sample plan generated.', plan.source === 'ai' ? 'success' : 'info');
      nav('/itinerary');
    } catch (e) { toast(friendlyError(e), 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl">
      <PageTitle title={t('planner')} sub="Tell Zega your budget and time — it plans only from the destination catalog." />
      {!online && (
        <Card className="p-3 mb-4 text-sm text-terra-700 flex items-center gap-2 bg-gold-100 border-gold">
          <WifiOff size={16} /> {t('aiNeedsNet')}
        </Card>
      )}
      <Card className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Destination city" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <Input label={t('budget')} type="number" min={1} value={form.budgetEtb} onChange={(e) => set('budgetEtb', Number(e.target.value))} />
          <Input label={t('duration')} type="number" min={1} max={12} value={form.hours} onChange={(e) => set('hours', Number(e.target.value))} />
          <Input label={t('startTime')} type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} />
          <Input label={t('startLocation')} value={form.startLocation} onChange={(e) => set('startLocation', e.target.value)} />
          <Input label={t('groupSize')} type="number" min={1} max={20} value={form.groupSize} onChange={(e) => set('groupSize', Number(e.target.value))} />
          <Select label={t('transport')} value={form.transport} onChange={(e) => set('transport', e.target.value as ItineraryInput['transport'])}>
            <option value="bajaj">Bajaj</option><option value="taxi">Taxi</option><option value="foot">On foot</option><option value="any">Any</option>
          </Select>
          <Select label={t('style')} value={form.travelStyle} onChange={(e) => set('travelStyle', e.target.value as ItineraryInput['travelStyle'])}>
            <option value="relaxed">Relaxed</option><option value="balanced">Balanced</option><option value="packed">Packed</option>
          </Select>
        </div>
        <div>
          <p className="text-sm font-medium text-ink/80 mb-2">{t('interests')}</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => {
              const on = form.interests.includes(i);
              return (
                <button key={i} type="button" onClick={() => set('interests', on ? form.interests.filter((x) => x !== i) : [...form.interests, i])}
                  className={clsx('rounded-full px-3 py-1.5 text-xs font-medium border capitalize', on ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>
                  {i}
                </button>
              );
            })}
          </div>
        </div>
        <Button onClick={submit} disabled={busy} className="w-full">
          <Sparkles size={16} /> {busy ? t('loading') : t('generate')}
        </Button>
        <p className="text-xs text-ink/50">All prices are estimates in ETB. Budget math is enforced server-side; the AI cannot invent destinations.</p>
      </Card>
    </div>
  );
}
