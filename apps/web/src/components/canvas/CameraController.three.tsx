'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { SCENE, ANIMATION } from '@/lib/theme';
import { useSceneStore } from '@/stores/sceneStore';
import { useGitHubStore } from '@/stores/githubStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const mode = useSceneStore((s) => s.mode);
  const cameraTarget = useSceneStore((s) => s.cameraTarget);
  const selectedRepoId = useGitHubStore((s) => s.selectedRepoId);
  const repos = useGitHubStore((s) => s.repos);

  useEffect(() => {
    if (mode === 'focus' && selectedRepoId !== null) {
      const repo = repos.find((r) => r.id === selectedRepoId);
      if (!repo || !controlsRef.current) return;

      // Compute current satellite position
      const t = performance.now() / 1000;
      const angle = repo.orbitOffset + t * repo.orbitSpeed;
      const x = Math.cos(angle) * repo.orbitRadius;
      const z = Math.sin(angle) * repo.orbitRadius;
      const y = Math.sin(angle * 2) * 0.3;

      // Camera offset from satellite
      const camX = x + 2;
      const camY = y + 1.5;
      const camZ = z + 2;

      const controls = controlsRef.current;

      gsap.to(camera.position, {
        x: camX,
        y: camY,
        z: camZ,
        duration: ANIMATION.cameraFlyTo,
        ease: 'power2.inOut',
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x,
        y,
        z,
        duration: ANIMATION.cameraFlyTo,
        ease: 'power2.inOut',
        onUpdate: () => controls.update(),
      });
    } else if (mode === 'orbit') {
      if (!controlsRef.current) return;
      const controls = controlsRef.current;
      const [px, py, pz] = SCENE.cameraPosition;

      gsap.to(camera.position, {
        x: px,
        y: py,
        z: pz,
        duration: ANIMATION.cameraFlyTo,
        ease: 'power2.inOut',
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: ANIMATION.cameraFlyTo,
        ease: 'power2.inOut',
        onUpdate: () => controls.update(),
      });
    }
  }, [mode, selectedRepoId, repos, camera, cameraTarget]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={SCENE.cameraMinDistance}
      maxDistance={SCENE.cameraMaxDistance}
      maxPolarAngle={Math.PI * 0.85}
      enabled={mode === 'orbit'}
    />
  );
}
