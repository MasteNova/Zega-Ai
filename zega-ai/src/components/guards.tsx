import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../state/auth';
import { Skeleton, ErrorState } from './ui';

export function RequireStaff({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <div className="space-y-3"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;
  if (!session) return <Navigate to="/login" replace />;
  const ok = adminOnly ? profile?.role === 'admin' : profile?.role === 'admin' || profile?.role === 'responder';
  if (!ok) return <ErrorState message="Your account does not have staff access. Ask an administrator to grant the responder or admin role." />;
  return <>{children}</>;
}
