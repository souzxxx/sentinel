'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SCENE, COLORS } from '@/lib/theme';
import { CoreSphere } from './CoreSphere.three';
import { OrbitalRing } from './OrbitalRing.three';
import { Environment } from './Environment.three';
import { SatelliteSystem } from './SatelliteSystem.three';
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
        <CoreSphere />
        <OrbitalRing />
        <Environment />
        <SatelliteSystem />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={SCENE.cameraMinDistance}
          maxDistance={SCENE.cameraMaxDistance}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Canvas>
    </div>
  );
}
