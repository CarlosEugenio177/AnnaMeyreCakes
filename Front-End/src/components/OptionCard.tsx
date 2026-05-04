import type { PropsWithChildren } from 'react';

type OptionCardProps = PropsWithChildren<{
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}>;

export function OptionCard({ selected = false, disabled = false, onClick, className = '', children }: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-24 w-full rounded-[24px] border p-4 text-center shadow-sm transition ${
        selected
          ? 'border-brand bg-brand text-white shadow-button'
          : 'border-brand/10 bg-blush/72 text-brand hover:border-brand/30'
      } ${disabled ? 'cursor-not-allowed opacity-45' : 'active:scale-[0.98]'} ${className}`}
    >
      {children}
    </button>
  );
}
