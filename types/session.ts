import type { TeslaModel, SeverityLevel } from './checklist';

export type ItemStatus = 'todo' | 'pass' | 'fail' | 'skip';

export interface ItemState {
  status: ItemStatus;
  note?: string;
  severity?: SeverityLevel;
  photo?: string; // base64 compressed JPEG
}

export interface ChecklistSession {
  model: TeslaModel;
  startedAt: string;
  updatedAt: string;
  itemStates: Record<string, ItemState>;
}
