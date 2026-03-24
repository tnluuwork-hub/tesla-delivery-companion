'use client';

import { useEffect, useMemo } from 'react';
import type { ChecklistDocument } from '@/types/checklist';
import { useSessionStore } from '@/store/session-store';
import { useActivePhase } from '@/features/progress/hooks/useActivePhase';
import { StickyHeader } from './StickyHeader';
import { PhaseNav } from './PhaseNav';
import { StartScreen } from './StartScreen';
import { PhaseBlock } from '@/features/checklist/components/PhaseBlock';
import { IssuesSummary } from '@/features/issues/components/IssuesSummary';
import { FloatingIssuesBadge } from '@/features/issues/components/FloatingIssuesBadge';

interface Props {
  doc: ChecklistDocument;
}

export function DeliveryApp({ doc }: Props) {
  const { session, started, loadOrCreate, startSession, setItemStatus, setItemNote, setItemSeverity, setItemPhoto, resetSession } =
    useSessionStore();

  // Attempt to restore an existing session on mount
  useEffect(() => {
    loadOrCreate(doc.model);
  }, [doc.model, loadOrCreate]);

  const phaseIds = useMemo(() => doc.phases.map((p) => p.id), [doc.phases]);
  const activePhaseId = useActivePhase(phaseIds);

  const activePhaseIndex = doc.phases.findIndex((p) => p.id === activePhaseId);
  const activePhase = doc.phases[activePhaseIndex] ?? doc.phases[0];

  function jumpToPhase(phaseId: string) {
    const el = document.getElementById(`phase-${phaseId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!started || !session) {
    return <StartScreen doc={doc} onStart={() => startSession(doc.model)} />;
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--background)' }}>
      <div className="sticky top-0 z-50 w-full">
        <StickyHeader
          doc={doc}
          session={session}
          currentPhaseTitle={activePhase?.title ?? ''}
          phaseIndex={activePhaseIndex >= 0 ? activePhaseIndex : 0}
        />
        <PhaseNav
          phases={doc.phases}
          session={session}
          activePhaseId={activePhaseId}
          onJump={jumpToPhase}
        />
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full">
        {doc.phases.map((phase, i) => (
          <PhaseBlock
            key={phase.id}
            phase={phase}
            session={session}
            phaseIndex={i}
            onStatus={setItemStatus}
            onNote={setItemNote}
            onSeverity={setItemSeverity}
            onPhoto={setItemPhoto}
          />
        ))}

        <IssuesSummary doc={doc} session={session} />
        <FloatingIssuesBadge doc={doc} session={session} />

        {/* Reset */}
        <div className="px-4 pb-10 text-center">
          <button
            onClick={() => {
              if (confirm('Reset inspection? All progress will be lost.')) {
                resetSession(doc.model);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-xs underline"
            style={{ color: 'var(--muted)' }}
          >
            Reset inspection
          </button>
        </div>
      </main>
    </div>
  );
}
