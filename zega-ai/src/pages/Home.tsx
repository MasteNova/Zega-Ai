import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Map, Banknote, BookOpen, ShieldAlert, ArrowRight,
  Search, ChevronLeft, ChevronRight, CheckCircle2, Compass
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listDestinations } from '../lib/api';
import { friendlyError } from '../lib/supabase';
import DestinationCard from '../components/DestinationCard';
import { Card, Skeleton, ErrorState, Badge } from '../components/ui';
import { useI18n } from '../i18n';

const HERO_SLIDES = [
  {
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nechisar_National_Park_01.jpg?width=1400',
    eyebrow: 'Explore Arba Minch · Gamo Zone',
    title: 'Land of Forty Springs & Twin Rift Lakes',
    sub: 'AI-planned itineraries, live maps, fair bajaj estimates, Gamo phrases, and responder SOS — built for real travel in southern Ethiopia.'
  },
  {
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Chamo_01.jpg?width=1400',
    eyebrow: 'Lake Chamo & Nech Sar',
    title: 'Discover Wildlife, Boats & Highland Culture',
    sub: 'From Nile crocodiles on Lake Chamo to woven bamboo homes in Dorze Village, plan every hour around your ETB budget.'
  },
  {
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dorze_house.jpg?width=1400',
    eyebrow: 'Dorze & Chencha Highlands',
    title: 'Travel Smarter, Even When Signal Drops',
    sub: 'Offline-ready maps, native-friendly Gamo & Amharic phrase cards, and local Arba Minch emergency contacts.'
  }
];

const ABOUT_IMG = 'https://commons.wikimedia.org/wiki/Special:FilePath/Arba_Minch,_Chamo_and_Abaya.jpg?width=900';

export default function Home() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(id);
  }, []);

  const current = HERO_SLIDES[slide];
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav(search.trim() ? `/explore?q=${encodeURIComponent(search.trim())}` : '/explore');
  };

  const services = [
    { to: '/planner', icon: Sparkles, title: t('planner'), desc: 'Gemini AI builds time- and ETB-aware routes from verified local spots.' },
    { to: '/map', icon: Map, title: t('map'), desc: 'Interactive Leaflet map of parks, lakes, markets & viewpoints.' },
    { to: '/fares', icon: Banknote, title: t('fares'), desc: 'Compare bajaj, minibus & boat quotes against local estimates.' },
    { to: '/phrases', icon: BookOpen, title: t('phrases'), desc: 'English · Amharic · Gamo cards with full-screen driver mode.' },
    { to: '/safety', icon: ShieldAlert, title: t('safety'), desc: 'Direct SOS alerts to Zega responders + local emergency lines.' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Carousel + Floating Search Bar (Travela-inspired) */}
      <section className="relative">
        <div className="relative rounded-2xl overflow-hidden bg-forest text-ivory min-h-[420px] md:min-h-[480px] flex items-center justify-center shadow-card">
          <img
            src={current.img}
            alt={current.title}
            className="absolute inset-0 w-full h-full object-cover opacity-55 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-700/95 via-forest/65 to-forest-700/40" />

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="hidden sm:flex absolute left-4 z-10 w-10 h-10 rounded-full bg-forest/70 hover:bg-forest text-ivory items-center justify-center border border-ivory/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
            className="hidden sm:flex absolute right-4 z-10 w-10 h-10 rounded-full bg-forest/70 hover:bg-forest text-ivory items-center justify-center border border-ivory/20"
          >
            <ChevronRight size={20} />
          </button>

          <div className="relative z-10 text-center px-6 py-12 max-w-3xl mx-auto">
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-gold mb-3">{current.eyebrow}</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">{current.title}</h1>
            <p className="mt-4 text-ivory/90 text-sm md:text-base max-w-2xl mx-auto">{current.sub}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 bg-gold text-ink font-semibold rounded-full px-6 py-3 text-sm hover:bg-gold/90 shadow-lg"
              >
                {t('generate')} <ArrowRight size={16} />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-ivory/40 text-ivory rounded-full px-6 py-3 text-sm font-semibold hover:bg-white/25"
              >
                <Compass size={16} /> {t('explore')}
              </Link>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === slide ? 'w-7 bg-gold' : 'w-2 bg-ivory/40'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <form
          onSubmit={onSearch}
          className="relative z-20 -mt-7 max-w-2xl mx-auto px-3"
        >
          <div className="flex items-center bg-white rounded-full shadow-card border border-forest/15 p-1.5 pl-4">
            <Search size={18} className="text-forest/50 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Arba Minch: Nech Sar, Lake Chamo, Dorze, Forty Springs…"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-ink focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-forest text-ivory px-5 py-2.5 text-sm font-semibold hover:bg-forest-600 transition-colors"
            >
              {t('search')}
            </button>
          </div>
        </form>
      </section>

      {/* Services Grid (A-World & Travela inspired) */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-terra-700 font-semibold">Services</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest mt-1">
            Everything you need in Arba Minch
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {services.map((s) => (
            <Link key={s.to} to={s.to} className="group">
              <Card className="p-4 h-full border-forest/10 group-hover:border-forest/40 group-hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.to === '/safety' ? 'bg-terra-100 text-terra-700' : 'bg-forest-100 text-forest'}`}>
                  <s.icon size={20} />
                </div>
                <p className="font-semibold text-sm text-forest">{s.title}</p>
                <p className="text-xs text-ink/60 mt-1 hidden md:block leading-relaxed">{s.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* About Arba Minch Split Section */}
      <section className="grid md:grid-cols-2 gap-6 items-center bg-white rounded-2xl p-5 md:p-8 border border-forest/10 shadow-card">
        <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-forest">
          <img src={ABOUT_IMG} alt="Arba Minch between Lakes Abaya and Chamo" className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3">
            <Badge tone="green">Lakes Abaya &amp; Chamo · Gamo Zone</Badge>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-terra-700 font-semibold">About Arba Minch</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest">
            Between Two Rift Valley Lakes &amp; the Gamo Highlands
          </h2>
          <p className="text-sm text-ink/70 leading-relaxed">
            Built for travelers exploring Sikela, Shecha, Nech Sar National Park, Lake Chamo, and highland villages like Dorze and Chencha.
            Zega-AI combines local fare transparency, Gamo &amp; Amharic phrases, and offline-first safety in one place.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs font-medium text-forest">
            <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-terra" /> Catalog-grounded AI plans</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-terra" /> Fair bajaj &amp; boat estimates</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-terra" /> Gamo · Amharic · English</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-terra" /> Offline PWA + Live SOS</li>
          </ul>
          <div className="pt-1 flex flex-wrap gap-3">
            <Link to="/about" className="inline-flex items-center gap-1.5 rounded-full bg-forest text-ivory px-5 py-2.5 text-xs font-semibold hover:bg-forest-600">
              Learn more <ArrowRight size={14} />
            </Link>
            <Link to="/phrases" className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 text-forest px-5 py-2.5 text-xs font-semibold hover:bg-forest-100">
              Open phrasebook
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-terra-700 font-semibold">Destination</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest mt-1">
              Popular Arba Minch Spots
            </h2>
          </div>
          <Link to="/explore" className="text-sm text-terra-700 font-semibold hover:underline inline-flex items-center gap-1">
            {t('explore')} <ArrowRight size={15} />
          </Link>
        </div>
        {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64" />)}</div>}
        {error && <ErrorState message={friendlyError(error)} onRetry={() => refetch()} />}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.filter((d) => d.image_url).slice(0, 8).map((d) => <DestinationCard key={d.id} d={d} />)}
          </div>
        )}
      </section>

      {/* Curated Arba Minch Experiences (Travela Packages inspired) */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-terra-700 font-semibold">Curated Experiences</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest mt-1">
            Signature Arba Minch Routes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: 'Lake Chamo Safari & Crocodile Market',
              tag: '2.5 hrs · Boat',
              price: 'Est. 1,500–2,500 ETB / boat',
              img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Chamo_01.jpg?width=900',
              desc: 'Morning motorboat excursion across Lake Chamo to spot Nile crocodiles, hippos, and pelicans.'
            },
            {
              title: 'Nech Sar Park & Forty Springs Trail',
              tag: '4 hrs · Nature',
              price: 'Est. 100–200 ETB entry',
              img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Natural_pool_in_Arba_Minch.jpg?width=900',
              desc: 'Explore the groundwater forest springs, colobus monkeys, and panoramic Bridge of God ridge.'
            },
            {
              title: 'Dorze Highlands & Weaving Heritage',
              tag: 'Half Day · Culture',
              price: 'Est. 100–200 ETB minibus',
              img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dorze_huts.jpg?width=900',
              desc: 'Ascend into the Gamo Highlands for elephant-shaped bamboo homes, weaving, and fresh kocho.'
            }
          ].map((pkg) => (
            <Card key={pkg.title} className="overflow-hidden flex flex-col">
              <div className="relative h-48 bg-forest overflow-hidden">
                <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-forest/90 text-ivory px-3 py-1 text-[11px] font-semibold">{pkg.tag}</span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-gold">{pkg.price}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display font-semibold text-lg text-forest">{pkg.title}</h3>
                <p className="text-sm text-ink/65 mt-2 flex-1">{pkg.desc}</p>
                <Link to="/planner" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-terra-700 hover:underline">
                  Build this in AI Planner <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
