import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
};

export function Card({ children, className = '', 'data-testid': testId }: CardProps) {
  return (
    <section data-testid={testId} className={`rounded-3xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}
