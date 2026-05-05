import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type OptionCardProps = {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  color?: string;
  onClick: () => void;
  className?: string;
};

export function OptionCard({ children, selected = false, disabled = false, color, onClick, className = '' }: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[86px] rounded-[22px] border bg-white px-6 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        selected ? 'border-cocoa bg-blush/45 text-cocoa shadow-[0_0_0_1px_rgba(138,75,62,0.18)]' : 'border-line text-cocoa hover:border-cocoa/35'
      } ${className}`}
    >
      <span className="flex items-center gap-4">
        {color ? <span className="h-12 w-12 shrink-0 rounded-full border border-line" style={{ backgroundColor: color }} /> : null}
        <span className="min-w-0">{children}</span>
        {selected ? (
          <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa text-white">
            <Check className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
      </span>
    </button>
  );
}
