import { create } from 'zustand';
import { SCENE } from '@/lib/theme';

type SceneMode = 'orbit' | 'focus';

interface SceneState {
  cameraPosition: readonly [number, number, number];
  cameraTarget: readonly [number, number, number];
  sceneReady: boolean;
  mode: SceneMode;
  hoveredRepoId: number | null;
  setSceneReady: (ready: boolean) => void;
  setMode: (mode: SceneMode) => void;
  setHoveredRepoId: (id: number | null) => void;
  focusOnPosition: (position: [number, number, number]) => void;
  resetCamera: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraPosition: SCENE.cameraPosition,
  cameraTarget: [0, 0, 0] as const,
  sceneReady: false,
  mode: 'orbit',
  hoveredRepoId: null,

  setSceneReady: (ready) => set({ sceneReady: ready }),
  setMode: (mode) => set({ mode }),
  setHoveredRepoId: (id) => set({ hoveredRepoId: id }),

  focusOnPosition: (position) =>
    set({
      mode: 'focus',
      cameraTarget: position,
    }),

  resetCamera: () =>
    set({
      mode: 'orbit',
      cameraPosition: SCENE.cameraPosition,
      cameraTarget: [0, 0, 0],
    }),
}));
