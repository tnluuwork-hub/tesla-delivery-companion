import { parseChecklist } from '@/lib/checklist-parser';
import { DeliveryApp } from '@/features/shell/components/DeliveryApp';
import modelYRaw from '@/content/checklists/model-y.json';

export default function Home() {
  const doc = parseChecklist(modelYRaw);
  return <DeliveryApp doc={doc} />;
}
