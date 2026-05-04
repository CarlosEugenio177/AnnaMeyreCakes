type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  const size = compact ? 'h-28 w-28' : 'h-36 w-36';

  return (
    <div className={`${size} mx-auto`}>
      <svg viewBox="0 0 160 160" role="img" aria-label="Anna Meyre Cakes" className="h-full w-full">
        <circle cx="80" cy="80" r="75" fill="#F7F0C8" />
        <circle cx="80" cy="80" r="69" fill="none" stroke="#E2292F" strokeWidth="3" />
        <circle cx="80" cy="80" r="62" fill="none" stroke="#E2292F" strokeWidth="1.4" opacity="0.38" />
        <path
          d="M52 63c3-16 18-12 20-24 10 11 31 5 35 25 7 1 13 7 13 15 0 12-10 20-22 20H63c-13 0-23-8-23-20 0-8 5-14 12-16Z"
          fill="none"
          stroke="#E2292F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path
          d="M55 66c17 5 36 4 52 0M59 97c4 12 13 19 22 19s18-7 22-19M69 88c3 4 7 4 10 0M91 88c3 4 7 4 10 0"
          fill="none"
          stroke="#E2292F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path d="M76 102h13" stroke="#E2292F" strokeLinecap="round" strokeWidth="4" />
        <text
          x="80"
          y="135"
          textAnchor="middle"
          fill="#E2292F"
          fontFamily="Georgia, serif"
          fontSize="17"
          fontWeight="700"
        >
          Anna Meyre
        </text>
        <text
          x="80"
          y="151"
          textAnchor="middle"
          fill="#E2292F"
          fontFamily="Arial, sans-serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="3"
        >
          CAKES
        </text>
      </svg>
    </div>
  );
}
