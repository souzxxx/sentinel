'use client';

import { useEffect } from 'react';
import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';

export function useKeyboardNav() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { repos, selectedRepoId, selectRepo } = useGitHubStore.getState();
      const { resetCamera, focusOnPosition, mode } = useSceneStore.getState();

      if (repos.length === 0) return;

      switch (e.key) {
        case 'Escape': {
          if (mode === 'focus') {
            selectRepo(null);
            resetCamera();
          }
          break;
        }
        case 'Tab': {
          e.preventDefault();
          const currentIndex = repos.findIndex((r) => r.id === selectedRepoId);
          const nextIndex = e.shiftKey
            ? (currentIndex - 1 + repos.length) % repos.length
            : (currentIndex + 1) % repos.length;
          const nextRepo = repos[nextIndex];
          selectRepo(nextRepo.id);
          focusOnPosition([0, 0, 0]); // triggers focus mode
          break;
        }
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          const idx = repos.findIndex((r) => r.id === selectedRepoId);
          const next = repos[(idx + 1) % repos.length];
          selectRepo(next.id);
          if (mode === 'focus') focusOnPosition([0, 0, 0]);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const idx = repos.findIndex((r) => r.id === selectedRepoId);
          const prev = repos[(idx - 1 + repos.length) % repos.length];
          selectRepo(prev.id);
          if (mode === 'focus') focusOnPosition([0, 0, 0]);
          break;
        }
        case 'Enter': {
          if (selectedRepoId !== null && mode === 'orbit') {
            focusOnPosition([0, 0, 0]);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
