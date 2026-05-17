type StepHeaderProps = {
  title: string;
  hint?: string;
  eyebrow?: string;
};

export function StepHeader({ title, hint, eyebrow }: StepHeaderProps) {
  return (
    <div className="mb-6 md:mb-7 lg:mb-3">
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-muted lg:mb-1.5 lg:text-[9px] lg:tracking-[0.22em]">{eyebrow}</p> : null}
      <h2 className="font-display text-[34px] leading-none text-cocoa md:text-[38px] lg:text-[24px]">{title}</h2>
      {hint ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted lg:mt-1.5 lg:text-xs lg:leading-5">{hint}</p> : null}
    </div>
  );
}
