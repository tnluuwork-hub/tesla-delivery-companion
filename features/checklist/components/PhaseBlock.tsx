'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ChecklistPhase, SeverityLevel } from '@/types/checklist';
import type { ChecklistSession, ItemStatus } from '@/types/session';
import { getPhaseProgress, isPhaseComplete } from '@/lib/selectors';
import { SectionBlock } from './SectionBlock';
import { PhaseCompleteBanner } from './PhaseCompleteBanner';

interface Props {
  phase: ChecklistPhase;
  session: ChecklistSession;
  phaseIndex: number;
  onStatus: (itemId: string, status: ItemStatus) => void;
  onNote: (itemId: string, note: string) => void;
  onSeverity: (itemId: string, severity: SeverityLevel) => void;
  onPhoto: (itemId: string, photo: string) => void;
}

export function PhaseBlock({ phase, session, phaseIndex, onStatus, onNote, onSeverity, onPhoto }: Props) {
  const { total, done, failed } = getPhaseProgress(phase, session);
  const complete = isPhaseComplete(phase, session);

  return (
    <section id={`phase-${phase.id}`} className="scroll-mt-28">
      {/* Phase header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: complete ? 'var(--pass)' : 'var(--surface-elevated)',
              color: complete ? '#fff' : 'var(--muted)',
              border: `1px solid ${complete ? 'var(--pass)' : 'var(--border)'}`,
            }}
          >
            {complete ? '✓' : phaseIndex + 1}
          </span>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
              {phase.title}
            </h2>
            {phase.description && (
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {phase.description}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {done}/{total} checked
              {failed > 0 && (
                <span style={{ color: 'var(--fail)' }}> · {failed} issue{failed !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-5 pb-4">
        {phase.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            session={session}
            onStatus={onStatus}
            onNote={onNote}
            onSeverity={onSeverity}
            onPhoto={onPhoto}
          />
        ))}
      </div>

      {/* Phase complete banner */}
      <AnimatePresence>
        {complete && (
          <motion.div
            key={`complete-${phase.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="px-4 pb-6"
          >
            <PhaseCompleteBanner
              phaseTitle={phase.title}
              total={total}
              failCount={failed}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
