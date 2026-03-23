import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGitHubStore } from '@/stores/githubStore';
import type { GitHubRepo } from '@/types/github';

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'repo-alpha',
    full_name: 'user/repo-alpha',
    description: 'First repo',
    html_url: 'https://github.com/user/repo-alpha',
    language: 'TypeScript',
    stargazers_count: 20,
    forks_count: 5,
    size: 512,
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2026-03-20T00:00:00Z',
    pushed_at: '2026-03-18T00:00:00Z',
  },
  {
    id: 2,
    name: 'repo-beta',
    full_name: 'user/repo-beta',
    description: 'Second repo',
    html_url: 'https://github.com/user/repo-beta',
    language: 'Python',
    stargazers_count: 100,
    forks_count: 30,
    size: 2048,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2026-03-19T00:00:00Z',
    pushed_at: '2026-03-15T00:00:00Z',
  },
];

describe('githubStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useGitHubStore.setState({
      repos: [],
      loading: false,
      error: null,
      username: '',
      selectedRepoId: null,
    });
    vi.restoreAllMocks();
  });

  it('has correct initial state', () => {
    const state = useGitHubStore.getState();
    expect(state.repos).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.username).toBe('');
    expect(state.selectedRepoId).toBeNull();
  });

  it('fetches repos and transforms to satellite data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    });

    await useGitHubStore.getState().fetchRepos('testuser');

    const state = useGitHubStore.getState();
    expect(state.repos).toHaveLength(2);
    expect(state.repos[0].name).toBe('repo-alpha');
    expect(state.repos[1].name).toBe('repo-beta');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.username).toBe('testuser');
  });

  it('sets loading state during fetch', async () => {
    let resolvePromise: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(
      fetchPromise.then(() => ({
        ok: true,
        json: () => Promise.resolve([]),
      }))
    );

    const fetchCall = useGitHubStore.getState().fetchRepos('user');
    expect(useGitHubStore.getState().loading).toBe(true);

    resolvePromise!(undefined);
    await fetchCall;
    expect(useGitHubStore.getState().loading).toBe(false);
  });

  it('handles fetch error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    await useGitHubStore.getState().fetchRepos('user');

    const state = useGitHubStore.getState();
    expect(state.error).toContain('403');
    expect(state.loading).toBe(false);
    expect(state.repos).toEqual([]);
  });

  it('selects and deselects repos', () => {
    useGitHubStore.getState().selectRepo(42);
    expect(useGitHubStore.getState().selectedRepoId).toBe(42);

    useGitHubStore.getState().selectRepo(null);
    expect(useGitHubStore.getState().selectedRepoId).toBeNull();
  });

  it('prevents concurrent fetches', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    // Set loading manually to simulate in-progress fetch
    useGitHubStore.setState({ loading: true });
    await useGitHubStore.getState().fetchRepos('user');

    expect(callCount).toBe(0); // should not have called fetch
  });
});
