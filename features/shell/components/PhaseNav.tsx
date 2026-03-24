'use client';

import type { ChecklistPhase } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import { isPhaseComplete, getPhaseProgress } from '@/lib/selectors';

interface Props {
  phases: ChecklistPhase[];
  session: ChecklistSession;
  activePhaseId: string;
  onJump: (phaseId: string) => void;
}

export function PhaseNav({ phases, session, activePhaseId, onJump }: Props) {
  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-x-auto"
      style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }}
    >
      {phases.map((phase) => {
        const complete = isPhaseComplete(phase, session);
        const { failed } = getPhaseProgress(phase, session);
        const isActive = phase.id === activePhaseId;
        return (
          <button
            key={phase.id}
            onClick={() => onJump(phase.id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: isActive ? 'var(--accent)' : complete ? 'rgba(34,197,94,0.15)' : 'var(--border)',
              color: isActive ? '#fff' : complete ? 'var(--pass)' : 'var(--muted)',
              border: `1px solid ${isActive ? 'var(--accent)' : complete ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
            }}
            aria-current={isActive ? 'true' : undefined}
          >
            {complete && <span>✓</span>}
            {!complete && failed > 0 && <span style={{ color: 'var(--fail)' }}>!</span>}
            <span>{phase.title.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
