import type { StoreStatus } from '../../types';

type StoreStatusToggleProps = {
  value: StoreStatus;
  disabled?: boolean;
  onChange: (value: StoreStatus) => void;
};

export function StoreStatusToggle({ value, disabled = false, onChange }: StoreStatusToggleProps) {
  const open = value === 'OPEN';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(open ? 'CLOSED' : 'OPEN')}
      className={`flex w-full items-center justify-between rounded-full border p-1 transition ${
        open ? 'border-emerald-200 bg-emerald-50/80' : 'border-brand/20 bg-brand/10'
      } disabled:cursor-wait disabled:opacity-70`}
    >
      <span className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-bold transition ${open ? 'bg-white text-emerald-700 shadow-sm' : 'text-cocoa/70'}`}>
        Loja Aberta
      </span>
      <span className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-bold transition ${!open ? 'bg-white text-brand shadow-sm' : 'text-cocoa/70'}`}>
        Loja Fechada
      </span>
    </button>
  );
}
