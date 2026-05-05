import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

type CakeModelProps = {
  doughColor: string;
  filling1Color: string;
  filling2Color: string;
  toppingColor: string;
};

export function CakeModel({ doughColor, filling1Color, filling2Color, toppingColor }: CakeModelProps) {
  const groupRef = useRef<Group>(null);
  const bodyColor = useMemo(() => normalizeCakeBodyColor(doughColor), [doughColor]);
  const topColor = useMemo(() => normalizeTopColor(toppingColor), [toppingColor]);
  const ring1Color = useMemo(() => darken(filling1Color, 0.34), [filling1Color]);
  const ring2Color = useMemo(() => darken(filling2Color, 0.34), [filling2Color]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.16, 0]} scale={[0.8, 0.8, 0.8]}>
      <mesh position={[0, -0.91, 0]} receiveShadow scale={[1.18, 1, 0.72]}>
        <cylinderGeometry args={[1.48, 1.62, 0.12, 160]} />
        <meshStandardMaterial color="#E9E2D8" roughness={0.72} />
      </mesh>
      <mesh position={[0, -0.86, 0]} receiveShadow scale={[1.18, 1, 0.72]}>
        <cylinderGeometry args={[1.34, 1.46, 0.035, 160]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.58} />
      </mesh>

      <mesh position={[0, -0.34, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.12, 1.2, 0.86, 160]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} />
      </mesh>
      <mesh position={[-0.42, -0.29, 0.99]} rotation={[0, 0.08, 0]}>
        <planeGeometry args={[0.36, 0.72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.09} />
      </mesh>

      <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.13, 0.026, 12, 160]} />
        <meshStandardMaterial color={ring1Color} roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.15, 0.028, 12, 160]} />
        <meshStandardMaterial color={ring2Color} roughness={0.62} />
      </mesh>

      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.24, 1.13, 0.18, 160]} />
        <meshStandardMaterial color={topColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.21, 1.23, 0.04, 160]} />
        <meshStandardMaterial color="#FFFDF8" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.14, 0.04, 14, 160]} />
        <meshStandardMaterial color={topColor} roughness={0.5} />
      </mesh>

      {topDots.map((dot) => (
        <mesh key={`${dot.x}-${dot.z}`} position={[dot.x, dot.y, dot.z]} castShadow>
          <sphereGeometry args={[dot.size, 32, 20]} />
          <meshStandardMaterial color="#F0527A" roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

const topDots = [
  { x: 0, z: 0.02, y: 0.66, size: 0.125 },
  { x: -0.56, z: 0.38, y: 0.56, size: 0.085 },
  { x: -0.24, z: 0.52, y: 0.56, size: 0.08 },
  { x: 0.27, z: 0.52, y: 0.56, size: 0.08 },
  { x: 0.6, z: 0.33, y: 0.56, size: 0.085 },
  { x: -0.68, z: -0.08, y: 0.55, size: 0.083 },
  { x: 0.72, z: -0.08, y: 0.55, size: 0.083 },
  { x: -0.35, z: -0.48, y: 0.55, size: 0.083 },
  { x: 0.3, z: -0.48, y: 0.55, size: 0.083 },
];

function normalizeTopColor(hex: string) {
  return isLightColor(hex) ? hex : '#EDE7DA';
}

function normalizeCakeBodyColor(hex: string) {
  if (isLightColor(hex)) {
    return '#E8474F';
  }

  return hex;
}

function darken(hex: string, amount: number) {
  const value = hex.replace('#', '');
  if (value.length !== 6) {
    return '#4B332B';
  }

  const red = Math.max(0, Math.round(Number.parseInt(value.slice(0, 2), 16) * amount));
  const green = Math.max(0, Math.round(Number.parseInt(value.slice(2, 4), 16) * amount));
  const blue = Math.max(0, Math.round(Number.parseInt(value.slice(4, 6), 16) * amount));

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function toHex(value: number) {
  return value.toString(16).padStart(2, '0');
}

function isLightColor(hex: string) {
  const value = hex.replace('#', '');
  if (value.length !== 6) {
    return true;
  }

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 170;
}
