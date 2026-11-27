import { createContext, useContext, useState, type ReactNode } from 'react';
import { readCache, writeCache } from './lib/cache';

export type Lang = 'en' | 'am' | 'gamo';

const en = {
  home: 'Home', explore: 'Explore', map: 'Map', planner: 'Planner', fares: 'Fares',
  phrases: 'Phrases', safety: 'Safety', saved: 'Saved', preferences: 'Preferences', about: 'About',
  login: 'Sign in', logout: 'Sign out', admin: 'Admin', search: 'Search', save: 'Save',
  generate: 'Generate itinerary', budget: 'Budget (ETB)', duration: 'Available hours',
  startTime: 'Start time', startLocation: 'Starting location', interests: 'Interests',
  groupSize: 'Group size', transport: 'Transport', style: 'Travel style',
  sendSOS: 'Send SOS', offline: 'You are offline — cached data shown. AI and SOS need network.',
  language: 'Language', estimated: 'Estimate', unverified: 'Unverified demo data',
  verified: 'Verified', loading: 'Loading…', retry: 'Retry', cancel: 'Cancel', confirm: 'Confirm',
  quote: 'Quoted price (ETB)', check: 'Check price', passengers: 'Passengers',
  favorites: 'Favorites', all: 'All', close: 'Close', openMap: 'Open in Google Maps',
  gamoNotice: 'Gamo interface translation is pending native-speaker verification — showing English.',
  saveTrip: 'Save this trip', total: 'Estimated total', remaining: 'Remaining budget',
  tips: 'Travel tips', safetyNotes: 'Safety considerations', alternatives: 'Alternatives',
  aiNeedsNet: 'AI planning needs internet. Offline, you get a clearly-labeled sample plan.',
  viewList: 'List', viewMap: 'Map', locateMe: 'Locate me', feedback: 'Submit fare feedback'
};
type Dict = typeof en;

const am: Partial<Dict> = {
  home: 'መነሻ', explore: 'ያስሱ', map: 'ካርታ', planner: 'የጉዞ እቅድ', fares: 'ዋጋዎች',
  phrases: 'ሐረጎች', safety: 'ደህንነት', saved: 'የተቀመጡ', preferences: 'ምርጫዎች', about: 'ስለ እኛ',
  login: 'ይግቡ', logout: 'ይውጡ', admin: 'አስተዳዳሪ', search: 'ፈልግ', save: 'አስቀምጥ',
  generate: 'እቅድ አዘጋጅ', budget: 'በጀት (ብር)', duration: 'ያለዎት ሰዓት', startTime: 'የመነሻ ሰዓት',
  startLocation: 'የመነሻ ቦታ', interests: 'ፍላጎቶች', groupSize: 'የቡድን ብዛት',
  transport: 'ትራንስፖርት', style: 'የጉዞ ዘይቤ', sendSOS: 'የአደጋ ማንቂያ ላክ',
  offline: 'ከመስመር ውጪ ነዎት — የተቀመጠ መረጃ ብቻ። AI እና SOS ኢንተርኔት ይፈልጋሉ።',
  language: 'ቋንቋ', estimated: 'ግምት', unverified: 'ያልተረጋገጠ መረጃ', verified: 'የተረጋገጠ',
  loading: 'በመጫን ላይ…', retry: 'እንደገና ሞክር', cancel: 'ሰርዝ', confirm: 'አረጋግጥ',
  quote: 'የተነገረዎት ዋጋ (ብር)', check: 'ዋጋ ያረጋግጡ', passengers: 'ተሳፋሪዎች',
  favorites: 'ተወዳጆች', all: 'ሁሉም', close: 'ዝጋ', openMap: 'በGoogle ካርታ ክፈት',
  saveTrip: 'ይህን ጉዞ አስቀምጥ', total: 'ጠቅላላ ግምት', remaining: 'የቀረ በጀት',
  tips: 'የጉዞ ምክሮች', safetyNotes: 'የደህንነት ማስታወሻዎች', alternatives: 'አማራጮች',
  viewList: 'ዝርዝር', viewMap: 'ካርታ', locateMe: 'አካሄዴን አሳይ', feedback: 'የዋጋ አስተያየት ላክ'
};

interface I18n { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof Dict) => string; }
const I18nCtx = createContext<I18n>({ lang: 'en', setLang: () => {}, t: (k) => en[k] });
export const useI18n = () => useContext(I18nCtx);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readCache<Lang>('lang') ?? 'en');
  const setLang = (l: Lang) => { setLangState(l); writeCache('lang', l); };
  const t = (k: keyof Dict): string => (lang === 'am' ? am[k] : undefined) ?? en[k];
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}
