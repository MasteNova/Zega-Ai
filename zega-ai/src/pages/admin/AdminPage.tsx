import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  adminList, adminUpsert, adminDelete, adminFeedback, moderateFeedback, listAudit, uploadAsset,
  listDestinations, listRoutes, listPhrases, listSosAlerts, type AdminTable
} from '../../lib/api';
import { friendlyError } from '../../lib/supabase';
import { Button, Card, Input, Select, Textarea, Modal, Badge, Skeleton, ErrorState, PageTitle, UnverifiedBadge } from '../../components/ui';
import { useToast } from '../../state/toast';
import { useAuth } from '../../state/auth';
import { dateTime } from '../../lib/format';
import AdminSos from './AdminSos';

type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'select' | 'csv' | 'image' | 'audio';
interface Field { key: string; label: string; type: FieldType; options?: string[]; }

const FIELDS: Record<AdminTable, Field[]> = {
  destinations: [
    { key: 'name', label: 'Name', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'category_id', label: 'Category', type: 'select', options: ['nature', 'wildlife', 'water', 'culture', 'market', 'viewpoint', 'food', 'hotel'] },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'lat', label: 'Latitude', type: 'number' }, { key: 'lng', label: 'Longitude', type: 'number' },
    { key: 'entry_fee_min', label: 'Entry fee min (ETB)', type: 'number' }, { key: 'entry_fee_max', label: 'Entry fee max (ETB)', type: 'number' },
    { key: 'visit_minutes', label: 'Visit minutes', type: 'number' },
    { key: 'opening_hours', label: 'Opening hours', type: 'text' },
    { key: 'local_tips', label: 'Local tips', type: 'textarea' }, { key: 'safety_notes', label: 'Safety notes', type: 'textarea' },
    { key: 'accessibility', label: 'Accessibility', type: 'textarea' },
    { key: 'interests', label: 'Interests (comma-separated)', type: 'csv' },
    { key: 'image_url', label: 'Image', type: 'image' },
    { key: 'is_verified', label: 'Verified (ground-truthed)', type: 'checkbox' },
    { key: 'is_active', label: 'Active', type: 'checkbox' }
  ],
  transport_routes: [
    { key: 'origin', label: 'Origin', type: 'text' }, { key: 'destination', label: 'Destination', type: 'text' },
    { key: 'vehicle_type', label: 'Vehicle', type: 'select', options: ['bajaj', 'taxi', 'minibus', 'boat', 'foot'] },
    { key: 'fare_min', label: 'Fare min (ETB)', type: 'number' }, { key: 'fare_max', label: 'Fare max (ETB)', type: 'number' },
    { key: 'distance_km', label: 'Distance km', type: 'number' },
    { key: 'conditions', label: 'Conditions', type: 'textarea' }, { key: 'source', label: 'Source', type: 'text' },
    { key: 'confidence', label: 'Confidence', type: 'select', options: ['verified', 'community', 'unverified'] },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' }, { key: 'is_active', label: 'Active', type: 'checkbox' }
  ],
  phrases: [
    { key: 'category', label: 'Category', type: 'select', options: ['greetings', 'transportation', 'directions', 'market', 'shopping', 'food', 'hotels', 'emergency', 'general'] },
    { key: 'english', label: 'English', type: 'text' },
    { key: 'amharic', label: 'Amharic', type: 'text' },
    { key: 'gamo', label: 'Gamo (native-speaker verified only)', type: 'text' },
    { key: 'transliteration', label: 'Transliteration', type: 'text' }, { key: 'dialect', label: 'Dialect', type: 'text' },
    { key: 'audio_url', label: 'Audio (native speaker recording)', type: 'audio' },
    { key: 'verification_status', label: 'Verification', type: 'select', options: ['unverified', 'verified'] },
    { key: 'notes', label: 'Notes', type: 'textarea' }, { key: 'is_active', label: 'Active', type: 'checkbox' }
  ],
  service_providers: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['guide', 'boat', 'hotel', 'restaurant', 'bajaj', 'cultural', 'other'] },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'location', label: 'Location', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' }, { key: 'services', label: 'Services (comma-separated)', type: 'csv' },
    { key: 'price_note', label: 'Price note', type: 'text' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' }, { key: 'is_active', label: 'Active', type: 'checkbox' }
  ]
};

const TABS = ['overview', 'destinations', 'fares', 'phrases', 'feedback', 'providers', 'sos', 'audit'] as const;
type Tab = typeof TABS[number];
const TAB_TABLE: Partial<Record<Tab, AdminTable>> = {
  destinations: 'destinations', fares: 'transport_routes', phrases: 'phrases', providers: 'service_providers'
};

function Editor({ table, row, onClose }: { table: AdminTable; row: Record<string, any> | null; onClose: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, any>>(row ?? { is_active: true, is_verified: false });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const clean: Record<string, any> = { ...form };
      if (clean.id === undefined) delete clean.id;
      for (const f of FIELDS[table]) {
        if (f.type === 'number') clean[f.key] = clean[f.key] === '' || clean[f.key] == null ? null : Number(clean[f.key]);
        if (f.type === 'csv') clean[f.key] = typeof clean[f.key] === 'string' ? clean[f.key].split(',').map((s: string) => s.trim()).filter(Boolean) : clean[f.key] ?? [];
      }
      if (table === 'destinations' && clean.is_verified) clean.last_verified_at = new Date().toISOString();
      if (table === 'transport_routes' && clean.is_verified) clean.last_verified_at = new Date().toISOString();
      await adminUpsert(table, clean);
      qc.invalidateQueries({ queryKey: ['admin', table] });
      toast('Saved.', 'success');
      onClose();
    } catch (e) { toast(friendlyError(e), 'error'); }
    finally { setBusy(false); }
  };

  const upload = async (key: string, bucket: 'destinations' | 'phrase-audio', file: File) => {
    try {
      const url = await uploadAsset(bucket, file);
      setForm((f) => ({ ...f, [key]: url }));
      toast('Uploaded.', 'success');
    } catch (e) { toast(friendlyError(e), 'error'); }
  };

  return (
    <Modal title={`${row ? 'Edit' : 'New'} — ${table.replace('_', ' ')}`} onClose={onClose}>
      <div className="space-y-3">
        {FIELDS[table].map((f) => {
          const v = form[f.key];
          if (f.type === 'checkbox') return (
            <label key={f.key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(v)} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} /> {f.label}
            </label>
          );
          if (f.type === 'select') return (
            <Select key={f.key} label={f.label} value={v ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
              <option value="">—</option>{f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
            </Select>
          );
          if (f.type === 'textarea') return <Textarea key={f.key} label={f.label} rows={3} value={v ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />;
          if (f.type === 'image' || f.type === 'audio') return (
            <div key={f.key} className="text-sm">
              <p className="font-medium text-ink/80 mb-1">{f.label}</p>
              {v && <p className="text-xs text-forest truncate mb-1">{String(v)}</p>}
              <input type="file" accept={f.type === 'image' ? 'image/*' : 'audio/*'}
                onChange={(e) => e.target.files?.[0] && upload(f.key, f.type === 'image' ? 'destinations' : 'phrase-audio', e.target.files[0])} />
            </div>
          );
          return <Input key={f.key} label={f.label} type={f.type === 'number' ? 'number' : 'text'} step="any"
            value={f.type === 'csv' ? (Array.isArray(v) ? v.join(', ') : v ?? '') : v ?? ''}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />;
        })}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function TableTab({ table }: { table: AdminTable }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Record<string, any> | null | undefined>(undefined);
  const q = useQuery({ queryKey: ['admin', table], queryFn: () => adminList(table) });

  const del = async (id: string) => {
    if (!window.confirm('Delete this record? This is audit-logged.')) return;
    try { await adminDelete(table, id); qc.invalidateQueries({ queryKey: ['admin', table] }); toast('Deleted.', 'info'); }
    catch (e) { toast(friendlyError(e), 'error'); }
  };

  const label = (r: any) => r.name ?? r.english ?? `${r.origin} → ${r.destination}`;

  return (
    <div className="space-y-3">
      <Button onClick={() => setEditing(null)}>+ New record</Button>
      {q.isLoading && <Skeleton className="h-48" />}
      {q.error && <ErrorState message={friendlyError(q.error)} onRetry={() => q.refetch()} />}
      {q.data?.map((r) => (
        <Card key={r.id} className="p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{label(r)}</p>
            <div className="flex gap-2 mt-1">
              {'is_verified' in r && <UnverifiedBadge verified={r.is_verified} />}
              {'verification_status' in r && <Badge tone={r.verification_status === 'verified' ? 'green' : 'gold'}>{r.verification_status}</Badge>}
              {'is_active' in r && !r.is_active && <Badge tone="red">inactive</Badge>}
            </div>
          </div>
          <Button variant="secondary" onClick={() => setEditing(r)}>Edit</Button>
          <Button variant="ghost" onClick={() => del(r.id)}>Delete</Button>
        </Card>
      ))}
      {editing !== undefined && <Editor table={table} row={editing} onClose={() => setEditing(undefined)} />}
    </div>
  );
}

function FeedbackTab() {
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['admin-feedback'], queryFn: adminFeedback });
  const act = async (id: string, status: 'approved' | 'rejected') => {
    try { await moderateFeedback(id, status); qc.invalidateQueries({ queryKey: ['admin-feedback'] }); toast(`Feedback ${status}.`, 'success'); }
    catch (e) { toast(friendlyError(e), 'error'); }
  };
  if (q.isLoading) return <Skeleton className="h-48" />;
  if (q.error) return <ErrorState message={friendlyError(q.error)} onRetry={() => q.refetch()} />;
  return (
    <div className="space-y-3">
      <p className="text-xs text-ink/50">Approving does NOT change reference fares — update routes manually after analysis.</p>
      {q.data?.map((f) => (
        <Card key={f.id} className="p-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={f.status === 'pending' ? 'gold' : f.status === 'approved' ? 'green' : 'red'}>{f.status}</Badge>
            <span>Quoted {f.quoted_price} ETB{f.paid_price != null ? ` · paid ${f.paid_price} ETB` : ''} · {f.passenger_count} pax</span>
            <span className="text-xs text-ink/40">{dateTime(f.created_at)}</span>
          </div>
          {f.comment && <p className="text-ink/60 mt-1">“{f.comment}”</p>}
          {f.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <Button onClick={() => act(f.id, 'approved')}>Approve</Button>
              <Button variant="secondary" onClick={() => act(f.id, 'rejected')}>Reject</Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function AuditTab() {
  const q = useQuery({ queryKey: ['audit'], queryFn: listAudit });
  if (q.isLoading) return <Skeleton className="h-48" />;
  if (q.error) return <ErrorState message={friendlyError(q.error)} onRetry={() => q.refetch()} />;
  return (
    <div className="space-y-2">
      {q.data?.map((l) => (
        <Card key={l.id} className="p-3 text-xs flex flex-wrap gap-2 items-center">
          <Badge>{l.action}</Badge><span className="font-mono">{l.table_name}</span>
          <span className="text-ink/40">{l.record_id?.slice(0, 8)}</span>
          <span className="text-ink/40 ml-auto">{dateTime(l.created_at)}</span>
        </Card>
      ))}
    </div>
  );
}

function Overview() {
  const d = useQuery({ queryKey: ['destinations'], queryFn: listDestinations });
  const r = useQuery({ queryKey: ['routes'], queryFn: listRoutes });
  const p = useQuery({ queryKey: ['phrases'], queryFn: listPhrases });
  const s = useQuery({ queryKey: ['sos-alerts'], queryFn: listSosAlerts });
  const stats = [
    { label: 'Active destinations', value: d.data?.length },
    { label: 'Fare routes', value: r.data?.length },
    { label: 'Phrases', value: p.data?.length },
    { label: 'Active SOS', value: s.data?.filter((a) => a.status === 'active').length }
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((st) => (
        <Card key={st.label} className="p-4">
          <p className="text-2xl font-display font-bold text-forest">{st.value ?? '…'}</p>
          <p className="text-xs text-ink/50 mt-1">{st.label}</p>
        </Card>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [params, setParams] = useSearchParams();
  const { profile } = useAuth();
  const tab = (params.get('tab') as Tab) || 'overview';
  const isAdmin = profile?.role === 'admin';
  const visible = TABS.filter((t) => isAdmin || t === 'overview' || t === 'sos');

  return (
    <div>
      <PageTitle title="Admin dashboard" sub={`Role: ${profile?.role}. All writes are RLS-enforced and audit-logged.`} />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {visible.map((tb) => (
          <button key={tb} onClick={() => setParams({ tab: tb })}
            className={clsx('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border capitalize', tab === tb ? 'bg-forest text-ivory border-forest' : 'bg-white border-forest/20')}>
            {tb}
          </button>
        ))}
      </div>
      {!isAdmin && tab !== 'sos' && tab !== 'overview'
        ? <ErrorState message="Admin role required for this section." />
        : tab === 'overview' ? <Overview />
        : tab === 'sos' ? <AdminSos />
        : tab === 'feedback' ? <FeedbackTab />
        : tab === 'audit' ? <AuditTab />
        : <TableTab table={TAB_TABLE[tab]!} />}
    </div>
  );
}
