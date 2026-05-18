type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Anna Meyre Cakes</p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-roseText md:text-[42px]">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
