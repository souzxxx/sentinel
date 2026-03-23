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
const defaultBlue = new THREE.Color('#00B4D8');

function getMetricColor(percent: number | null): THREE.Color {
  if (percent === null) return defaultBlue;
  if (percent < STATUS.healthy.threshold) return healthyColor;
  if (percent < STATUS.warning.threshold) return warningColor;
  return criticalColor;
}

export function OrbitalRing() {
  const cpuRingRef = useRef<Mesh>(null);
  const ramRingRef = useRef<Mesh>(null);

  const tubeRadius = (SCENE.ringOuterRadius - SCENE.ringInnerRadius) / 2;
  const cpuTorusRadius = SCENE.ringInnerRadius + tubeRadius;
  const ramTorusRadius = SCENE.ringOuterRadius + 0.3;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const metrics = useMetricsStore.getState().metrics;

    // CPU ring (inner)
    if (cpuRingRef.current) {
      cpuRingRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
      cpuRingRef.current.rotation.z = t * SCENE.ringRotationSpeed;

      const cpuColor = getMetricColor(metrics?.cpu.percent ?? null);
      const mat = cpuRingRef.current.material as MeshStandardMaterial;
      mat.color.lerp(cpuColor, 0.05);
      mat.emissive.lerp(cpuColor, 0.05);
    }

    // RAM ring (outer)
    if (ramRingRef.current) {
      ramRingRef.current.rotation.x = Math.PI / 2 + Math.cos(t * 0.3) * 0.15;
      ramRingRef.current.rotation.z = -t * SCENE.ringRotationSpeed * 0.7;

      const ramColor = getMetricColor(metrics?.memory.percent ?? null);
      const mat = ramRingRef.current.material as MeshStandardMaterial;
      mat.color.lerp(ramColor, 0.05);
      mat.emissive.lerp(ramColor, 0.05);
    }
  });

  return (
    <>
      {/* CPU ring (inner) */}
      <mesh ref={cpuRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[cpuTorusRadius, tubeRadius, 16, 100]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={EMISSION.idle}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* RAM ring (outer) */}
      <mesh ref={ramRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ramTorusRadius, tubeRadius * 0.6, 16, 100]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={EMISSION.idle}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  );
}
