'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SCENE, COLORS } from '@/lib/theme';
import { CoreSphere } from './CoreSphere.three';
import { OrbitalRing } from './OrbitalRing.three';
import { Environment } from './Environment.three';
import { SatelliteSystem } from './SatelliteSystem.three';
import { CameraController } from './CameraController.three';
import { useGitHub } from '@/hooks/useGitHub';

export function SceneCanvas() {
  useGitHub();

  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [...SCENE.cameraPosition],
          fov: SCENE.cameraFov,
          near: 0.1,
          far: 200,
        }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(COLORS.sceneBg);
        }}
      >
        <Suspense fallback={null}>
          <CoreSphere />
          <OrbitalRing />
          <Environment />
          <SatelliteSystem />
        </Suspense>
        <CameraController />
      </Canvas>
    </div>
  );
}
