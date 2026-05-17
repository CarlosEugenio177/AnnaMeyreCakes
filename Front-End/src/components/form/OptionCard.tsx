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
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[86px] rounded-[22px] border bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 md:min-h-[104px] md:px-6 lg:min-h-[78px] lg:rounded-[16px] lg:px-3.5 lg:py-2.5 ${
        selected ? 'border-cocoa bg-blush/45 text-cocoa shadow-[0_14px_36px_rgba(138,75,62,0.12),0_0_0_1px_rgba(138,75,62,0.18)] lg:shadow-[0_8px_20px_rgba(138,75,62,0.08),0_0_0_1px_rgba(138,75,62,0.16)]' : 'border-line text-cocoa shadow-[0_10px_28px_rgba(138,75,62,0.035)] hover:border-cocoa/35 lg:shadow-[0_6px_16px_rgba(138,75,62,0.025)]'
      } ${className}`}
    >
      <span className="flex items-center gap-4 lg:gap-2.5">
        {color ? <span className="h-12 w-12 shrink-0 rounded-full border border-line lg:h-7 lg:w-7" style={{ backgroundColor: color }} /> : null}
        <span className="min-w-0">{children}</span>
        {selected ? (
          <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa text-white lg:h-5 lg:w-5">
            <Check className="h-5 w-5 lg:h-3 lg:w-3" aria-hidden />
          </span>
        ) : null}
      </span>
    </button>
  );
}
