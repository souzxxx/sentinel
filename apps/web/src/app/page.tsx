'use client';

import dynamic from 'next/dynamic';
import { HudOverlay } from '@/components/hud/HudOverlay';
import { DetailPanel } from '@/components/ui/DetailPanel';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

const SceneCanvas = dynamic(
  () => import('@/components/canvas/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="font-mono text-cyan-400/60 text-sm tracking-widest animate-pulse">
          INITIALIZING SENTINEL...
        </div>
      </div>
    ),
  }
);

export default function Home() {
  useKeyboardNav();

  return (
    <main className="h-screen w-screen bg-[#0a0a1a] relative">
      <SceneCanvas />
      <HudOverlay />
      <DetailPanel />
    </main>
  );
}
