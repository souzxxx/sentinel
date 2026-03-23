'use client';

import { ScifiClock } from './ScifiClock';
import { StatusIndicator } from './StatusIndicator';

export function HudOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top-left: Clock */}
      <div className="absolute top-6 left-6">
        <ScifiClock />
      </div>

      {/* Top-right: Project title */}
      <div className="absolute top-6 right-6 text-right font-mono">
        <div className="text-sm font-bold tracking-[0.3em] text-cyan-400/60">
          SENTINEL
        </div>
        <div className="text-[10px] tracking-wider text-white/30">
          MONITORING SYSTEM v1.0
        </div>
      </div>

      {/* Bottom-left: Status */}
      <div className="absolute bottom-6 left-6">
        <StatusIndicator />
      </div>

      {/* Bottom-right: Controls hint */}
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/20 text-right space-y-0.5">
        <div>DRAG — ORBIT</div>
        <div>SCROLL — ZOOM</div>
        <div>CLICK — SELECT</div>
        <div>ESC — RESET</div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-cyan-400/20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-cyan-400/20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-cyan-400/20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-cyan-400/20" />
    </div>
  );
}
