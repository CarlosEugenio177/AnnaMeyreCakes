type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <img
      src="/anna-meyre-logo-cropped.png"
      alt="Anna Meyre Cakes"
      className={`rounded-full bg-surface object-contain ring-1 ring-line ${compact ? 'h-11 w-11 p-0.5' : 'h-24 w-24 p-1'}`}
    />
  );
}
