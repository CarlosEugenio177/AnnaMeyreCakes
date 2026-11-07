import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type OptionCardProps = {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  color?: string;
  onClick: () => void;
  className?: string;
  testId?: string;
};

export function OptionCard({ children, selected = false, disabled = false, color, onClick, className = '', testId }: OptionCardProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex min-h-[60px] w-full items-center gap-2.5 rounded-2xl border py-3 pl-3 pr-8 text-left text-cocoa transition disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3 sm:pl-4 ${
        selected ? 'border-brand bg-brand/[0.04] ring-1 ring-brand' : 'border-line bg-surface hover:border-cocoa/25'
      } ${className}`}
    >
      {color ? <span className="h-6 w-6 shrink-0 rounded-full ring-1 ring-black/10 sm:h-7 sm:w-7" style={{ backgroundColor: color }} /> : null}
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <span
        className={`absolute right-2.5 top-2.5 grid h-[18px] w-[18px] place-items-center rounded-full transition ${selected ? 'bg-brand text-white' : 'border border-line'}`}
        aria-hidden
      >
        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}
