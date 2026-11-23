import markdown from '../../assets/onechat/artifacts/md.svg';
import research from '../../assets/onechat/artifacts/deep-research.svg';
import code from '../../assets/onechat/artifacts/code.svg';
import mermaid from '../../assets/onechat/artifacts/mermaid.svg';
import json from '../../assets/onechat/artifacts/json.svg';
import word from '../../assets/onechat/artifacts/word.svg';
import excel from '../../assets/onechat/artifacts/excel.svg';
import ppt from '../../assets/onechat/artifacts/power-point.svg';
import pdf from '../../assets/onechat/artifacts/pdf.svg';

export const artifactFilters = ['All', 'HTML', 'Code', 'Images', 'Deep Research', 'Markdown', 'Document', 'JSON', 'PPT', 'PDF'] as const;
export type ArtifactFilter = typeof artifactFilters[number];
export interface Artifact {
  id: string;
  title: string;
  type: string;
  icon: string;
  description: string;
  updatedAt: string;
  categories: ArtifactFilter[];
}

// Titles, summaries, timestamp labels and resolved icon overrides are from Figma 20427:47955.
// Demo years make the yearless timestamps sortable and keep the interactive demo first.
export const artifacts: Artifact[] = [
  { id: 'interactive-demo', title: 'Interactive Artifact Demo', type: 'Code', icon: code, updatedAt: '2026-03-29T11:33:00Z', categories: ['Code', 'HTML'], description: 'A single-page website maintenance notice with a live preview and downloadable HTML.' },
  { id: 'ai-trends', title: 'AI Trends Shaping 2025', type: 'Markdown', icon: markdown, updatedAt: '2025-12-12T18:30:00Z', categories: [], description: 'A concise overview of AI trends, adoption drivers, and the likely impact on work, products, and society.' },
  { id: 'blockchain', title: 'Blockchain Beyond Digital Currency', type: 'Deep Research', icon: research, updatedAt: '2025-11-02T16:44:00Z', categories: ['Deep Research'], description: 'Explore how blockchain is reshaping supply chains, identity, healthcare, and finance beyond digital currency.' },
  { id: 'energy', title: 'Sustainable Energy Solutions', type: 'HTML / Javascript', icon: code, updatedAt: '2025-01-01T01:00:00Z', categories: ['HTML', 'Code'], description: 'A practical overview of clean energy systems, storage, and the technologies driving the transition.' },
  { id: 'nano-science', title: 'Nanotechnology: Science and Applications', type: 'Document', icon: mermaid, updatedAt: '2025-08-08T07:17:00Z', categories: [], description: 'A concise introduction to nanotechnology, its applications, and the emerging opportunities in medicine and materials.' },
  { id: 'nano-data', title: 'Nanotechnology Research Dataset', type: 'JSON', icon: json, updatedAt: '2025-08-08T07:17:00Z', categories: ['Code'], description: 'Structured data on nanotechnology applications, materials, and emerging research areas.' },
  { id: 'nano-industry', title: 'Nanotechnology Industry Briefing', type: 'Document', icon: word, updatedAt: '2025-08-08T07:17:00Z', categories: [], description: 'A short overview of nanotechnology, its current state, and the industries most likely to be affected.' },
  { id: 'crispr', title: 'CRISPR Ethics and Social Impact', type: 'Deep Research', icon: excel, updatedAt: '2025-05-03T14:15:00Z', categories: ['Deep Research'], description: 'Examine the ethical questions around CRISPR, from consent and access to long-term societal implications.' },
  { id: 'iot', title: 'Industrial IoT and Connected Operations', type: 'PPT', icon: ppt, updatedAt: '2025-09-15T15:33:00Z', categories: [], description: 'See how IoT is reshaping operations, from smart homes and cities to manufacturing and logistics.' },
  { id: 'vr-ar', title: 'Virtual and Augmented Reality Landscape', type: 'PDF', icon: pdf, updatedAt: '2025-10-31T10:10:00Z', categories: [], description: 'Review the current state of VR and AR, including adoption, use cases, and the next wave of applications.' },
  { id: 'alk', title: 'ALK-Positive Lung Cancer: Treatments and Side Effects', type: 'Deep Research', icon: research, updatedAt: '2025-03-29T11:33:00Z', categories: ['Deep Research'], description: 'Anaplastic lymphoma kinase (ALK)-positive lung cancer is a distinct molecular subtype of non-small cell.' },
];

// The reference supplies a count, but no shared-tab content. Reuse two sample records.
export const sharedArtifacts: Artifact[] = [artifacts[2], artifacts[3]];

const archiveStorageKey = 'n1.artifacts.archived.v1';

export function readArchivedArtifactIds(): string[] {
  let stored: unknown;
  try {
    stored = JSON.parse(localStorage.getItem(archiveStorageKey) ?? '[]');
  } catch {
    return [];
  }
  return Array.isArray(stored) ? artifacts.filter(artifact => stored.includes(artifact.id)).map(artifact => artifact.id) : [];
}

export function writeArchivedArtifactIds(ids: string[]) {
  localStorage.setItem(archiveStorageKey, JSON.stringify(ids));
}

const artifactDate = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
});

export function formatArtifactDate(updatedAt: string) {
  return artifactDate.format(new Date(updatedAt));
}
