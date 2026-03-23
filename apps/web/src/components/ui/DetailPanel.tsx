'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';
import { ANIMATION } from '@/lib/theme';

export function DetailPanel() {
  const selectedRepoId = useGitHubStore((s) => s.selectedRepoId);
  const repos = useGitHubStore((s) => s.repos);
  const selectRepo = useGitHubStore((s) => s.selectRepo);
  const resetCamera = useSceneStore((s) => s.resetCamera);

  const selectedRepo = repos.find((r) => r.id === selectedRepoId);

  const handleClose = () => {
    selectRepo(null);
    resetCamera();
  };

  return (
    <AnimatePresence>
      {selectedRepo && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: ANIMATION.panelSlide, ease: 'easeInOut' }}
          className="fixed top-0 right-0 h-full w-80 z-20 pointer-events-auto"
        >
          <div className="h-full bg-[#111122]/90 backdrop-blur-md border-l border-cyan-400/20 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">
                  {selectedRepo.name}
                </h2>
                <p className="text-xs text-cyan-400/60 font-mono mt-1">
                  {selectedRepo.language ?? 'Unknown'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/40 hover:text-white transition-colors text-sm font-mono"
              >
                [ESC]
              </button>
            </div>

            {/* Description */}
            {selectedRepo.description && (
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                {selectedRepo.description}
              </p>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard label="Stars" value={selectedRepo.stars} />
              <StatCard label="Forks" value={selectedRepo.forks} />
              <StatCard
                label="Created"
                value={selectedRepo.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              />
              <StatCard
                label="Last Push"
                value={selectedRepo.pushedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              />
            </div>

            {/* Visual properties */}
            <div className="mb-6 space-y-2">
              <div className="text-[10px] tracking-wider text-white/30 font-mono uppercase">
                Orbital Data
              </div>
              <div className="text-xs text-white/50 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Orbit Radius</span>
                  <span className="text-cyan-400/60">
                    {selectedRepo.orbitRadius.toFixed(1)}u
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Orbit Speed</span>
                  <span className="text-cyan-400/60">
                    {selectedRepo.orbitSpeed.toFixed(3)}r/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Body Radius</span>
                  <span className="text-cyan-400/60">
                    {selectedRepo.satelliteRadius.toFixed(2)}u
                  </span>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Link */}
            <a
              href={selectedRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 border border-cyan-400/30 text-cyan-400 text-sm font-mono hover:bg-cyan-400/10 transition-colors"
            >
              VIEW ON GITHUB →
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/5 border border-white/10 p-3">
      <div className="text-[10px] tracking-wider text-white/30 font-mono uppercase">
        {label}
      </div>
      <div className="text-lg font-bold text-white font-mono mt-1">{value}</div>
    </div>
  );
}
