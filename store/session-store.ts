'use client';

import { create } from 'zustand';
import type { TeslaModel } from '@/types/checklist';
import type { ChecklistSession, ItemStatus, ItemState } from '@/types/session';
import type { SeverityLevel } from '@/types/checklist';
import { loadSession, saveSession, clearSession, createSession } from '@/lib/storage';

interface SessionStore {
  session: ChecklistSession | null;
  started: boolean;

  // actions
  startSession: (model: TeslaModel, vin: string) => void;
  setItemStatus: (itemId: string, status: ItemStatus) => void;
  setItemNote: (itemId: string, note: string) => void;
  setItemSeverity: (itemId: string, severity: SeverityLevel) => void;
  setItemPhoto: (itemId: string, photo: string) => void;
  resetSession: () => void;
}

function touch(session: ChecklistSession): ChecklistSession {
  return { ...session, updatedAt: new Date().toISOString() };
}

function updateItem(session: ChecklistSession, itemId: string, patch: Partial<ItemState>): ChecklistSession {
  const existing = session.itemStates[itemId] ?? { status: 'todo' as ItemStatus };
  const updated = touch({
    ...session,
    itemStates: {
      ...session.itemStates,
      [itemId]: { ...existing, ...patch },
    },
  });
  saveSession(updated);
  return updated;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,
  started: false,

  startSession(model, vin) {
    const existing = loadSession(model, vin);
    const session = existing ?? createSession(model, vin);
    saveSession(session);
    set({ session, started: true });
  },

  setItemStatus(itemId, status) {
    const { session } = get();
    if (!session) return;
    set({ session: updateItem(session, itemId, { status }) });
  },

  setItemNote(itemId, note) {
    const { session } = get();
    if (!session) return;
    set({ session: updateItem(session, itemId, { note }) });
  },

  setItemSeverity(itemId, severity) {
    const { session } = get();
    if (!session) return;
    set({ session: updateItem(session, itemId, { severity }) });
  },

  setItemPhoto(itemId, photo) {
    const { session } = get();
    if (!session) return;
    set({ session: updateItem(session, itemId, { photo }) });
  },

  resetSession() {
    const { session } = get();
    if (!session) return;
    clearSession(session.model, session.vin);
    set({ session: null, started: false });
  },
}));
