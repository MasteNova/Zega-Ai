import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState { session: Session | null; profile: Profile | null; loading: boolean; signOut: () => Promise<void>; }
const AuthCtx = createContext<AuthState>({ session: null, profile: null, loading: true, signOut: async () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) { setProfile(null); return; }
    supabase.from('profiles').select('id,display_name,role').eq('id', session.user.id).single()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [session]);

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); };
  return <AuthCtx.Provider value={{ session, profile, loading, signOut }}>{children}</AuthCtx.Provider>;
}
