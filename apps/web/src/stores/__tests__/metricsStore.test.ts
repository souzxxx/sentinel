import { describe, it, expect, beforeEach } from 'vitest';
import { useMetricsStore } from '@/stores/metricsStore';
import type { SystemMetrics } from '@/types/metrics';

const mockMetrics: SystemMetrics = {
  timestamp: '2026-03-22T14:30:00Z',
  cpu: { percent: 45.2, count: 8 },
  memory: { percent: 62.1, used_gb: 10.5, total_gb: 16.0 },
  disk: { percent: 55.0, used_gb: 200, total_gb: 500 },
  network: { bytes_sent: 1000000, bytes_recv: 5000000 },
};

describe('metricsStore', () => {
  beforeEach(() => {
    useMetricsStore.setState({
      metrics: null,
      connectionStatus: 'disconnected',
    });
  });

  it('has correct initial state', () => {
    const state = useMetricsStore.getState();
    expect(state.metrics).toBeNull();
    expect(state.connectionStatus).toBe('disconnected');
  });

  it('sets metrics', () => {
    useMetricsStore.getState().setMetrics(mockMetrics);
    const state = useMetricsStore.getState();
    expect(state.metrics).toEqual(mockMetrics);
    expect(state.metrics?.cpu.percent).toBe(45.2);
  });

  it('sets connection status', () => {
    useMetricsStore.getState().setConnectionStatus('connecting');
    expect(useMetricsStore.getState().connectionStatus).toBe('connecting');

    useMetricsStore.getState().setConnectionStatus('connected');
    expect(useMetricsStore.getState().connectionStatus).toBe('connected');

    useMetricsStore.getState().setConnectionStatus('disconnected');
    expect(useMetricsStore.getState().connectionStatus).toBe('disconnected');
  });

  it('updates metrics replacing previous', () => {
    useMetricsStore.getState().setMetrics(mockMetrics);
    const updated = { ...mockMetrics, cpu: { percent: 88.5, count: 8 } };
    useMetricsStore.getState().setMetrics(updated);

    expect(useMetricsStore.getState().metrics?.cpu.percent).toBe(88.5);
  });
});
