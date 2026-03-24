import type { ChecklistDocument, ChecklistPhase } from '@/types/checklist';
import type { ChecklistSession, ItemState } from '@/types/session';

export function getTotalItems(doc: ChecklistDocument): number {
  return doc.phases.flatMap((p) => p.sections.flatMap((s) => s.items)).length;
}

export function getCompletedItems(session: ChecklistSession): number {
  return Object.values(session.itemStates).filter(
    (s) => s.status === 'pass' || s.status === 'fail' || s.status === 'skip'
  ).length;
}

export function getOverallProgress(doc: ChecklistDocument, session: ChecklistSession): number {
  const total = getTotalItems(doc);
  if (total === 0) return 0;
  return Math.round((getCompletedItems(session) / total) * 100);
}

export function getPhaseProgress(phase: ChecklistPhase, session: ChecklistSession): { total: number; done: number; failed: number } {
  const items = phase.sections.flatMap((s) => s.items);
  const total = items.length;
  const done = items.filter((i) => {
    const s = session.itemStates[i.id];
    return s && (s.status === 'pass' || s.status === 'fail' || s.status === 'skip');
  }).length;
  const failed = items.filter((i) => session.itemStates[i.id]?.status === 'fail').length;
  return { total, done, failed };
}

export function isPhaseComplete(phase: ChecklistPhase, session: ChecklistSession): boolean {
  const { total, done } = getPhaseProgress(phase, session);
  return total > 0 && done === total;
}

export function getFailedItems(doc: ChecklistDocument, session: ChecklistSession): Array<{ id: string; title: string; phaseTitle: string; state: ItemState }> {
  const failed: Array<{ id: string; title: string; phaseTitle: string; state: ItemState }> = [];
  for (const phase of doc.phases) {
    for (const section of phase.sections) {
      for (const item of section.items) {
        const state = session.itemStates[item.id];
        if (state?.status === 'fail') {
          failed.push({ id: item.id, title: item.title, phaseTitle: phase.title, state });
        }
      }
    }
  }
  return failed;
}
