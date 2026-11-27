import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const OnlineCtx = createContext(true);
export const useOnline = () => useContext(OnlineCtx);

export function OnlineProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return <OnlineCtx.Provider value={online}>{children}</OnlineCtx.Provider>;
}
