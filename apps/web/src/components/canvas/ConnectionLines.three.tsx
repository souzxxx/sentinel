'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SatelliteData } from '@/types/github';

interface ConnectionLinesProps {
  repos: SatelliteData[];
}

interface Connection {
  repoA: SatelliteData;
  repoB: SatelliteData;
}

export function ConnectionLines({ repos }: ConnectionLinesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Line[]>([]);

  const connections = useMemo<Connection[]>(() => {
    const result: Connection[] = [];
    for (let i = 0; i < repos.length; i++) {
      for (let j = i + 1; j < repos.length; j++) {
        if (
          repos[i].language &&
          repos[j].language &&
          repos[i].language === repos[j].language
        ) {
          result.push({ repoA: repos[i], repoB: repos[j] });
        }
      }
    }
    return result;
  }, [repos]);

  // Build lines imperatively to avoid bufferAttribute type issues
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Clear old lines
    linesRef.current.forEach((line) => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
      group.remove(line);
    });

    const lines: THREE.Line[] = [];
    connections.forEach((conn) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(new Float32Array(6), 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: conn.repoA.color,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      group.add(line);
      lines.push(line);
    });

    linesRef.current = lines;

    return () => {
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
        group.remove(line);
      });
    };
  }, [connections]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    linesRef.current.forEach((line, idx) => {
      if (idx >= connections.length) return;
      const conn = connections[idx];
      const positions = line.geometry.attributes.position as THREE.BufferAttribute;

      const angleA = conn.repoA.orbitOffset + t * conn.repoA.orbitSpeed;
      const angleB = conn.repoB.orbitOffset + t * conn.repoB.orbitSpeed;

      positions.setXYZ(
        0,
        Math.cos(angleA) * conn.repoA.orbitRadius,
        Math.sin(angleA * 2) * 0.3,
        Math.sin(angleA) * conn.repoA.orbitRadius
      );
      positions.setXYZ(
        1,
        Math.cos(angleB) * conn.repoB.orbitRadius,
        Math.sin(angleB * 2) * 0.3,
        Math.sin(angleB) * conn.repoB.orbitRadius
      );
      positions.needsUpdate = true;

      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2 + idx) * 0.1;
    });
  });

  return <group ref={groupRef} />;
}
