'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { SCENE, COLORS, EMISSION } from '@/lib/theme';

export function OrbitalRing() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    meshRef.current.rotation.z = t * SCENE.ringRotationSpeed;
  });

  const tubeRadius = (SCENE.ringOuterRadius - SCENE.ringInnerRadius) / 2;
  const torusRadius = SCENE.ringInnerRadius + tubeRadius;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[torusRadius, tubeRadius, 16, 100]} />
      <meshStandardMaterial
        color={COLORS.electricBlue}
        emissive={COLORS.electricBlue}
        emissiveIntensity={EMISSION.idle}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
