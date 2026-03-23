'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMetricsStore } from '@/stores/metricsStore';
import { STATUS } from '@/lib/theme';

const PARTICLE_COUNT = 200;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function createHeatPositions() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const angle = seededRandom(i * 5) * Math.PI * 2;
    const radius = seededRandom(i * 5 + 1) * 1.5;
    pos[i3] = Math.cos(angle) * radius;
    pos[i3 + 1] = seededRandom(i * 5 + 2) * -0.5;
    pos[i3 + 2] = Math.sin(angle) * radius;
  }
  return pos;
}

const initialPositions = createHeatPositions();

export function HeatParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!pointsRef.current) return;

    const metrics = useMetricsStore.getState().metrics;
    const cpuPercent = metrics?.cpu.percent ?? 0;
    const intensity = cpuPercent / 100;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = cpuPercent > STATUS.healthy.threshold ? intensity * 0.8 : 0;

    if (cpuPercent <= STATUS.healthy.threshold) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += 0.02 * intensity + seededRandom(i + arr[i3 + 1] * 100) * 0.01;

      if (arr[i3 + 1] > 3) {
        const angle = seededRandom(i * 11 + arr[i3]) * Math.PI * 2;
        const radius = seededRandom(i * 13 + arr[i3 + 2]) * 1.5;
        arr[i3] = Math.cos(angle) * radius;
        arr[i3 + 1] = -0.5;
        arr[i3 + 2] = Math.sin(angle) * radius;
      }

      arr[i3] += (seededRandom(i * 17 + arr[i3 + 1] * 50) - 0.5) * 0.005;
      arr[i3 + 2] += (seededRandom(i * 19 + arr[i3 + 1] * 50) - 0.5) * 0.005;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={initialPositions}
          itemSize={3}
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FF3B5C"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
