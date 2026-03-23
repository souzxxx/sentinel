import { describe, it, expect, beforeEach } from 'vitest';
import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';
import type { SatelliteData } from '@/types/github';

const makeSatellite = (id: number, name: string): SatelliteData => ({
  id,
  name,
  description: null,
  url: `https://github.com/user/${name}`,
  language: 'TypeScript',
  stars: 10,
  forks: 2,
  size: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  pushedAt: new Date(),
  orbitRadius: 5,
  orbitSpeed: 0.1,
  orbitOffset: 0,
  satelliteRadius: 0.3,
  color: '#3178C6',
});

describe('keyboard navigation logic', () => {
  const repos = [
    makeSatellite(1, 'alpha'),
    makeSatellite(2, 'beta'),
    makeSatellite(3, 'gamma'),
  ];

  beforeEach(() => {
    useGitHubStore.setState({
      repos,
      selectedRepoId: null,
      loading: false,
      error: null,
      username: 'user',
    });
    useSceneStore.setState({
      mode: 'orbit',
      hoveredRepoId: null,
    });
  });

  it('Escape resets from focus to orbit', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    useSceneStore.setState({ mode: 'focus' });

    // Simulate what useKeyboardNav does on Escape
    const { selectRepo } = useGitHubStore.getState();
    const { resetCamera, mode } = useSceneStore.getState();

    if (mode === 'focus') {
      selectRepo(null);
      resetCamera();
    }

    expect(useGitHubStore.getState().selectedRepoId).toBeNull();
    expect(useSceneStore.getState().mode).toBe('orbit');
  });

  it('navigates forward through repos', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    const { repos, selectedRepoId } = useGitHubStore.getState();
    const currentIndex = repos.findIndex((r) => r.id === selectedRepoId);
    const nextIndex = (currentIndex + 1) % repos.length;
    const nextRepo = repos[nextIndex];

    useGitHubStore.getState().selectRepo(nextRepo.id);
    expect(useGitHubStore.getState().selectedRepoId).toBe(2);
  });

  it('navigates backward through repos with wraparound', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    const { repos, selectedRepoId } = useGitHubStore.getState();
    const currentIndex = repos.findIndex((r) => r.id === selectedRepoId);
    const prevIndex = (currentIndex - 1 + repos.length) % repos.length;
    const prevRepo = repos[prevIndex];

    useGitHubStore.getState().selectRepo(prevRepo.id);
    expect(useGitHubStore.getState().selectedRepoId).toBe(3); // wraps to last
  });

  it('selects first repo when none selected and navigating forward', () => {
    const { repos, selectedRepoId } = useGitHubStore.getState();
    const currentIndex = repos.findIndex((r) => r.id === selectedRepoId);
    // findIndex returns -1 when not found, (-1 + 1) % 3 = 0
    const nextIndex = (currentIndex + 1) % repos.length;

    useGitHubStore.getState().selectRepo(repos[nextIndex].id);
    expect(useGitHubStore.getState().selectedRepoId).toBe(1);
  });
});
