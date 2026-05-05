import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CakeModel } from './CakeModel';

type CakeSceneProps = {
  doughColor?: string;
  filling1Color?: string;
  filling2Color?: string;
  toppingColor?: string;
};

export function CakeScene({
  doughColor = '#F6D7A8',
  filling1Color = '#B56A62',
  filling2Color = '#8A4B3E',
  toppingColor = '#F5C5CC',
}: CakeSceneProps) {
  return (
    <div className="relative h-[340px] w-full overflow-hidden border-b border-line bg-[linear-gradient(180deg,#fbf2ef_0%,#fffdf9_100%)] md:h-[420px] md:rounded-[30px] md:border">
      <Canvas camera={{ position: [0, 0.56, 5.65], fov: 31 }} shadows dpr={[1, 1.75]}>
        <color attach="background" args={['#fbf4f1']} />
        <ambientLight intensity={1.85} />
        <directionalLight position={[3.6, 5.2, 3.4]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3.2, 2.1, 2.4]} intensity={0.8} color="#ffe1d4" />
        <spotLight position={[0, 4, 4]} angle={0.36} penumbra={0.85} intensity={0.62} color="#ffffff" />
        <Suspense fallback={null}>
          <CakeModel doughColor={doughColor} filling1Color={filling1Color} filling2Color={filling2Color} toppingColor={toppingColor} />
          <ContactShadows position={[0, -0.93, 0]} opacity={0.26} scale={4.2} blur={2.8} far={2.8} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.05} maxPolarAngle={1.7} />
      </Canvas>
      <p className="pointer-events-none absolute left-1/2 top-[306px] w-full -translate-x-1/2 px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted/80 md:top-[382px]">
        Imagem 3D meramente ilustrativa
      </p>
    </div>
  );
}
