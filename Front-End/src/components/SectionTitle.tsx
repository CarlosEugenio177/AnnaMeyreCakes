type SectionTitleProps = {
  title: string;
  hint?: string;
};

export function SectionTitle({ title, hint }: SectionTitleProps) {
  return (
    <div className="mb-4 text-center">
      <div className="mx-auto mb-3 h-px w-24 bg-brand/18" />
      <h2 className="font-display text-2xl font-bold text-brand">{title}</h2>
      {hint ? <p className="mt-1 text-sm leading-relaxed text-softGray">{hint}</p> : null}
    </div>
  );
}
