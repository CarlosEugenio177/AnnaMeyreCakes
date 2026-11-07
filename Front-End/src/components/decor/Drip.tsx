type DripProps = {
  className?: string;
  color?: string;
};

// Borda de "cobertura escorrendo" usada para fechar secoes escuras.
export function Drip({ className = '', color = '#2A1712' }: DripProps) {
  return (
    <svg className={`block w-full ${className}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
      <path
        fill={color}
        d="M0 0h1440v28c-40 0-52 30-80 30s-30-34-62-34-26 52-58 52-30-48-64-48-38 22-70 22-34-30-66-30-30 58-64 58-34-56-68-56-34 26-66 26-32-22-64-22-30 44-62 44-34-48-66-48-34 30-68 30-30-36-62-36-34 60-68 60-32-58-66-58-34 24-66 24-32-26-64-26-30 40-62 40-34-44-66-44-36 32-70 32-32-30-62-30-30 50-62 50-34-52-66-52-38 26-68 26-30-22-60-22-30 34-60 34-28-34-56-34V0z"
      />
    </svg>
  );
}
