import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore } from '@/stores/sceneStore';
import { SCENE } from '@/lib/theme';

describe('sceneStore', () => {
  beforeEach(() => {
    useSceneStore.setState({
      cameraPosition: SCENE.cameraPosition,
      sceneReady: false,
    });
  });

  it('has correct initial state', () => {
    const state = useSceneStore.getState();
    expect(state.cameraPosition).toEqual(SCENE.cameraPosition);
    expect(state.sceneReady).toBe(false);
  });

  it('sets scene ready', () => {
    useSceneStore.getState().setSceneReady(true);
    expect(useSceneStore.getState().sceneReady).toBe(true);

    useSceneStore.getState().setSceneReady(false);
    expect(useSceneStore.getState().sceneReady).toBe(false);
  });
});
