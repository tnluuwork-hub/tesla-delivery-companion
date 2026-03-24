'use client';

import { motion } from 'framer-motion';
import type { ChecklistSection } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import type { SeverityLevel } from '@/types/checklist';
import type { ItemStatus } from '@/types/session';
import { ItemCard } from './ItemCard';

interface Props {
  section: ChecklistSection;
  session: ChecklistSession;
  onStatus: (itemId: string, status: ItemStatus) => void;
  onNote: (itemId: string, note: string) => void;
  onSeverity: (itemId: string, severity: SeverityLevel) => void;
  onPhoto: (itemId: string, photo: string) => void;
}

export function SectionBlock({ section, session, onStatus, onNote, onSeverity, onPhoto }: Props) {
  const total = section.items.length;
  const done = section.items.filter((i) => {
    const s = session.itemStates[i.id];
    return s && s.status !== 'todo';
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          {section.title}
        </h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {done}/{total}
        </span>
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          state={session.itemStates[item.id] ?? { status: 'todo' }}
          onStatus={(status) => onStatus(item.id, status)}
          onNote={(note) => onNote(item.id, note)}
          onSeverity={(sev) => onSeverity(item.id, sev)}
          onPhoto={(photo) => onPhoto(item.id, photo)}
        />
      ))}
    </motion.div>
  );
}
