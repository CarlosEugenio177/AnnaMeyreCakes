type StepHeaderProps = {
  title: string;
  hint?: string;
  step?: number | string;
};

export function StepHeader({ title, hint, step }: StepHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-4">
      {step !== undefined ? (
        <span className="grid h-11 w-11 shrink-0 rotate-[-6deg] place-items-center rounded-2xl bg-butter font-display text-xl text-choco shadow-[0_6px_0_-1px_rgba(42,23,18,0.12)]">
          {step}
        </span>
      ) : null}
      <div>
        <h2 className="font-display text-2xl leading-tight text-choco sm:text-[28px]">{title}</h2>
        {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
