'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import type { SatelliteData } from '@/types/github';
import { EMISSION } from '@/lib/theme';
import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';

interface SatelliteProps {
  data: SatelliteData;
}

export function Satellite({ data }: SatelliteProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  const isSelected = useGitHubStore((s) => s.selectedRepoId === data.id);
  const selectedRepoId = useGitHubStore((s) => s.selectedRepoId);
  const selectRepo = useGitHubStore((s) => s.selectRepo);
  const hoveredRepoId = useSceneStore((s) => s.hoveredRepoId);
  const setHoveredRepoId = useSceneStore((s) => s.setHoveredRepoId);
  const focusOnPosition = useSceneStore((s) => s.focusOnPosition);

  const isHovered = hoveredRepoId === data.id;
  const isAnySelected = selectedRepoId !== null;
  const isDimmed = isAnySelected && !isSelected;

  const emissiveIntensity = isHovered
    ? EMISSION.hover
    : isSelected
      ? EMISSION.active
      : EMISSION.idle;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const angle = data.orbitOffset + t * data.orbitSpeed;
    const x = Math.cos(angle) * data.orbitRadius;
    const z = Math.sin(angle) * data.orbitRadius;
    const y = Math.sin(angle * 2) * 0.3;
    groupRef.current.position.set(x, y, z);
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (isSelected) {
            selectRepo(null);
            useSceneStore.getState().resetCamera();
          } else {
            selectRepo(data.id);
            const pos = groupRef.current?.position;
            if (pos) focusOnPosition([pos.x, pos.y, pos.z]);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredRepoId(data.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredRepoId(null);
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
          opacity={isDimmed ? 0.3 : 0.9}
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
          fillOpacity={isDimmed ? 0.3 : 1}
        >
          {data.name}
        </Text>
      </Billboard>

      {/* Hover tooltip with stats */}
      {isHovered && !isSelected && (
        <Billboard position={[0, data.satelliteRadius + 0.8, 0]}>
          <Text
            fontSize={0.12}
            color="#0CFFE1"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {`★ ${data.stars}  ⑂ ${data.forks}  ${data.language ?? ''}`}
          </Text>
        </Billboard>
      )}

      {/* Selection ring */}
      {(isSelected || isHovered) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.satelliteRadius + 0.1, data.satelliteRadius + 0.15, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={isSelected ? 0.6 : 0.3}
          />
        </mesh>
      )}
    </group>
  );
}
