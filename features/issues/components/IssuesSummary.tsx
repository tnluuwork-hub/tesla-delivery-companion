'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChecklistDocument } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import { getFailedItems } from '@/lib/selectors';
import { buildMarkdownReport, copyToClipboard } from '@/lib/export';

interface Props {
  doc: ChecklistDocument;
  session: ChecklistSession;
}

const severityColor: Record<string, string> = {
  minor: 'var(--skip)',
  moderate: '#f97316',
  major: 'var(--fail)',
};

export function IssuesSummary({ doc, session }: Props) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const failed = getFailedItems(doc, session);

  async function handleCopy() {
    const report = buildMarkdownReport(doc, session);
    const ok = await copyToClipboard(report);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleDownloadPdf() {
    setGenerating(true);
    try {
      const [{ pdf }, { InspectionReport }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/lib/pdf-report'),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(
        React.createElement(InspectionReport, { doc, session }) as any
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date(session.startedAt).toISOString().split('T')[0];
      a.download = `tesla-delivery-${doc.model}-${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section id="issue-summary" className="px-4 pt-6 pb-10">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
            Issue Summary
          </h2>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {failed.length === 0
              ? 'No issues logged'
              : `${failed.length} issue${failed.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={handleDownloadPdf}
            disabled={generating}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center gap-2"
            style={{
              background: generating ? 'var(--border)' : 'var(--accent)',
              color: generating ? 'var(--muted)' : '#fff',
              opacity: generating ? 0.8 : 1,
            }}
          >
            {generating ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                  aria-hidden="true"
                />
                Building PDF…
              </>
            ) : (
              <>
                <span aria-hidden="true">↓</span>
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
            style={{ background: 'var(--border)', color: copied ? 'var(--pass)' : 'var(--muted)' }}
          >
            {copied ? '✓ Copied' : 'Copy markdown'}
          </button>
        </div>
      </div>

      {failed.length === 0 ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
        >
          <p className="text-3xl mb-2" aria-hidden="true">✓</p>
          <p className="text-sm font-medium" style={{ color: 'var(--pass)' }}>All clear</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>No failed items logged</p>
        </div>
      ) : (
        <div className="space-y-3">
          {failed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl px-4 py-3"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--fail)' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.phaseTitle}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {item.state.severity && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded capitalize"
                        style={{
                          background: `${severityColor[item.state.severity]}22`,
                          color: severityColor[item.state.severity],
                        }}
                      >
                        {item.state.severity}
                      </span>
                    )}
                    {item.state.note && (
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        &ldquo;{item.state.note}&rdquo;
                      </span>
                    )}
                  </div>
                  {item.state.photo && (
                    <div className="mt-2 rounded-lg overflow-hidden" style={{ maxHeight: '120px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.state.photo}
                        alt={`Photo for ${item.title}`}
                        className="w-full object-cover rounded-lg"
                        style={{ maxHeight: '120px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
