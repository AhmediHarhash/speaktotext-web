'use client';

import { useEffect } from 'react';

const RESTORE_DELAYS = [0, 120, 420, 900] as const;

function scrollToHash() {
  const id = window.location.hash.slice(1);
  if (!id) return;

  const target = document.getElementById(decodeURIComponent(id));
  if (!target) return;

  target.scrollIntoView({ block: 'start', behavior: 'auto' });
}

export function HashScrollRestorer() {
  useEffect(() => {
    const timers = RESTORE_DELAYS.map((delay) =>
      window.setTimeout(scrollToHash, delay)
    );

    const onHashChange = () => {
      window.setTimeout(scrollToHash, 80);
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}
