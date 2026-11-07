type StepHeaderProps = {
  title: string;
  hint?: string;
  step?: number | string;
};

export function StepHeader({ title, hint, step }: StepHeaderProps) {
  return (
    <div className="mb-5 flex items-start gap-3">
      {step !== undefined ? (
        <span className="grid h-8 min-w-8 shrink-0 place-items-center rounded-full bg-blush px-2 text-xs font-bold text-brand">{step}</span>
      ) : null}
      <div>
        <h2 className="font-display text-xl font-semibold leading-tight text-cocoa sm:text-2xl">{title}</h2>
        {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
