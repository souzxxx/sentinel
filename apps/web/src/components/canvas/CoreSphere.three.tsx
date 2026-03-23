'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';
import { SCENE, EMISSION, STATUS } from '@/lib/theme';
import { useMetricsStore } from '@/stores/metricsStore';

const healthyColor = new THREE.Color(STATUS.healthy.color);
const warningColor = new THREE.Color(STATUS.warning.color);
const criticalColor = new THREE.Color(STATUS.critical.color);
const defaultColor = new THREE.Color('#0CFFE1');

function getCoreColor(cpuPercent: number | null): THREE.Color {
  if (cpuPercent === null) return defaultColor;
  if (cpuPercent < STATUS.healthy.threshold) return healthyColor;
  if (cpuPercent < STATUS.warning.threshold) return warningColor;
  return criticalColor;
}

export function CoreSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Get metrics without hook (avoids re-renders)
    const metrics = useMetricsStore.getState().metrics;
    const cpuPercent = metrics?.cpu.percent ?? null;

    // Pulse intensity scales with CPU load
    const loadFactor = cpuPercent !== null ? 1 + (cpuPercent / 100) * 0.5 : 1;
    const pulseSpeed = SCENE.corePulseSpeed / loadFactor;
    const pulse = 1 + Math.sin(t * (Math.PI * 2) / pulseSpeed) * SCENE.corePulseAmplitude * loadFactor;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.rotation.y = t * 0.1;

    // Update color based on CPU
    const targetColor = getCoreColor(cpuPercent);
    const mat = meshRef.current.material as MeshStandardMaterial;
    mat.color.lerp(targetColor, 0.05);
    mat.emissive.lerp(targetColor, 0.05);
    mat.emissiveIntensity = EMISSION.active + (cpuPercent !== null ? (cpuPercent / 100) * 0.4 : 0);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[SCENE.coreRadius, 1]} />
      <meshStandardMaterial
        color="#0CFFE1"
        emissive="#0CFFE1"
        emissiveIntensity={EMISSION.active}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
