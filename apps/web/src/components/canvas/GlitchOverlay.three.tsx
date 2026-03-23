'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMetricsStore } from '@/stores/metricsStore';
import { STATUS } from '@/lib/theme';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uGlitchIntensity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    if (uGlitchIntensity < 0.01) discard;

    float glitch = step(0.97 - uGlitchIntensity * 0.1, random(vec2(floor(vUv.y * 20.0), floor(uTime * 10.0))));
    float scanline = sin(vUv.y * 200.0 + uTime * 5.0) * 0.02;

    vec3 color = vec3(1.0, 0.2, 0.3);
    float alpha = (glitch * 0.15 + scanline) * uGlitchIntensity;

    gl_FragColor = vec4(color, max(alpha, 0.0));
  }
`;

export function GlitchOverlay() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGlitchIntensity: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();

    const metrics = useMetricsStore.getState().metrics;
    const cpu = metrics?.cpu.percent ?? 0;

    // Glitch only when CPU is critical (>70%)
    const target = cpu > STATUS.warning.threshold ? (cpu - STATUS.warning.threshold) / 30 : 0;
    const current = matRef.current.uniforms.uGlitchIntensity.value;
    matRef.current.uniforms.uGlitchIntensity.value += (target - current) * 0.05;
  });

  return (
    <mesh renderOrder={999}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
