import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserRepos, repoToSatellite } from '@/lib/github';
import { SCENE } from '@/lib/theme';
import type { GitHubRepo } from '@/types/github';

const mockRepo: GitHubRepo = {
  id: 1,
  name: 'test-repo',
  full_name: 'user/test-repo',
  description: 'A test repo',
  html_url: 'https://github.com/user/test-repo',
  language: 'TypeScript',
  stargazers_count: 50,
  forks_count: 10,
  size: 1024,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2026-03-20T00:00:00Z',
  pushed_at: '2026-03-20T00:00:00Z',
};

describe('fetchUserRepos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches repos from GitHub API', async () => {
    const mockRepos = [mockRepo];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    const repos = await fetchUserRepos('testuser');
    expect(repos).toEqual(mockRepos);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('users/testuser/repos'),
      expect.any(Object)
    );
  });

  it('throws on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchUserRepos('nonexistent')).rejects.toThrow('GitHub API error: 404');
  });
});

describe('repoToSatellite', () => {
  it('converts a GitHub repo to satellite data', () => {
    const satellite = repoToSatellite(mockRepo, 0, 5);

    expect(satellite.id).toBe(mockRepo.id);
    expect(satellite.name).toBe(mockRepo.name);
    expect(satellite.language).toBe('TypeScript');
    expect(satellite.stars).toBe(50);
    expect(satellite.forks).toBe(10);
  });

  it('computes orbit radius within bounds', () => {
    const satellite = repoToSatellite(mockRepo, 0, 1);

    expect(satellite.orbitRadius).toBeGreaterThanOrEqual(SCENE.orbitMinDistance);
    expect(satellite.orbitRadius).toBeLessThanOrEqual(SCENE.orbitMaxDistance);
  });

  it('computes satellite radius within bounds', () => {
    const satellite = repoToSatellite(mockRepo, 0, 1);

    expect(satellite.satelliteRadius).toBeGreaterThanOrEqual(SCENE.satelliteMinRadius);
    expect(satellite.satelliteRadius).toBeLessThanOrEqual(SCENE.satelliteMaxRadius);
  });

  it('assigns correct language color', () => {
    const satellite = repoToSatellite(mockRepo, 0, 1);
    expect(satellite.color).toBe('#3178C6'); // TypeScript blue
  });

  it('spaces satellites evenly by orbit offset', () => {
    const s1 = repoToSatellite(mockRepo, 0, 4);
    const s2 = repoToSatellite(mockRepo, 1, 4);
    const s3 = repoToSatellite(mockRepo, 2, 4);

    const expectedDiff = (Math.PI * 2) / 4;
    expect(s2.orbitOffset - s1.orbitOffset).toBeCloseTo(expectedDiff);
    expect(s3.orbitOffset - s2.orbitOffset).toBeCloseTo(expectedDiff);
  });

  it('gives recently pushed repos higher orbit speed', () => {
    const recentRepo = { ...mockRepo, pushed_at: new Date().toISOString() };
    const oldRepo = { ...mockRepo, pushed_at: '2020-01-01T00:00:00Z' };

    const recentSat = repoToSatellite(recentRepo, 0, 1);
    const oldSat = repoToSatellite(oldRepo, 0, 1);

    expect(recentSat.orbitSpeed).toBeGreaterThan(oldSat.orbitSpeed);
  });
});
