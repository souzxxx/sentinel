import { create } from 'zustand';
import { SCENE } from '@/lib/theme';

interface SceneState {
  cameraPosition: readonly [number, number, number];
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraPosition: SCENE.cameraPosition,
  sceneReady: false,
  setSceneReady: (ready) => set({ sceneReady: ready }),
}));
