export interface SystemMetrics {
  timestamp: string;
  cpu: {
    percent: number;
    count: number;
  };
  memory: {
    percent: number;
    used_gb: number;
    total_gb: number;
  };
  disk: {
    percent: number;
    used_gb: number;
    total_gb: number;
  };
  network: {
    bytes_sent: number;
    bytes_recv: number;
  };
}
