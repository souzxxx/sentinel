'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SCENE, COLORS } from '@/lib/theme';
import { CoreSphere } from './CoreSphere.three';
import { PlasmaCore } from './PlasmaCore.three';
import { OrbitalRing } from './OrbitalRing.three';
import { Environment } from './Environment.three';
import { SatelliteSystem } from './SatelliteSystem.three';
import { HeatParticles } from './HeatParticles.three';
import { GlitchOverlay } from './GlitchOverlay.three';
import { PostProcessing } from './PostProcessing.three';
import { CameraController } from './CameraController.three';
import { useGitHub } from '@/hooks/useGitHub';
import { useWebSocket } from '@/hooks/useWebSocket';

export function SceneCanvas() {
  useGitHub();
  useWebSocket();

  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [...SCENE.cameraPosition],
          fov: SCENE.cameraFov,
          near: 0.1,
          far: 200,
        }}
        gl={{ antialias: true, toneMapping: 4 /* ACESFilmicToneMapping */ }}
        onCreated={({ gl }) => {
          gl.setClearColor(COLORS.sceneBg);
        }}
      >
        <Suspense fallback={null}>
          <CoreSphere />
          <PlasmaCore />
          <OrbitalRing />
          <HeatParticles />
          <Environment />
          <SatelliteSystem />
          <GlitchOverlay />
        </Suspense>
        <PostProcessing />
        <CameraController />
      </Canvas>
    </div>
  );
}
