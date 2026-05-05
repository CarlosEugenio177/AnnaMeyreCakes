import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return <section className={`rounded-[30px] border border-line bg-surface p-6 ${className}`}>{children}</section>;
}
