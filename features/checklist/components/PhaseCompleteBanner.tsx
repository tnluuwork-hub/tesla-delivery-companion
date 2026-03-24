'use client';

import { motion } from 'framer-motion';

interface Props {
  phaseTitle: string;
  total: number;
  failCount: number;
}

export function PhaseCompleteBanner({ phaseTitle, total, failCount }: Props) {
  return (
    <motion.div
      className="rounded-xl p-4 flex items-center gap-3"
      style={{
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.25)',
      }}
    >
      <span className="text-2xl" aria-hidden="true">✓</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--pass)' }}>
          {phaseTitle} complete
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {total} checks done
          {failCount > 0
            ? ` · ${failCount} issue${failCount !== 1 ? 's' : ''} logged`
            : ' · No issues found'}
        </p>
      </div>
    </motion.div>
  );
}
