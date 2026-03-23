'use client';

import { useEffect, useRef } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';
import { WS } from '@/lib/theme';
import type { SystemMetrics } from '@/types/metrics';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/metrics';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const setMetrics = useMetricsStore((s) => s.setMetrics);
  const setConnectionStatus = useMetricsStore((s) => s.setConnectionStatus);

  useEffect(() => {
    function connect() {
      setConnectionStatus('connecting');

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: SystemMetrics = JSON.parse(event.data);
          setMetrics(data);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        wsRef.current = null;

        if (reconnectAttempts.current < WS.maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeout.current = setTimeout(connect, WS.reconnectDelay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [setMetrics, setConnectionStatus]);
}
