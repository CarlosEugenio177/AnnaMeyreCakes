type StepHeaderProps = {
  title: string;
  hint?: string;
  eyebrow?: string;
};

export function StepHeader({ title, hint, eyebrow }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.45em] text-muted">{eyebrow}</p> : null}
      <h2 className="font-display text-[34px] leading-none text-cocoa">{title}</h2>
      {hint ? <p className="mt-4 text-lg leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}
