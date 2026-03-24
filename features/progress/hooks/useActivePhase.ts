'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChecklistPhaseKey } from '@/types/checklist';

export function useActivePhase(phaseIds: ChecklistPhaseKey[]) {
  const [activeId, setActiveId] = useState<string>(phaseIds[0] ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const entries = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          entries.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = '';
        let bestRatio = -1;
        for (const [id, ratio] of entries) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) {
          // strip 'phase-' prefix
          setActiveId(bestId.replace('phase-', ''));
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-80px 0px 0px 0px' }
    );

    for (const id of phaseIds) {
      const el = document.getElementById(`phase-${id}`);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [phaseIds]);

  return activeId;
}
