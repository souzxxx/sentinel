'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { SCENE, COLORS, EMISSION } from '@/lib/theme';

export function CoreSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * (Math.PI * 2) / SCENE.corePulseSpeed) * SCENE.corePulseAmplitude;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.rotation.y = t * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[SCENE.coreRadius, 1]} />
      <meshStandardMaterial
        color={COLORS.cyanNeon}
        emissive={COLORS.cyanNeon}
        emissiveIntensity={EMISSION.active}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
