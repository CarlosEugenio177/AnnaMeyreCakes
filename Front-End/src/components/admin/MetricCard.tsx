import type { LucideIcon } from 'lucide-react';
import { AdminCard } from './AdminCard';

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: 'rose' | 'green' | 'cream';
};

export function MetricCard({ label, value, hint, icon: Icon, tone = 'rose' }: MetricCardProps) {
  const toneClass = {
    rose: 'bg-blush text-brand',
    green: 'bg-emerald-50 text-emerald-700',
    cream: 'bg-butter/40 text-choco',
  }[tone];

  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
        {Icon ? (
          <span className={`grid h-9 w-9 shrink-0 rotate-[-6deg] place-items-center rounded-xl ${toneClass}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl leading-tight text-choco">{value}</p>
      {hint ? <p className="mt-1 text-xs font-semibold text-muted">{hint}</p> : null}
    </AdminCard>
  );
}
