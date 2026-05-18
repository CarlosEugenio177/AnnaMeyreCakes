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
    rose: 'bg-brand/10 text-brand ring-brand/10',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    cream: 'bg-blush/75 text-cocoa ring-line',
  }[tone];

  return (
    <AdminCard className="min-h-[126px] p-4 md:p-[18px]">
      <div className="flex h-full min-h-[90px] flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="pt-1 text-[11px] font-bold uppercase leading-4 tracking-[0.16em] text-muted">{label}</p>
        {Icon ? (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${toneClass}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
        ) : null}
        </div>
        <div>
          <p className="font-display text-[25px] font-bold leading-tight text-roseText md:text-[26px]">{value}</p>
          {hint ? <p className="mt-1.5 text-xs font-semibold leading-5 text-muted">{hint}</p> : null}
        </div>
      </div>
    </AdminCard>
  );
}
