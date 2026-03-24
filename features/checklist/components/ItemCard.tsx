'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChecklistItem, SeverityLevel } from '@/types/checklist';
import type { ItemState, ItemStatus } from '@/types/session';
import { compressImage } from '@/lib/image-utils';
import { hapticLight, hapticMedium } from '@/lib/haptics';

interface Props {
  item: ChecklistItem;
  state: ItemState;
  onStatus: (status: ItemStatus) => void;
  onNote: (note: string) => void;
  onSeverity: (severity: SeverityLevel) => void;
  onPhoto: (photo: string) => void;
}

const severities: SeverityLevel[] = ['minor', 'moderate', 'major'];

export function ItemCard({ item, state, onStatus, onNote, onSeverity, onPhoto }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(state.note ?? '');
  const saveNoteRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const isFailed = state.status === 'fail';
  const isActioned = state.status !== 'todo';

  useEffect(() => {
    setNote(state.note ?? '');
  }, [state.note]);

  useEffect(() => {
    if (isFailed && expanded) {
      const t = setTimeout(() => noteRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isFailed, expanded]);

  function handleStatus(tapped: ItemStatus) {
    const next = state.status === tapped ? 'todo' : tapped;
    if (next === 'pass' || next === 'skip') {
      hapticLight();
      onStatus(next);
      setTimeout(() => setExpanded(false), 150);
    } else if (next === 'fail') {
      hapticMedium();
      onStatus(next);
      setExpanded(true);
    } else {
      onStatus(next);
    }
  }

  function handleNoteChange(val: string) {
    setNote(val);
    if (saveNoteRef.current) clearTimeout(saveNoteRef.current);
    saveNoteRef.current = setTimeout(() => {
      if (val !== (state.note ?? '')) onNote(val);
    }, 800);
  }

  function handleNoteBlur() {
    if (saveNoteRef.current) clearTimeout(saveNoteRef.current);
    if (note !== (state.note ?? '')) onNote(note);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    onPhoto(compressed);
    e.target.value = '';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface-elevated)',
        border: `1px solid ${
          isFailed ? 'rgba(239,68,68,0.4)'
          : state.status === 'pass' ? 'rgba(34,197,94,0.25)'
          : 'var(--border)'
        }`,
        opacity: state.status === 'skip' ? 0.55 : 1,
      }}
    >
      {/* Card header */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span
          className="mt-1 shrink-0 w-2 h-2 rounded-full transition-colors"
          style={{
            background:
              state.status === 'pass' ? 'var(--pass)' :
              state.status === 'fail' ? 'var(--fail)' :
              state.status === 'skip' ? 'var(--skip)' :
              'var(--border)',
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--foreground)' }}>
            {item.title}
          </p>
          {!expanded && (
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--muted)' }}>
              {item.description}
            </p>
          )}
          {!expanded && isActioned && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isFailed && state.severity && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded capitalize"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--fail)', fontSize: '10px' }}
                >
                  {state.severity}
                </span>
              )}
              {state.note && (
                <span className="text-xs truncate max-w-[180px]" style={{ color: 'var(--muted)', fontSize: '10px' }}>
                  &ldquo;{state.note}&rdquo;
                </span>
              )}
              {state.photo && (
                <span style={{ color: 'var(--muted)', fontSize: '10px' }}>📷 photo</span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs shrink-0 mt-0.5" style={{ color: 'var(--muted)' }}>
          {expanded ? '▲' : '▾'}
        </span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs pt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {item.description}
              </p>

              {/* Pass / Fail / Skip */}
              <div className="flex gap-2">
                {(['pass', 'fail', 'skip'] as ItemStatus[]).map((s) => {
                  const active = state.status === s;
                  const bg =
                    s === 'pass' ? 'var(--pass)' :
                    s === 'fail' ? 'var(--fail)' :
                    'var(--skip)';
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatus(s)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
                      style={{
                        background: active ? bg : 'var(--border)',
                        color: active ? '#fff' : 'var(--muted)',
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>

              {/* Fail capture form */}
              <AnimatePresence>
                {isFailed && (
                  <motion.div
                    key="fail-form"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Severity</p>
                      <div className="flex gap-2">
                        {severities.map((sev) => (
                          <button
                            key={sev}
                            onClick={() => onSeverity(sev)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                            style={{
                              background: state.severity === sev ? 'rgba(239,68,68,0.25)' : 'var(--border)',
                              color: state.severity === sev ? 'var(--fail)' : 'var(--muted)',
                              border: `1px solid ${state.severity === sev ? 'rgba(239,68,68,0.5)' : 'transparent'}`,
                            }}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Describe the issue</p>
                      <textarea
                        ref={noteRef}
                        className="w-full rounded-lg px-3 py-2 text-sm resize-none"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid rgba(239,68,68,0.35)',
                          color: 'var(--foreground)',
                          minHeight: '80px',
                        }}
                        placeholder="e.g. gap wider on the left side, paint chip near door edge…"
                        value={note}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        onBlur={handleNoteBlur}
                      />
                    </div>

                    <div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      {state.photo ? (
                        <div className="space-y-2">
                          <div className="relative rounded-lg overflow-hidden" style={{ maxHeight: '180px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={state.photo} alt="Issue photo" className="w-full object-cover rounded-lg" style={{ maxHeight: '180px' }} />
                          </div>
                          <button
                            onClick={() => photoInputRef.current?.click()}
                            className="w-full py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                            style={{ background: 'var(--border)', color: 'var(--muted)' }}
                          >
                            Retake photo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                          style={{
                            background: 'var(--border)',
                            color: 'var(--foreground)',
                            border: '1px dashed rgba(255,255,255,0.15)',
                          }}
                        >
                          <span>📷</span>
                          <span>Add photo</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Plain note for non-fail */}
              {!isFailed && (
                <textarea
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    minHeight: '68px',
                  }}
                  placeholder="Add a note…"
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  onBlur={handleNoteBlur}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
