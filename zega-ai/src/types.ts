export type Role = 'tourist' | 'admin' | 'responder';
export interface Profile { id: string; display_name: string | null; role: Role; }

export interface Category { id: string; name_en: string; name_am: string | null; icon: string | null; }

export interface Destination {
  id: string; slug: string; name: string; city: string; category_id: string | null;
  description: string | null; lat: number; lng: number;
  entry_fee_min: number | null; entry_fee_max: number | null; currency: string;
  opening_hours: string | null; visit_minutes: number;
  safety_notes: string | null; accessibility: string | null; local_tips: string | null;
  image_url: string | null; interests: string[];
  is_verified: boolean; last_verified_at: string | null; is_active: boolean;
}

export interface TransportRoute {
  id: string; origin: string; destination: string; vehicle_type: string;
  fare_min: number | null; fare_max: number | null; currency: string;
  distance_km: number | null; conditions: string | null; source: string | null;
  confidence: 'verified' | 'community' | 'unverified'; is_verified: boolean;
  last_verified_at: string | null; is_active: boolean;
}

export interface Phrase {
  id: string; category: string; english: string; amharic: string | null; gamo: string | null;
  transliteration: string | null; dialect: string | null; audio_url: string | null;
  verification_status: 'verified' | 'unverified'; notes: string | null; is_active: boolean;
}

export interface FareFeedback {
  id: string; device_id: string; route_id: string | null; quoted_price: number;
  paid_price: number | null; passenger_count: number; comment: string | null;
  status: 'pending' | 'approved' | 'rejected'; created_at: string;
}

export interface Provider {
  id: string; name: string; category: string; description: string | null; location: string | null;
  lat: number | null; lng: number | null; phone: string | null; services: string[];
  price_note: string | null; is_verified: boolean; is_active: boolean;
}

export interface ItineraryInput {
  city: string; budgetEtb: number; hours: number; startTime: string; startLocation: string;
  interests: string[]; groupSize: number; travelStyle: 'relaxed' | 'balanced' | 'packed';
  transport: 'bajaj' | 'taxi' | 'foot' | 'any';
}

export interface ItineraryStop {
  destinationId: string; name: string; lat: number; lng: number;
  arrive: string; depart: string; minutes: number; activity: string; description?: string;
  entryMin: number; entryMax: number; transportMin: number; transportMax: number; isVerified: boolean;
}

export interface ItineraryPayload {
  title: string; city: string; source: 'ai' | 'fallback';
  budgetEtb: number; startTime: string; groupSize: number;
  stops: ItineraryStop[];
  totals: { entryMin: number; entryMax: number; transportMin: number; transportMax: number; totalMin: number; totalMax: number };
  remainingMin: number; remainingMax: number;
  tips: string[]; safety: string[]; alternatives: { id: string; name: string }[]; warnings: string[];
}

export interface SavedItinerary { id: string; title: string; payload: ItineraryPayload; created_at: string; cloud: boolean; }

export interface SosAlert {
  id: string; device_id: string; lat: number; lng: number; accuracy_m: number | null;
  message: string | null; status: 'active' | 'acknowledged' | 'resolved' | 'cancelled';
  created_at: string; acknowledged_at: string | null; resolved_at: string | null;
}

export interface SosStatus { status: SosAlert['status']; created_at: string; acknowledged_at: string | null; resolved_at: string | null; }
export interface AuditLog { id: number; actor: string | null; action: string; table_name: string; record_id: string | null; created_at: string; }
