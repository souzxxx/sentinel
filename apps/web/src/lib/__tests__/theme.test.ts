import { describe, it, expect } from 'vitest';
import {
  getLanguageColor,
  getStatusByLoad,
  LANGUAGE_COLORS,
  DEFAULT_LANGUAGE_COLOR,
  STATUS,
  COLORS,
  SCENE,
} from '@/lib/theme';

describe('getLanguageColor', () => {
  it('returns correct color for known languages', () => {
    expect(getLanguageColor('TypeScript')).toBe(LANGUAGE_COLORS.TypeScript);
    expect(getLanguageColor('Python')).toBe(LANGUAGE_COLORS.Python);
    expect(getLanguageColor('Go')).toBe(LANGUAGE_COLORS.Go);
  });

  it('returns default color for unknown language', () => {
    expect(getLanguageColor('Brainfuck')).toBe(DEFAULT_LANGUAGE_COLOR);
  });

  it('returns default color for null', () => {
    expect(getLanguageColor(null)).toBe(DEFAULT_LANGUAGE_COLOR);
  });
});

describe('getStatusByLoad', () => {
  it('returns healthy for low CPU', () => {
    expect(getStatusByLoad(10)).toBe(STATUS.healthy);
    expect(getStatusByLoad(0)).toBe(STATUS.healthy);
    expect(getStatusByLoad(39)).toBe(STATUS.healthy);
  });

  it('returns warning for mid CPU', () => {
    expect(getStatusByLoad(40)).toBe(STATUS.warning);
    expect(getStatusByLoad(55)).toBe(STATUS.warning);
    expect(getStatusByLoad(69)).toBe(STATUS.warning);
  });

  it('returns critical for high CPU', () => {
    expect(getStatusByLoad(70)).toBe(STATUS.critical);
    expect(getStatusByLoad(100)).toBe(STATUS.critical);
  });
});

describe('theme constants', () => {
  it('has valid scene background color', () => {
    expect(COLORS.sceneBg).toBe('#0a0a1a');
  });

  it('has valid camera position', () => {
    expect(SCENE.cameraPosition).toHaveLength(3);
    expect(SCENE.cameraPosition[0]).toBeGreaterThan(0);
  });

  it('has min distance less than max distance', () => {
    expect(SCENE.cameraMinDistance).toBeLessThan(SCENE.cameraMaxDistance);
    expect(SCENE.orbitMinDistance).toBeLessThan(SCENE.orbitMaxDistance);
    expect(SCENE.satelliteMinRadius).toBeLessThan(SCENE.satelliteMaxRadius);
  });
});
