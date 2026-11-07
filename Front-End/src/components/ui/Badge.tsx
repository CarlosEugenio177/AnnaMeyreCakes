import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'rose' | 'cream' | 'green' | 'gray' | 'butter';
  className?: string;
};

export function Badge({ children, tone = 'rose', className = '' }: BadgeProps) {
  const tones = {
    rose: 'bg-blush text-brand',
    cream: 'bg-cream text-choco',
    butter: 'bg-butter/50 text-choco',
    green: 'bg-emerald-50 text-emerald-700',
    gray: 'bg-stone-100 text-stone-500',
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]} ${className}`}>{children}</span>;
}
