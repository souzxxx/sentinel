'use client';

import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useMetricsStore } from '@/stores/metricsStore';

export function StatusIndicator() {
  const repoCount = useGitHubStore((s) => s.repos.length);
  const loading = useGitHubStore((s) => s.loading);
  const error = useGitHubStore((s) => s.error);
  const mode = useSceneStore((s) => s.mode);
  const connectionStatus = useMetricsStore((s) => s.connectionStatus);
  const metrics = useMetricsStore((s) => s.metrics);

  const wsStatusColor =
    connectionStatus === 'connected'
      ? 'bg-green-400'
      : connectionStatus === 'connecting'
        ? 'bg-yellow-400 animate-pulse'
        : 'bg-red-500';

  return (
    <div className="font-mono text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            error ? 'bg-red-500' : loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
          }`}
        />
        <span className="text-white/50">
          {error ? 'API ERROR' : loading ? 'FETCHING...' : `${repoCount} REPOS`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${wsStatusColor}`} />
        <span className="text-white/50 uppercase">
          WS: {connectionStatus}
        </span>
      </div>
      {metrics && (
        <>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-white/50">
              CPU: {metrics.cpu.percent.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-white/50">
              RAM: {metrics.memory.percent.toFixed(0)}%
            </span>
          </div>
        </>
      )}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-white/50 uppercase">
          MODE: {mode}
        </span>
      </div>
    </div>
  );
}
