import markdown from '../../assets/onechat/artifacts/md.svg';
import research from '../../assets/onechat/artifacts/deep-research.svg';
import code from '../../assets/onechat/artifacts/code.svg';
import mermaid from '../../assets/onechat/artifacts/mermaid.svg';
import json from '../../assets/onechat/artifacts/json.svg';
import word from '../../assets/onechat/artifacts/word.svg';
import excel from '../../assets/onechat/artifacts/excel.svg';
import ppt from '../../assets/onechat/artifacts/power-point.svg';
import pdf from '../../assets/onechat/artifacts/pdf.svg';

export const artifactFilters = ['All', 'HTML', 'Code', 'Images', 'Deep Research'] as const;
export type ArtifactFilter = typeof artifactFilters[number];
export interface Artifact {
  id: string;
  title: string;
  type: string;
  icon: string;
  description: string;
  updated: string;
  categories: ArtifactFilter[];
}

// Titles, summaries, dates and resolved icon overrides are from Figma 20427:47955.
export const artifacts: Artifact[] = [
  { id: 'ai-trends', title: 'AI Trends Shaping 2025', type: 'Markdown', icon: markdown, updated: 'Dec 12, 6:30 PM', categories: [], description: 'A concise overview of AI trends, adoption drivers, and the likely impact on work, products, and society.' },
  { id: 'blockchain', title: 'Blockchain Beyond Digital Currency', type: 'Deep Research', icon: research, updated: 'Nov 2, 4:44 PM', categories: ['Deep Research'], description: 'Explore how blockchain is reshaping supply chains, identity, healthcare, and finance beyond digital currency.' },
  { id: 'energy', title: 'Sustainable Energy Solutions', type: 'HTML / Javascript', icon: code, updated: 'Jan 1, 1:00 AM', categories: ['HTML', 'Code'], description: 'A practical overview of clean energy systems, storage, and the technologies driving the transition.' },
  { id: 'nano-science', title: 'Nanotechnology: Science and Applications', type: 'Document', icon: mermaid, updated: 'Aug 8, 7:17 AM', categories: [], description: 'A concise introduction to nanotechnology, its applications, and the emerging opportunities in medicine and materials.' },
  { id: 'nano-data', title: 'Nanotechnology Research Dataset', type: 'JSON', icon: json, updated: 'Aug 8, 7:17 AM', categories: ['Code'], description: 'Structured data on nanotechnology applications, materials, and emerging research areas.' },
  { id: 'nano-industry', title: 'Nanotechnology Industry Briefing', type: 'Document', icon: word, updated: 'Aug 8, 7:17 AM', categories: [], description: 'A short overview of nanotechnology, its current state, and the industries most likely to be affected.' },
  { id: 'crispr', title: 'CRISPR Ethics and Social Impact', type: 'Deep Research', icon: excel, updated: 'May 3, 2:15 PM', categories: ['Deep Research'], description: 'Examine the ethical questions around CRISPR, from consent and access to long-term societal implications.' },
  { id: 'iot', title: 'Industrial IoT and Connected Operations', type: 'PPT', icon: ppt, updated: 'Sep 15, 3:33 PM', categories: [], description: 'See how IoT is reshaping operations, from smart homes and cities to manufacturing and logistics.' },
  { id: 'vr-ar', title: 'Virtual and Augmented Reality Landscape', type: 'PDF', icon: pdf, updated: 'Oct 31, 10:10 AM', categories: [], description: 'Review the current state of VR and AR, including adoption, use cases, and the next wave of applications.' },
  { id: 'alk', title: 'ALK-Positive Lung Cancer: Treatments and Side Effects', type: 'Deep Research', icon: research, updated: 'Mar 29, 11:33 AM', categories: ['Deep Research'], description: 'Anaplastic lymphoma kinase (ALK)-positive lung cancer is a distinct molecular subtype of non-small cell.' },
];

// The reference supplies a count, but no shared-tab content. Reuse two sample records.
export const sharedArtifacts: Artifact[] = [artifacts[1], artifacts[2]];
