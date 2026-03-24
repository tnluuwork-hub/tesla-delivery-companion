'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { TeslaModel } from '@/types/checklist';

interface ModelOption {
  model: TeslaModel;
  label: string;
  body: string;
  checks: number;
  mins: number;
  highlight?: string;
}

const MODELS: ModelOption[] = [
  {
    model: 'model-s',
    label: 'Model S',
    body: 'Luxury Sedan',
    checks: 57,
    mins: 90,
    highlight: 'Air suspension • HEPA filter • Premium audio',
  },
  {
    model: 'model-3',
    label: 'Model 3',
    body: 'Compact Sedan',
    checks: 52,
    mins: 75,
    highlight: 'Traditional trunk • Glass roof option',
  },
  {
    model: 'model-x',
    label: 'Model X',
    body: 'Full-Size SUV',
    checks: 62,
    mins: 100,
    highlight: 'Falcon Wing doors • Air suspension • 3rd row',
  },
  {
    model: 'model-y',
    label: 'Model Y',
    body: 'Compact SUV',
    checks: 53,
    mins: 90,
    highlight: 'Power liftgate • Panoramic roof',
  },
  {
    model: 'cybertruck',
    label: 'Cybertruck',
    body: 'Electric Truck',
    checks: 61,
    mins: 90,
    highlight: 'Stainless steel • Vault bed • Tonneau cover',
  },
];

export function ModelPicker() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-start px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <span
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            T
          </span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: 'var(--foreground)' }}>
          Tesla Delivery Companion
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--muted)' }}>
          Select your model to begin
        </p>

        {/* Model cards */}
        <div className="flex flex-col gap-3">
          {MODELS.map((m, i) => (
            <motion.button
              key={m.model}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${m.model}`)}
              className="w-full rounded-xl px-4 py-4 text-left transition-colors"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                    {m.label}
                  </span>
                  <span
                    className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {m.body}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {m.checks} checks • {m.mins}m
                  </span>
                </div>
              </div>
              {m.highlight && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {m.highlight}
                </p>
              )}
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-center mt-8" style={{ color: 'var(--muted)' }}>
          Progress saves locally • no account needed
        </p>
      </motion.div>
    </div>
  );
}
