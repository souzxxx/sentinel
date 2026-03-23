'use client';

import { useEffect, useState } from 'react';

export function ScifiClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
