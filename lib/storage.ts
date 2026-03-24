import type { ChecklistSession } from '@/types/session';
import type { TeslaModel } from '@/types/checklist';

const KEY_PREFIX = 'tdc_session_';

function key(model: TeslaModel) {
  return `${KEY_PREFIX}${model}`;
}

export function loadSession(model: TeslaModel): ChecklistSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(model));
    if (!raw) return null;
    return JSON.parse(raw) as ChecklistSession;
  } catch {
    return null;
  }
}

export function saveSession(session: ChecklistSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key(session.model), JSON.stringify(session));
  } catch {
    // storage unavailable — no-op
  }
}

export function clearSession(model: TeslaModel): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key(model));
}

export function createSession(model: TeslaModel): ChecklistSession {
  return {
    model,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    itemStates: {},
  };
}
