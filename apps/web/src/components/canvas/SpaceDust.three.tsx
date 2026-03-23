'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 500;

// Seeded pseudo-random for deterministic initialization
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

// Pre-compute positions and velocities at module level (pure)
function createParticleData() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const vel = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    pos[i3] = (seededRandom(i * 3) - 0.5) * 40;
    pos[i3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 20;
    pos[i3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 40;

    vel[i3] = (seededRandom(i * 7) - 0.5) * 0.002;
    vel[i3 + 1] = (seededRandom(i * 7 + 1) - 0.5) * 0.001;
    vel[i3 + 2] = (seededRandom(i * 7 + 2) - 0.5) * 0.002;
  }

  return { positions: pos, velocities: vel };
}

const particleData = createParticleData();

export function SpaceDust() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] += particleData.velocities[i3];
      arr[i3 + 1] += particleData.velocities[i3 + 1];
      arr[i3 + 2] += particleData.velocities[i3 + 2];

      if (Math.abs(arr[i3]) > 20) arr[i3] *= -0.9;
      if (Math.abs(arr[i3 + 1]) > 10) arr[i3 + 1] *= -0.9;
      if (Math.abs(arr[i3 + 2]) > 20) arr[i3 + 2] *= -0.9;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particleData.positions}
          itemSize={3}
          args={[particleData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#0CFFE1"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
