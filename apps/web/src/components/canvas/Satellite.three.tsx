'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import type { Group } from 'three';
import type { SatelliteData } from '@/types/github';
import { EMISSION } from '@/lib/theme';
import { useGitHubStore } from '@/stores/githubStore';

interface SatelliteProps {
  data: SatelliteData;
}

export function Satellite({ data }: SatelliteProps) {
  const groupRef = useRef<Group>(null);

  const isSelected = useGitHubStore((s) => s.selectedRepoId === data.id);
  const selectRepo = useGitHubStore((s) => s.selectRepo);

  const emissiveIntensity = isSelected ? EMISSION.hover : EMISSION.idle;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const angle = data.orbitOffset + t * data.orbitSpeed;
    const x = Math.cos(angle) * data.orbitRadius;
    const z = Math.sin(angle) * data.orbitRadius;
    const y = Math.sin(angle * 2) * 0.3; // subtle vertical oscillation
    groupRef.current.position.set(x, y, z);
  });

  return (
    <group ref={groupRef}>
      {/* Satellite body */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          selectRepo(isSelected ? null : data.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[data.satelliteRadius, 1]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={emissiveIntensity}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Floating label */}
      <Billboard position={[0, data.satelliteRadius + 0.4, 0]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {data.name}
        </Text>
      </Billboard>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.satelliteRadius + 0.1, data.satelliteRadius + 0.15, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
