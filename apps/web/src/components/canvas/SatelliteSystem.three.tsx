'use client';

import { useGitHubStore } from '@/stores/githubStore';
import { Satellite } from './Satellite.three';
import { ConnectionLines } from './ConnectionLines.three';

export function SatelliteSystem() {
  const repos = useGitHubStore((s) => s.repos);

  if (repos.length === 0) return null;

  return (
    <group>
      {repos.map((repo) => (
        <Satellite key={repo.id} data={repo} />
      ))}
      <ConnectionLines repos={repos} />
    </group>
  );
}
