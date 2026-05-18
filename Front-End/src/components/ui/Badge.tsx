import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'rose' | 'cream' | 'green' | 'gray';
  className?: string;
};

export function Badge({ children, tone = 'rose', className = '' }: BadgeProps) {
  const tones = {
    rose: 'bg-brand/10 text-brand',
    cream: 'bg-cream text-cocoa',
    green: 'bg-emerald-50 text-emerald-700',
    gray: 'bg-stone-100 text-stone-600',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[tone]} ${className}`}>{children}</span>;
}
