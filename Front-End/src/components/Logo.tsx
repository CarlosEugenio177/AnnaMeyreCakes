type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="mx-auto flex flex-col items-center">
      <div
        className={`overflow-hidden rounded-full border border-brand/15 bg-white shadow-sm ${
          compact ? 'h-16 w-16' : 'h-28 w-28'
        }`}
      >
        <img
          src="/anna-meyre-logo-cropped.png"
          alt="Anna Meyre Cakes"
          className="h-full w-full object-contain p-1.5"
        />
      </div>
    </div>
  );
}
