// src/lib/theme.ts — Sentinel Design System Constants

// ─── Scene Background ────────────────────────────────────────
export const COLORS = {
  // Core palette
  sceneBg: '#0a0a1a',
  panelBg: '#111122',
  cardBg: '#1a1a2e',

  // Primary accent
  cyanNeon: '#0CFFE1',
  electricBlue: '#00B4D8',
  holoPurple: '#7B61FF',

  // Accent surfaces (for UI overlays)
  accentSurface: 'rgba(12, 255, 225, 0.08)',
  accentBorder: 'rgba(12, 255, 225, 0.2)',

  // Grid & ambient
  gridColor: '#0CFFE1',
  gridOpacity: 0.06,
  starColor: '#ffffff',
} as const;

// ─── Status Colors (CPU/RAM metrics) ─────────────────────────
export const STATUS = {
  healthy: { color: '#00FF88', label: 'Healthy', threshold: 40 },
  warning: { color: '#FFD600', label: 'Warning', threshold: 70 },
  critical: { color: '#FF3B5C', label: 'Critical', threshold: 100 },
  offline: { color: '#555555', label: 'Offline', threshold: -1 },
} as const;

export function getStatusByLoad(cpuPercent: number) {
  if (cpuPercent < STATUS.healthy.threshold) return STATUS.healthy;
  if (cpuPercent < STATUS.warning.threshold) return STATUS.warning;
  return STATUS.critical;
}

// ─── Language → Satellite Color ──────────────────────────────
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  HTML: '#E34F26',
  CSS: '#563D7C',
  Java: '#B07219',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Shell: '#89E051',
  'C++': '#F34B7D',
  C: '#555555',
  Ruby: '#701516',
  Dockerfile: '#384D54',
} as const;

export const DEFAULT_LANGUAGE_COLOR = '#888888';

export function getLanguageColor(language: string | null): string {
  if (!language) return DEFAULT_LANGUAGE_COLOR;
  return LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR;
}

// ─── Bloom / Emission Levels ─────────────────────────────────
export const EMISSION = {
  dormant: 0.0,
  idle: 0.3,
  active: 0.6,
  peak: 1.0,
  hover: 1.2,   // Hover boost
  flash: 2.0,   // Event flash (star, push)
} as const;

// ─── Scene Layout ────────────────────────────────────────────
export const SCENE = {
  // Core sphere
  coreRadius: 1.5,
  corePulseSpeed: 1.2,       // seconds per pulse cycle
  corePulseAmplitude: 0.08,  // scale oscillation

  // Orbital ring
  ringInnerRadius: 2.2,
  ringOuterRadius: 2.4,
  ringRotationSpeed: 0.3,    // radians per second

  // Satellites
  satelliteMinRadius: 0.15,
  satelliteMaxRadius: 0.5,
  orbitMinDistance: 4,
  orbitMaxDistance: 12,
  orbitSpeed: 0.1,           // base speed (multiplied by activity)

  // Camera defaults
  cameraPosition: [8, 6, 8] as const,
  cameraFov: 50,
  cameraMinDistance: 3,
  cameraMaxDistance: 25,

  // Grid
  gridSize: 30,
  gridDivisions: 30,

  // Stars
  starsCount: 3000,
  starsRadius: 50,
} as const;

// ─── Animation Durations (seconds) ──────────────────────────
export const ANIMATION = {
  cameraFlyTo: 1.5,          // GSAP fly-to duration
  satelliteGlow: 0.3,        // Hover glow transition
  panelSlide: 0.4,           // Side panel open/close
  eventFlash: 0.8,           // Star/push event flash
  particleBurst: 1.2,        // Particle burst on event
} as const;

// ─── Fonts ───────────────────────────────────────────────────
export const FONTS = {
  mono: "'JetBrains Mono', 'Space Mono', 'Fira Code', monospace",
  sans: "'Inter', 'system-ui', sans-serif",
} as const;

// ─── WebSocket Config ────────────────────────────────────────
export const WS = {
  metricsInterval: 2000,     // ms between metric updates
  reconnectDelay: 3000,      // ms before reconnect attempt
  maxReconnectAttempts: 10,
} as const;