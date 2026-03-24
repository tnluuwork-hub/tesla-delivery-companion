'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ChecklistDocument } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import { getFailedItems } from '@/lib/selectors';

interface Props {
  doc: ChecklistDocument;
  session: ChecklistSession;
}

export function FloatingIssuesBadge({ doc, session }: Props) {
  const count = getFailedItems(doc, session).length;

  function jump() {
    document.getElementById('issue-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          key="badge"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={jump}
          className="fixed bottom-6 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
          style={{
            background: 'var(--fail)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
          }}
          aria-label={`${count} issue${count !== 1 ? 's' : ''} logged — jump to summary`}
        >
          <span className="text-sm font-bold">{count}</span>
          <span className="text-sm font-medium">
            issue{count !== 1 ? 's' : ''}
          </span>
          <span aria-hidden="true" className="text-xs opacity-75">↓</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
