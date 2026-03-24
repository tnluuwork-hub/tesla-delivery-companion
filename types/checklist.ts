export type TeslaModel = 'model-y' | 'model-3' | 'model-s' | 'model-x' | 'cybertruck';

export type ChecklistPhaseKey =
  | 'prep'
  | 'locked-exterior'
  | 'unlocked-exterior'
  | 'interior'
  | 'cargo-accessories'
  | 'drive-final';

export type SeverityLevel = 'minor' | 'moderate' | 'major';

export interface ChecklistDocument {
  version: string;
  model: TeslaModel;
  estimatedDurationMin?: number;
  phases: ChecklistPhase[];
}

export interface ChecklistPhase {
  id: ChecklistPhaseKey;
  title: string;
  description?: string;
  sections: ChecklistSection[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  sourceRefs?: string[];
  tags?: string[];
  media?: { type: 'image'; url: string; alt?: string }[];
  severityHint?: SeverityLevel;
  lockedOnly?: boolean;
}
