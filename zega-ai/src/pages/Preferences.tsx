import { useI18n, type Lang } from '../i18n';
import { useAuth } from '../state/auth';
import { clearZegaCache } from '../lib/cache';
import { getDeviceId } from '../lib/device';
import { Button, Card, PageTitle } from '../components/ui';
import { useToast } from '../state/toast';
import { Link } from 'react-router-dom';

export default function Preferences() {
  const { lang, setLang, t } = useI18n();
  const { session, profile, signOut } = useAuth();
  const toast = useToast();

  const langs: { id: Lang; label: string; note?: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'am', label: 'አማርኛ (Amharic)' },
    { id: 'gamo', label: 'Gamo', note: t('gamoNotice') }
  ];

  return (
    <div className="max-w-xl space-y-5">
      <PageTitle title={t('preferences')} />
      <Card className="p-5">
        <h2 className="font-semibold text-forest mb-3">{t('language')}</h2>
        <div className="space-y-2">
          {langs.map((l) => (
            <label key={l.id} className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="radio" name="lang" checked={lang === l.id} onChange={() => setLang(l.id)} className="mt-1" />
              <span><span className="font-medium">{l.label}</span>{l.note && <span className="block text-xs text-ink/50">{l.note}</span>}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold text-forest">Account</h2>
        {session ? (
          <>
            <p className="text-sm text-ink/70">{session.user.email} · role: <strong>{profile?.role ?? 'tourist'}</strong></p>
            <Button variant="secondary" onClick={() => signOut()}>{t('logout')}</Button>
          </>
        ) : (
          <Link to="/login"><Button variant="secondary">{t('login')}</Button></Link>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold text-forest">Offline data</h2>
        <p className="text-xs text-ink/50">Clears cached destinations, phrases, saved device trips and favorites. Cloud-saved trips are not affected.</p>
        <Button variant="secondary" onClick={() => { clearZegaCache(); toast('Offline cache cleared. Reload to refetch.', 'success'); }}>
          Clear offline cache
        </Button>
        <p className="text-[10px] text-ink/30">Device ID: {getDeviceId()}</p>
      </Card>
    </div>
  );
}
