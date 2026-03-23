import type { GitHubRepo, SatelliteData } from '@/types/github';
import { SCENE } from '@/lib/theme';
import { getLanguageColor } from '@/lib/theme';

const GITHUB_API = 'https://api.github.com';

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=30&type=owner`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function repoToSatellite(repo: GitHubRepo, index: number, total: number): SatelliteData {
  const activity = repo.stargazers_count + repo.forks_count;
  const maxActivity = 100;

  // Satellite size: proportional to stars + forks
  const sizeFactor = Math.min(activity / maxActivity, 1);
  const satelliteRadius =
    SCENE.satelliteMinRadius +
    sizeFactor * (SCENE.satelliteMaxRadius - SCENE.satelliteMinRadius);

  // Orbit distance: newer repos closer to center
  const now = Date.now();
  const createdMs = new Date(repo.created_at).getTime();
  const ageDays = (now - createdMs) / (1000 * 60 * 60 * 24);
  const maxAgeDays = 365 * 5;
  const ageFactor = Math.min(ageDays / maxAgeDays, 1);
  const orbitRadius =
    SCENE.orbitMinDistance +
    ageFactor * (SCENE.orbitMaxDistance - SCENE.orbitMinDistance);

  // Orbit speed: more recent pushes = faster
  const pushedMs = new Date(repo.pushed_at).getTime();
  const daysSincePush = (now - pushedMs) / (1000 * 60 * 60 * 24);
  const pushFactor = Math.max(0, 1 - daysSincePush / 180);
  const orbitSpeed = SCENE.orbitSpeed * (0.5 + pushFactor * 2);

  // Evenly space satellites around the orbit
  const orbitOffset = (index / total) * Math.PI * 2;

  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    size: repo.size,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
    pushedAt: new Date(repo.pushed_at),
    orbitRadius,
    orbitSpeed,
    orbitOffset,
    satelliteRadius,
    color: getLanguageColor(repo.language),
  };
}
