type WhatsAppButtonProps = {
  href?: string;
  disabled?: boolean;
  children: string;
  onClick?: () => void;
};

export function WhatsAppButton({ href, disabled = false, children, onClick }: WhatsAppButtonProps) {
  const className = `block w-full rounded-full px-6 py-4 text-center text-base font-bold text-white shadow-button transition ${
    disabled ? 'pointer-events-none bg-brand/40' : 'bg-brand active:scale-[0.99]'
  }`;

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
