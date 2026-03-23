'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return Math.floor(Date.now() / 1000);
}

function getServerSnapshot() {
  return 0;
}

export function ScifiClock() {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (timestamp === 0) {
    return (
      <div className="font-mono text-sm text-cyan-400/80">
        <div className="text-2xl font-bold tracking-widest">
          --:--<span className="text-cyan-400/50">:--</span>
        </div>
        <div className="text-xs tracking-wider text-cyan-400/40 uppercase">---</div>
      </div>
    );
  }

  const time = new Date(timestamp * 1000);
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <div className="font-mono text-sm text-cyan-400/80">
      <div className="text-2xl font-bold tracking-widest">
        {hours}:{minutes}
        <span className="text-cyan-400/50">:{seconds}</span>
      </div>
      <div className="text-xs tracking-wider text-cyan-400/40 uppercase">
        {date}
      </div>
    </div>
  );
}
