import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertTriangle, Inbox, X } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
export function Button({ variant = 'primary', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold',
        variant === 'primary' && 'bg-forest text-ivory hover:bg-forest-600',
        variant === 'secondary' && 'bg-ivory-dark text-forest border border-forest/20 hover:bg-forest-100',
        variant === 'danger' && 'bg-terra-700 text-white hover:bg-terra',
        variant === 'gold' && 'bg-gold text-ink hover:bg-gold/80',
        variant === 'ghost' && 'text-forest hover:bg-forest-100',
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('bg-white rounded-xl border border-forest/10 shadow-card', className)}>{children}</div>;
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'green' | 'gold' | 'red' | 'blue'; children: ReactNode }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
      tone === 'neutral' && 'bg-ivory-dark text-ink/70',
      tone === 'green' && 'bg-forest-100 text-forest',
      tone === 'gold' && 'bg-gold-100 text-terra-700',
      tone === 'red' && 'bg-terra-100 text-terra-700',
      tone === 'blue' && 'bg-blue-50 text-blue-800')}>
      {children}
    </span>
  );
}

export function Input({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-ink/80">{label}</span>}
      <input className={clsx('w-full rounded-lg border border-forest/20 bg-white px-3 py-2.5 focus:border-forest focus:outline-none', className)} {...props} />
    </label>
  );
}

export function Select({ label, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-ink/80">{label}</span>}
      <select className={clsx('w-full rounded-lg border border-forest/20 bg-white px-3 py-2.5 focus:border-forest focus:outline-none', className)} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-ink/80">{label}</span>}
      <textarea className={clsx('w-full rounded-lg border border-forest/20 bg-white px-3 py-2.5 focus:border-forest focus:outline-none', className)} {...props} />
    </label>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-lg bg-forest/10', className)} />;
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12 px-4">
      <Inbox className="mx-auto mb-3 text-forest/40" size={36} />
      <p className="font-semibold text-ink">{title}</p>
      {hint && <p className="text-sm text-ink/60 mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12 px-4" role="alert">
      <AlertTriangle className="mx-auto mb-3 text-terra" size={36} />
      <p className="font-semibold text-ink">Something went wrong</p>
      <p className="text-sm text-ink/60 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center bg-ink/50 p-0 md:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-ivory w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-forest">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded hover:bg-forest-100"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">{title}</h1>
      {sub && <p className="text-sm text-ink/60 mt-1">{sub}</p>}
    </header>
  );
}

export function UnverifiedBadge({ verified }: { verified: boolean }) {
  return verified
    ? <Badge tone="green">Verified</Badge>
    : <Badge tone="gold">Estimate / unverified</Badge>;
}
