// Ilustracao do bolo que muda de cor conforme as escolhas do cliente.
// Desenhada em SVG (cilindro em perspectiva): 3 camadas de massa, 2 de recheio,
// cobertura escorrendo por cima e docinhos no prato quando selecionados.

type CakePreviewProps = {
  doughColor?: string;
  filling1Color?: string;
  filling2Color?: string;
  toppingColor?: string;
  // 0 (menor tamanho) a 1 (maior tamanho): controla a escala do bolo.
  sizeRatio?: number;
  sweetsCount?: number;
  className?: string;
};

const CX = 120;
const RX = 80;
const RY = 16;
const LEFT = CX - RX;
const RIGHT = CX + RX;
const TOP = 78;

const layers = [
  { from: 78, to: 112, kind: 'dough' },
  { from: 112, to: 120, kind: 'filling1' },
  { from: 120, to: 150, kind: 'dough' },
  { from: 150, to: 158, kind: 'filling2' },
  { from: 158, to: 188, kind: 'dough' },
] as const;

const drips = [
  { x: 52, depth: 10 },
  { x: 72, depth: 20 },
  { x: 94, depth: 12 },
  { x: 116, depth: 24 },
  { x: 138, depth: 14 },
  { x: 160, depth: 22 },
  { x: 182, depth: 11 },
];

const sprinkles = [
  { x: 92, y: 74, r: 20, c: '#DB3A63' },
  { x: 108, y: 82, r: -35, c: '#F7C873' },
  { x: 126, y: 72, r: 60, c: '#FFFFFF' },
  { x: 142, y: 80, r: 15, c: '#DB3A63' },
  { x: 156, y: 74, r: -50, c: '#F7C873' },
  { x: 118, y: 86, r: 80, c: '#F49AB0' },
  { x: 80, y: 80, r: -10, c: '#F49AB0' },
];

export function CakePreview({
  doughColor = '#F6DFBD',
  filling1Color = '#FFF3D6',
  filling2Color = '#553022',
  toppingColor = '#F9E0C8',
  sizeRatio = 0.5,
  sweetsCount = 0,
  className = '',
}: CakePreviewProps) {
  const scale = 0.82 + Math.min(Math.max(sizeRatio, 0), 1) * 0.18;
  const colorOf = (kind: (typeof layers)[number]['kind']) =>
    kind === 'dough' ? doughColor : kind === 'filling1' ? filling1Color : filling2Color;

  return (
    <svg viewBox="0 0 240 236" className={className} role="img" aria-label="Prévia ilustrativa do seu bolo">
      {/* Prato */}
      <ellipse cx={CX} cy={206} rx={112} ry={20} fill="#EADBC8" />
      <ellipse cx={CX} cy={202} rx={104} ry={16} fill="#FFFFFF" />

      <g style={{ transform: `scale(${scale})`, transformOrigin: '120px 204px', transition: 'transform .45s cubic-bezier(.2,.9,.3,1.2)' }}>
        {/* Sombra no prato */}
        <ellipse cx={CX} cy={202} rx={RX + 4} ry={RY - 2} fill="rgba(42,23,18,0.12)" />

        {layers.map((layer) => (
          <path key={layer.from} d={band(layer.from, layer.to)} fill={colorOf(layer.kind)} style={{ transition: 'fill .4s ease' }} />
        ))}
        {/* Sombreado lateral para dar volume */}
        <path d={band(TOP, 188)} fill="url(#cake-shade)" />

        {/* Cobertura com gotas */}
        <path d={frosting()} fill={toppingColor} style={{ transition: 'fill .4s ease' }} />
        <path d={frosting()} fill="url(#frosting-shine)" />
        <ellipse cx={CX} cy={TOP} rx={RX} ry={RY} fill="#FFFFFF" opacity={0.22} />

        {sprinkles.map((item, index) => (
          <rect
            key={index}
            x={item.x - 4}
            y={item.y - 1.2}
            width={8}
            height={2.4}
            rx={1.2}
            fill={item.c}
            transform={`rotate(${item.r} ${item.x} ${item.y})`}
          />
        ))}

        {/* Cereja */}
        <circle cx={CX + 4} cy={TOP - 8} r={7} fill="#C81D47" />
        <circle cx={CX + 2} cy={TOP - 10} r={2} fill="#FFFFFF" opacity={0.6} />
        <path d={`M${CX + 5} ${TOP - 14} q 6 -12 14 -14`} stroke="#4A7A3A" strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>

      {/* Docinhos no prato */}
      {sweetsCount > 0
        ? [
            { x: 26, y: 204 },
            { x: 40, y: 212 },
            { x: 214, y: 204 },
            { x: 200, y: 212 },
          ].map((item, index) => (
            <g key={index} style={{ animation: `rise .4s ease-out ${index * 0.06}s both` }}>
              <circle cx={item.x} cy={item.y} r={7.5} fill={index % 2 ? '#FFF3D6' : '#4A281A'} />
              <circle cx={item.x - 2} cy={item.y - 3} r={1.2} fill={index % 2 ? '#DB3A63' : '#F7C873'} />
              <circle cx={item.x + 2.5} cy={item.y - 1} r={1.2} fill="#FFFFFF" opacity={0.8} />
            </g>
          ))
        : null}

      <defs>
        <linearGradient id="cake-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="frosting-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Faixa visivel de um cilindro entre as alturas y1 e y2 (frente arredondada).
function band(y1: number, y2: number) {
  return `M${LEFT} ${y1} A${RX} ${RY} 0 0 0 ${RIGHT} ${y1} L${RIGHT} ${y2} A${RX} ${RY} 0 0 1 ${LEFT} ${y2} Z`;
}

// Altura da borda frontal do topo em uma posicao x (segue a elipse).
function frontEdge(x: number) {
  const t = (x - CX) / RX;
  return TOP + RY * Math.sqrt(Math.max(0, 1 - t * t));
}

function frosting() {
  const base = (x: number) => frontEdge(x) + 4;
  let d = `M${LEFT} ${TOP} L${LEFT} ${base(LEFT + 0.01)}`;

  for (const drip of drips) {
    const half = 6;
    const y = base(drip.x);
    d += ` L${drip.x - half} ${base(drip.x - half)}`;
    d += ` C${drip.x - half} ${y + drip.depth} ${drip.x + half} ${y + drip.depth} ${drip.x + half} ${base(drip.x + half)}`;
  }

  d += ` L${RIGHT} ${base(RIGHT - 0.01)} L${RIGHT} ${TOP} A${RX} ${RY} 0 0 0 ${LEFT} ${TOP} Z`;
  return d;
}
