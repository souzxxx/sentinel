import { create } from 'zustand';
import type { SatelliteData } from '@/types/github';
import { fetchUserRepos, repoToSatellite } from '@/lib/github';

interface GitHubState {
  repos: SatelliteData[];
  loading: boolean;
  error: string | null;
  username: string;
  selectedRepoId: number | null;
  fetchRepos: (username: string) => Promise<void>;
  selectRepo: (id: number | null) => void;
}

export const useGitHubStore = create<GitHubState>((set, get) => ({
  repos: [],
  loading: false,
  error: null,
  username: '',
  selectedRepoId: null,

  fetchRepos: async (username: string) => {
    if (get().loading) return;
    set({ loading: true, error: null, username });

    try {
      const rawRepos = await fetchUserRepos(username);
      const repos = rawRepos.map((repo, i) =>
        repoToSatellite(repo, i, rawRepos.length)
      );
      set({ repos, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch repos',
        loading: false,
      });
    }
  },

  selectRepo: (id) => set({ selectedRepoId: id }),
}));
