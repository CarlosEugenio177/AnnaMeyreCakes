import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type OptionCardProps = {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  color?: string;
  // Texto curto no selo de selecionado (ex.: "1º"). Sem ele, mostra um check.
  badge?: string;
  onClick: () => void;
  className?: string;
  testId?: string;
};

export function OptionCard({ children, selected = false, disabled = false, color, badge, onClick, className = '', testId }: OptionCardProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 py-3 pl-3 pr-9 text-left text-choco transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:pl-3.5 ${
        selected ? 'border-brand bg-blush' : 'border-line bg-surface hover:-translate-y-0.5 hover:border-choco/20'
      } ${className}`}
    >
      {color ? (
        <span
          className={`h-8 w-8 shrink-0 rounded-full shadow-[inset_0_-3px_0_rgba(0,0,0,0.12)] ring-2 transition ${selected ? 'ring-white' : 'ring-line'}`}
          style={{ backgroundColor: color }}
        />
      ) : null}
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <span
        className={`absolute right-2.5 top-2.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-extrabold transition ${
          selected ? 'scale-100 bg-brand text-white' : 'scale-90 border-2 border-line'
        }`}
        aria-hidden
      >
        {selected ? badge ?? <Check className="h-3 w-3" strokeWidth={3.5} /> : null}
      </span>
    </button>
  );
}
