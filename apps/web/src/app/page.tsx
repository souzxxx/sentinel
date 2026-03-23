'use client';

import dynamic from 'next/dynamic';
import { HudOverlay } from '@/components/hud/HudOverlay';
import { DetailPanel } from '@/components/ui/DetailPanel';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

const SceneCanvas = dynamic(
  () => import('@/components/canvas/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
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
