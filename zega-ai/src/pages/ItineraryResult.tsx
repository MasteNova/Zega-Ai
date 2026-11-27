import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { getLastItinerary, listDestinations, saveItinerary } from '../lib/api';
import ItineraryView from '../components/ItineraryView';
import { Button, EmptyState, PageTitle } from '../components/ui';
import { useAuth } from '../state/auth';
import { useToast } from '../state/toast';
import { useI18n } from '../i18n';
import { friendlyError } from '../lib/supabase';

export default function ItineraryResult() {
  const { t } = useI18n();
  const { session } = useAuth();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const plan = getLastItinerary();
  const { data: catalog = [] } = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });

  if (!plan) return <EmptyState title="No itinerary yet" hint="Generate one first."
    action={<Link to="/planner"><Button>{t('planner')}</Button></Link>} />;

  const save = async () => {
    try {
      await saveItinerary(plan, session?.user.id ?? null);
      setSaved(true);
      toast(session ? 'Saved to your account and this device.' : 'Saved on this device. Sign in to sync.', 'success');
    } catch (e) { toast(friendlyError(e), 'error'); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <PageTitle title="Your itinerary" />
        <Button variant="secondary" onClick={save} disabled={saved} className="mb-5">
          <Bookmark size={16} /> {saved ? t('saved') : t('saveTrip')}
        </Button>
      </div>
      <ItineraryView plan={plan} catalog={catalog} />
    </div>
  );
}
