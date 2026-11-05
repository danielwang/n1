import type { ProjectGlyph } from '../projects/project-art';

export interface Course {
  id: string;
  name: string;
  description: string;
  glyph: ProjectGlyph;
  updatedAt: string;
  archived: boolean;
  modules: string[];
}

export const courseStorageKey = 'n1-courses-v1';

export const seedCourses: Course[] = [
  { id: 'bio101', name: 'BIO101 · Foundations of Biology', description: 'Explore cells, genetics, and ecology through lectures, labs, and weekly review.', glyph: 'biology', updatedAt: '2026-10-29T11:33:00', archived: false, modules: ['Cell structure and function', 'Genetics and inheritance', 'Ecology and ecosystems'] },
  { id: 'psy201', name: 'PSY201 · Cognitive Psychology', description: 'Study memory, attention, perception, and the research methods behind them.', glyph: 'research', updatedAt: '2026-10-27T14:15:00', archived: false, modules: ['Attention and perception', 'Learning and memory', 'Research methods'] },
  { id: 'mat203', name: 'MAT203 · Applied Statistics', description: 'Build confidence with probability, hypothesis testing, and data interpretation.', glyph: 'presentation', updatedAt: '2026-10-24T09:10:00', archived: false, modules: ['Describing data', 'Probability', 'Inference and testing'] },
  { id: 'eng220', name: 'ENG220 · Academic Writing', description: 'Develop clear arguments, use sources responsibly, and revise with purpose.', glyph: 'book', updatedAt: '2026-10-22T16:45:00', archived: false, modules: ['Research questions', 'Building an argument', 'Editing and citation'] },
  { id: 'chem101', name: 'CHEM101 · General Chemistry', description: 'Review atomic structure, bonding, and reactions with practical examples.', glyph: 'exam', updatedAt: '2026-09-18T10:20:00', archived: true, modules: ['Atomic structure', 'Chemical bonding', 'Reaction basics'] },
];

function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.description === 'string'
    && typeof item.updatedAt === 'string' && typeof item.archived === 'boolean'
    && ['biology', 'research', 'presentation', 'book', 'exam', 'project'].includes(String(item.glyph))
    && Array.isArray(item.modules) && item.modules.every(module => typeof module === 'string');
}

export function loadCourses(): { courses: Course[]; warning: string } {
  try {
    const saved = localStorage.getItem(courseStorageKey);
    if (!saved) return { courses: seedCourses, warning: '' };
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.every(isCourse)) return { courses: parsed, warning: '' };
    return { courses: seedCourses, warning: 'Saved course data could not be read. Showing sample courses instead.' };
  } catch {
    return { courses: seedCourses, warning: 'Browser storage is unavailable. Course changes will last only for this session.' };
  }
}
