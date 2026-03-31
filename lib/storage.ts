import type { ChecklistSession } from '@/types/session';
import type { TeslaModel } from '@/types/checklist';

const KEY_PREFIX = 'tdc_session_';

function key(model: TeslaModel, vin: string) {
  return `${KEY_PREFIX}${model}_${vin.toUpperCase()}`;
}

export function loadSession(model: TeslaModel, vin: string): ChecklistSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(model, vin));
    if (!raw) return null;
    return JSON.parse(raw) as ChecklistSession;
  } catch {
    return null;
  }
}

export function saveSession(session: ChecklistSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key(session.model, session.vin), JSON.stringify(session));
  } catch {
    // storage unavailable — no-op
  }
}

export function clearSession(model: TeslaModel, vin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key(model, vin));
}

export function createSession(model: TeslaModel, vin: string): ChecklistSession {
  return {
    model,
    vin,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    itemStates: {},
  };
}
