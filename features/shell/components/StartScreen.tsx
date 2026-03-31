'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChecklistDocument } from '@/types/checklist';

interface Props {
  doc: ChecklistDocument;
  onStart: (vin: string) => void;
}

export function StartScreen({ doc, onStart }: Props) {
  const phaseCount = doc.phases.length;
  const totalItems = doc.phases.flatMap((p) => p.sections.flatMap((s) => s.items)).length;

  const [vin, setVin] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    const trimmed = vin.trim().toUpperCase();
    if (trimmed.length < 6) {
      setError('Enter at least the last 6 characters of your VIN');
      return;
    }
    if (!/^[A-Z0-9]+$/.test(trimmed)) {
      setError('VIN must contain only letters and numbers');
      return;
    }
    setError('');
    onStart(trimmed);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo / mark */}
        <div className="flex justify-center mb-8">
          <span
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            T
          </span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--foreground)' }}>
          Tesla Delivery Companion
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--muted)' }}>
          Inspect with confidence
        </p>

        {/* Meta info */}
        <div
          className="rounded-xl p-4 mb-6 grid grid-cols-3 divide-x divide-[var(--border)] text-center"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
        >
          <div className="px-2">
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {doc.estimatedDurationMin}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>minutes</p>
          </div>
          <div className="px-2">
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {phaseCount}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>phases</p>
          </div>
          <div className="px-2">
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {totalItems}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>checks</p>
          </div>
        </div>

        {/* Model badge */}
        <div
          className="rounded-lg px-4 py-3 mb-6 flex items-center justify-between"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
        >
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Model</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            {doc.model.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>

        {/* VIN input */}
        <div className="mb-4">
          <label
            htmlFor="vin-input"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Last 6 characters of VIN
          </label>
          <input
            id="vin-input"
            type="text"
            value={vin}
            onChange={(e) => {
              setVin(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. ABC123"
            maxLength={17}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="w-full px-4 py-3 rounded-xl text-sm font-mono tracking-widest outline-none"
            style={{
              background: 'var(--surface-elevated)',
              border: `1px solid ${error ? 'var(--destructive, #ef4444)' : 'var(--border)'}`,
              color: 'var(--foreground)',
            }}
          />
          {error && (
            <p className="text-xs mt-1.5" style={{ color: 'var(--destructive, #ef4444)' }}>
              {error}
            </p>
          )}
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            Keeps your inspection separate from other vehicles
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-base font-bold transition-colors"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start inspection
        </motion.button>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--muted)' }}>
          Progress saves locally • no account needed
        </p>
      </motion.div>
    </div>
  );
}
