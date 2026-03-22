'use client';

import dynamic from 'next/dynamic';

const SceneCanvas = dynamic(
  () => import('@/components/canvas/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen w-screen bg-[#0a0a1a]">
      <SceneCanvas />
    </main>
  );
}
