'use client';

import { useEffect } from 'react';
import { useGitHubStore } from '@/stores/githubStore';

const DEFAULT_USERNAME = 'souzxx';

export function useGitHub(username: string = DEFAULT_USERNAME) {
  const fetchRepos = useGitHubStore((s) => s.fetchRepos);
  const repos = useGitHubStore((s) => s.repos);
  const loading = useGitHubStore((s) => s.loading);
  const error = useGitHubStore((s) => s.error);

  useEffect(() => {
    fetchRepos(username);
  }, [username, fetchRepos]);

  return { repos, loading, error };
}
