import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, friendlyError } from '../lib/supabase';
import { Button, Card, Input, PageTitle } from '../components/ui';
import { useToast } from '../state/toast';
import { useI18n } from '../i18n';

export default function Login() {
  const { t } = useI18n();
  const toast = useToast();
  const nav = useNavigate();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!supabase) { toast('Backend not configured — see README.', 'error'); return; }
    setBusy(true);
    try {
      if (mode === 'up') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast('Account created. If email confirmation is enabled, check your inbox.', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast('Signed in.', 'success');
        nav('/');
      }
    } catch (e) { toast(friendlyError(e), 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-sm mx-auto">
      <PageTitle title={mode === 'in' ? t('login') : 'Create account'} sub="Tourists sync saved trips. Staff access the responder/admin dashboard." />
      <Card className="p-5 space-y-4">
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" disabled={busy || !email || password.length < 6} onClick={submit}>
          {busy ? t('loading') : mode === 'in' ? t('login') : 'Sign up'}
        </Button>
        <button className="text-sm text-terra-700 underline w-full text-center" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
          {mode === 'in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </Card>
    </div>
  );
}
