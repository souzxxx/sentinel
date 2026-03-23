import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore } from '@/stores/sceneStore';
import { SCENE } from '@/lib/theme';

describe('sceneStore', () => {
  beforeEach(() => {
    useSceneStore.setState({
      cameraPosition: SCENE.cameraPosition,
      cameraTarget: [0, 0, 0],
      sceneReady: false,
      mode: 'orbit',
      hoveredRepoId: null,
    });
  });

  it('has correct initial state', () => {
    const state = useSceneStore.getState();
    expect(state.cameraPosition).toEqual(SCENE.cameraPosition);
    expect(state.sceneReady).toBe(false);
    expect(state.mode).toBe('orbit');
    expect(state.hoveredRepoId).toBeNull();
  });

  it('sets scene ready', () => {
    useSceneStore.getState().setSceneReady(true);
    expect(useSceneStore.getState().sceneReady).toBe(true);
  });

  it('switches to focus mode with position', () => {
    useSceneStore.getState().focusOnPosition([5, 1, 3]);
    const state = useSceneStore.getState();
    expect(state.mode).toBe('focus');
    expect(state.cameraTarget).toEqual([5, 1, 3]);
  });

  it('resets camera to orbit mode', () => {
    useSceneStore.getState().focusOnPosition([5, 1, 3]);
    expect(useSceneStore.getState().mode).toBe('focus');

    useSceneStore.getState().resetCamera();
    const state = useSceneStore.getState();
    expect(state.mode).toBe('orbit');
    expect(state.cameraPosition).toEqual(SCENE.cameraPosition);
    expect(state.cameraTarget).toEqual([0, 0, 0]);
  });

  it('sets and clears hovered repo id', () => {
    useSceneStore.getState().setHoveredRepoId(42);
    expect(useSceneStore.getState().hoveredRepoId).toBe(42);

    useSceneStore.getState().setHoveredRepoId(null);
    expect(useSceneStore.getState().hoveredRepoId).toBeNull();
  });

  it('sets mode directly', () => {
    useSceneStore.getState().setMode('focus');
    expect(useSceneStore.getState().mode).toBe('focus');

    useSceneStore.getState().setMode('orbit');
    expect(useSceneStore.getState().mode).toBe('orbit');
  });
});
