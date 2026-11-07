import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
};

export function Card({ children, className = '', 'data-testid': testId }: CardProps) {
  return (
    <section data-testid={testId} className={`rounded-[28px] bg-surface p-5 shadow-soft sm:p-7 ${className}`}>
      {children}
    </section>
  );
}
