'use client';

import { Stars } from '@react-three/drei';
import { SCENE, COLORS } from '@/lib/theme';

export function Environment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />

      {/* Core point light */}
      <pointLight
        position={[0, 0, 0]}
        color={COLORS.cyanNeon}
        intensity={2}
        distance={20}
      />

      {/* Stars background */}
      <Stars
        radius={SCENE.starsRadius}
        depth={50}
        count={SCENE.starsCount}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Grid floor */}
      <gridHelper
        args={[SCENE.gridSize, SCENE.gridDivisions, COLORS.gridColor, COLORS.gridColor]}
        position={[0, -3, 0]}
        material-transparent
        material-opacity={COLORS.gridOpacity}
      />
    </>
  );
}
