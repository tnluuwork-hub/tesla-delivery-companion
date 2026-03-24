'use client';

import { motion } from 'framer-motion';
import type { ChecklistDocument } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import { getOverallProgress } from '@/lib/selectors';

interface Props {
  doc: ChecklistDocument;
  session: ChecklistSession;
  currentPhaseTitle: string;
  phaseIndex: number;
}

export function StickyHeader({ doc, session, currentPhaseTitle, phaseIndex }: Props) {
  const progress = getOverallProgress(doc, session);
  const total = doc.phases.length;

  return (
    <header
      className="w-full"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            Phase {phaseIndex + 1} of {total}
          </p>
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>
            {currentPhaseTitle}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--foreground)' }}>
            {progress}
          </span>
          <span className="text-sm font-medium ml-0.5" style={{ color: 'var(--muted)' }}>%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </header>
  );
}
