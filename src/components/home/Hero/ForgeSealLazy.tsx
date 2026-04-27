'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForgeSeal = dynamic(() => import('./ForgeSeal').then((m) => m.ForgeSeal), {
  ssr: false,
  loading: () => null,
});

export function ForgeSealLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;
  return <ForgeSeal />;
}
