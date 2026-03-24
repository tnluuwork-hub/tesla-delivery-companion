import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { ChecklistDocument } from '@/types/checklist';
import type { ChecklistSession } from '@/types/session';
import { getFailedItems, getOverallProgress, getTotalItems, getCompletedItems } from '@/lib/selectors';

const RED = '#CC0000';
const DARK = '#111111';
const GRAY = '#666666';
const LIGHT_GRAY = '#f4f4f4';
const BORDER = '#e0e0e0';
const PASS = '#16a34a';
const FAIL = '#dc2626';
const WARN = '#d97706';

const severityColor: Record<string, string> = {
  minor: WARN,
  moderate: '#ea580c',
  major: FAIL,
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingBottom: 60,
  },

  // ── Header ──
  header: {
    backgroundColor: RED,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    marginTop: 3,
  },
  headerBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  headerBadgePercent: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
  },
  headerBadgeLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 8,
    marginTop: 1,
  },

  // ── Meta row ──
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: LIGHT_GRAY,
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    gap: 24,
  },
  metaItem: {
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 8,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },

  // ── Section heading ──
  sectionHeading: {
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
  sectionCount: {
    fontSize: 10,
    color: GRAY,
  },

  // ── No issues state ──
  noIssues: {
    marginHorizontal: 40,
    marginTop: 8,
    padding: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
  },
  noIssuesText: {
    fontSize: 12,
    color: PASS,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
  },
  noIssuesSub: {
    fontSize: 10,
    color: GRAY,
    marginTop: 4,
  },

  // ── Issue card ──
  issueCard: {
    marginHorizontal: 40,
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
    overflow: 'hidden',
  },
  issueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  issueNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: FAIL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueNumberText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  issueTitleCol: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
  issuePhase: {
    fontSize: 9,
    color: GRAY,
    marginTop: 2,
  },
  issueCardBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  issueRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  issueRowLabel: {
    fontSize: 9,
    color: GRAY,
    width: 54,
    paddingTop: 1,
  },
  issueRowValue: {
    flex: 1,
    fontSize: 10,
    color: DARK,
    lineHeight: 1.5,
  },
  severityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'capitalize',
  },
  photo: {
    width: '100%',
    maxHeight: 220,
    borderRadius: 6,
    objectFit: 'cover',
    marginTop: 4,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: GRAY,
  },
  footerBrand: {
    fontSize: 8,
    color: RED,
    fontFamily: 'Helvetica-Bold',
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 40,
    marginBottom: 4,
  },
});

interface Props {
  doc: ChecklistDocument;
  session: ChecklistSession;
}

export function InspectionReport({ doc, session }: Props) {
  const failed = getFailedItems(doc, session);
  const progress = getOverallProgress(doc, session);
  const total = getTotalItems(doc);
  const completed = getCompletedItems(session);
  const modelLabel = doc.model
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const date = new Date(session.startedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const generatedAt = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Document
      title="Tesla Delivery Inspection Report"
      author="Tesla Delivery Companion"
      subject={`${modelLabel} delivery inspection – ${date}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Tesla Delivery Report</Text>
            <Text style={styles.headerSubtitle}>{modelLabel} · {date}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgePercent}>{progress}%</Text>
            <Text style={styles.headerBadgeLabel}>Complete</Text>
          </View>
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Model</Text>
            <Text style={styles.metaValue}>{modelLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Inspection date</Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Items checked</Text>
            <Text style={styles.metaValue}>{completed} / {total}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Issues found</Text>
            <Text style={{ ...styles.metaValue, color: failed.length > 0 ? FAIL : PASS }}>
              {failed.length}
            </Text>
          </View>
        </View>

        {/* Issue section heading */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Issues</Text>
          <Text style={styles.sectionCount}>
            {failed.length === 0 ? 'None' : `${failed.length} found`}
          </Text>
        </View>

        <View style={styles.divider} />

        {failed.length === 0 ? (
          <View style={styles.noIssues}>
            <Text style={{ fontSize: 20, color: PASS }}>✓</Text>
            <Text style={styles.noIssuesText}>No issues logged</Text>
            <Text style={styles.noIssuesSub}>All inspected items passed or were skipped.</Text>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            {failed.map((item, i) => {
              const sev = item.state.severity;
              const sevColor = sev ? severityColor[sev] : GRAY;
              return (
                <View key={item.id} style={styles.issueCard} wrap={false}>
                  {/* Card header */}
                  <View style={styles.issueCardHeader}>
                    <View style={styles.issueNumber}>
                      <Text style={styles.issueNumberText}>{i + 1}</Text>
                    </View>
                    <View style={styles.issueTitleCol}>
                      <Text style={styles.issueTitle}>{item.title}</Text>
                      <Text style={styles.issuePhase}>{item.phaseTitle}</Text>
                    </View>
                    {sev && (
                      <View style={{ ...styles.severityBadge, backgroundColor: `${sevColor}22` }}>
                        <Text style={{ ...styles.severityText, color: sevColor }}>{sev}</Text>
                      </View>
                    )}
                  </View>

                  {/* Card body */}
                  {(item.state.note || item.state.photo) && (
                    <View style={styles.issueCardBody}>
                      {item.state.note && (
                        <View style={styles.issueRow}>
                          <Text style={styles.issueRowLabel}>Note</Text>
                          <Text style={styles.issueRowValue}>{item.state.note}</Text>
                        </View>
                      )}
                      {item.state.photo && (
                        <View style={styles.issueRow}>
                          <Text style={styles.issueRowLabel}>Photo</Text>
                          <View style={{ flex: 1 }}>
                            <Image src={item.state.photo} style={styles.photo} />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated {generatedAt}</Text>
          <Text style={styles.footerBrand}>Tesla Delivery Companion</Text>
        </View>
      </Page>
    </Document>
  );
}
