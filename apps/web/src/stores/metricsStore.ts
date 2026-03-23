import { create } from 'zustand';
import type { SystemMetrics } from '@/types/metrics';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface MetricsState {
  metrics: SystemMetrics | null;
  connectionStatus: ConnectionStatus;
  setMetrics: (metrics: SystemMetrics) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: null,
  connectionStatus: 'disconnected',
  setMetrics: (metrics) => set({ metrics }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));
