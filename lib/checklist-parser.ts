import { z } from 'zod';
import type { ChecklistDocument } from '@/types/checklist';

const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sourceRefs: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  media: z
    .array(z.object({ type: z.literal('image'), url: z.string(), alt: z.string().optional() }))
    .optional(),
  severityHint: z.enum(['minor', 'moderate', 'major']).optional(),
  lockedOnly: z.boolean().optional(),
});

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(ItemSchema),
});

const PhaseSchema = z.object({
  id: z.enum(['prep', 'locked-exterior', 'unlocked-exterior', 'interior', 'cargo-accessories', 'drive-final']),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(SectionSchema),
});

const DocumentSchema = z.object({
  version: z.string(),
  model: z.enum(['model-y', 'model-3', 'model-s', 'model-x', 'cybertruck']),
  estimatedDurationMin: z.number().optional(),
  phases: z.array(PhaseSchema),
});

export function parseChecklist(raw: unknown): ChecklistDocument {
  return DocumentSchema.parse(raw) as ChecklistDocument;
}

export function getAllItemIds(doc: ChecklistDocument): string[] {
  return doc.phases.flatMap((p) => p.sections.flatMap((s) => s.items.map((i) => i.id)));
}
