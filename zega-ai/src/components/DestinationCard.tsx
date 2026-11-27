import { Link } from 'react-router-dom';
import { MapPin, Clock, Mountain } from 'lucide-react';
import type { Destination } from '../types';
import { Card, Badge, UnverifiedBadge } from './ui';
import { range } from '../lib/format';

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link to={`/destination/${d.id}`} className="block group">
      <Card className="overflow-hidden h-full group-hover:shadow-lg transition-shadow">
        <div className="h-36 bg-forest flex items-center justify-center relative">
          {d.image_url
            ? <img src={d.image_url} alt={d.name} loading="lazy" className="w-full h-full object-cover" />
            : <Mountain size={40} className="text-ivory/40" />}
          <div className="absolute top-2 left-2"><UnverifiedBadge verified={d.is_verified} /></div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-forest leading-tight">{d.name}</h3>
            {d.category_id && <Badge>{d.category_id}</Badge>}
          </div>
          <p className="text-sm text-ink/60 mt-1 line-clamp-2">{d.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-ink/50">
            <span className="inline-flex items-center gap-1"><Clock size={13} /> {d.visit_minutes} min</span>
            {d.entry_fee_min != null && (
              <span className="inline-flex items-center gap-1"><MapPin size={13} /> {range(Number(d.entry_fee_min), Number(d.entry_fee_max ?? d.entry_fee_min))}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
