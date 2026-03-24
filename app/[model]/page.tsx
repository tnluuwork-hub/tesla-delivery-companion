import { notFound } from 'next/navigation';
import { parseChecklist } from '@/lib/checklist-parser';
import { DeliveryApp } from '@/features/shell/components/DeliveryApp';
import type { TeslaModel } from '@/types/checklist';

import modelYRaw from '@/content/checklists/model-y.json';
import model3Raw from '@/content/checklists/model-3.json';
import modelSRaw from '@/content/checklists/model-s.json';
import modelXRaw from '@/content/checklists/model-x.json';
import cybertruckRaw from '@/content/checklists/cybertruck.json';

const CHECKLISTS: Record<TeslaModel, unknown> = {
  'model-y': modelYRaw,
  'model-3': model3Raw,
  'model-s': modelSRaw,
  'model-x': modelXRaw,
  'cybertruck': cybertruckRaw,
};

const VALID_MODELS = Object.keys(CHECKLISTS) as TeslaModel[];

interface Props {
  params: Promise<{ model: string }>;
}

export function generateStaticParams() {
  return VALID_MODELS.map((model) => ({ model }));
}

export default async function ModelPage({ params }: Props) {
  const { model } = await params;

  if (!VALID_MODELS.includes(model as TeslaModel)) {
    notFound();
  }

  const raw = CHECKLISTS[model as TeslaModel];
  const doc = parseChecklist(raw);

  return <DeliveryApp doc={doc} />;
}
