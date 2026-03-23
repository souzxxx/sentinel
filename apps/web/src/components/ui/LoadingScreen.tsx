'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2 + Math.floor(Math.random() * 3);
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-8">
      {/* Corner decorations */}
      <div className="fixed top-4 left-4 w-12 h-12 border-t border-l border-cyan-400/30" />
      <div className="fixed top-4 right-4 w-12 h-12 border-t border-r border-cyan-400/30" />
      <div className="fixed bottom-4 left-4 w-12 h-12 border-b border-l border-cyan-400/30" />
      <div className="fixed bottom-4 right-4 w-12 h-12 border-b border-r border-cyan-400/30" />

      {/* Title */}
      <div className="text-center">
        <h1 className="font-mono text-2xl font-bold tracking-[0.5em] text-cyan-400/80">
          SENTINEL
        </h1>
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mt-2">
          MONITORING SYSTEM
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 space-y-2">
        <div className="h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-cyan-400/60 transition-all duration-100 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-white/30">
          <span className="animate-pulse">INITIALIZING...</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
}
