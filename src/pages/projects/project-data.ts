import type { ProjectGlyph } from './project-art';
import type { ProjectArtifactKind } from './detail-art';

export interface ProjectArtifact {
  id: string;
  title: string;
  category: string;
  kind: ProjectArtifactKind;
  summary: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: string;
}

export interface ProjectMessage {
  id: string;
  text: string;
  createdAt: string;
}

export interface ProjectConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ProjectMessage[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  files: ProjectFile[];
  conversations: ProjectConversation[];
  glyph?: ProjectGlyph;
  archived?: boolean;
  artifacts?: ProjectArtifact[];
}

export const projectStorageKey = 'n1-projects-v1';
export const maxFileSize = 10 * 1024 * 1024;
export const maxProjectFiles = 20;
export const acceptedFileTypes = '.pdf,.txt,.md,.csv,.json,.docx,.xlsx,.pptx,.png,.jpg,.jpeg';

// Visible sample cards follow Figma frame 24848:34056 in its authored order.
export function seedProjects(): Project[] {
  const date = (month: number, day: number, hour: number, minute: number, year = 2026) => new Date(year, month - 1, day, hour, minute).toISOString();
  const make = (id: string, name: string, description: string, glyph: ProjectGlyph, updatedAt: string, archived = false): Project => ({
    id, name, description, glyph, archived, updatedAt, createdAt: updatedAt,
    instructions: '', files: [], conversations: [],
  });
  const projects = [
    make('bio101', 'BIO101', 'Explore the fundamentals of cell biology, genetics, and ecology with lab exercises and weekly quizzes.', 'biology', date(3, 29, 11, 33)),
    make('psychology-research', 'Psychology Research Paper', 'A deep dive into cognitive behavioral patterns and their effects on decision-making in young adults.', 'research', date(3, 29, 11, 33)),
    make('semester-2', 'Semester 2 Study', 'Consolidated notes and revision material covering all core modules for the upcoming semester exams.', 'book', date(3, 29, 11, 33)),
    make('thesis-research', 'Thesis Research', 'Literature review and methodology draft for investigating renewable energy adoption in urban areas.', 'project', date(12, 12, 18, 30, 2025)),
    make('exam-preparation', 'Exam Preparation', 'Practice questions, flashcards, and timed mock tests across mathematics, physics, and chemistry.', 'exam', date(11, 2, 16, 44, 2025)),
    make('data-science', 'Data Science Assignment', 'Hands-on project analyzing real-world datasets using Python, pandas, and machine learning models.', 'presentation', date(5, 3, 14, 15)),
    // The mockup supplies the archived count, but does not show its contents.
    make('semester-1', 'Semester 1 Study', 'Notes and revision plans from the previous semester.', 'book', date(2, 15, 10, 0), true),
    make('literature-review', 'Completed Literature Review', 'A reference collection from a completed research project.', 'research', date(1, 20, 15, 30), true),
  ];
  const now = Date.now();
  const prompts = ['Compare plant and animal cell structures', 'Plan a simple osmosis experiment', 'Review the stages of cell division', 'Explain patterns of inheritance', 'Connect food webs and energy transfer', 'Prepare questions for the next lab', 'Check the variables in our experiment', 'Review notes on enzyme activity', 'Organise observations from the field study', 'Draft a revision plan for genetics', 'Build a checklist for the lab report'];
  projects[0].conversations = prompts.map((title, index) => {
    const updatedAt = new Date(now - [0, 2, 4, 5, 6, 8, 15, 30, 45, 60, 120][index] * 60000).toISOString();
    return { id: 'biology-chat-' + index, title, updatedAt, messages: [{ id: 'biology-message-' + index, text: title + '. Help me identify questions to explore and evidence to collect.', createdAt: updatedAt }] };
  });
  projects[0].files = [
    { id: 'sample-document', name: 'Document1.pdf', size: 120 * 1024, type: 'application/pdf', addedAt: projects[0].updatedAt },
    { id: 'sample-sheet', name: 'Spreadsheet3.xlsx', size: 75 * 1024, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', addedAt: projects[0].updatedAt },
    { id: 'sample-image', name: 'Image2.png', size: 45 * 1024, type: 'image/png', addedAt: projects[0].updatedAt },
    { id: 'sample-slides', name: 'Presentation4.pptx', size: 150 * 1024, type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', addedAt: projects[0].updatedAt },
  ];
  projects[0].artifacts = [
    { id: 'cell-model', title: 'Cell Structure Model', category: 'Code', kind: 'code', summary: 'A sample outline for an interactive cell-structure activity.' },
    { id: 'lab-layout', title: 'Lab Report Outline', category: 'Design', kind: 'research', summary: 'A sample report structure for recording a question, method, and observations.' },
    { id: 'osmosis-draft', title: 'Osmosis Activity Draft', category: 'Development', kind: 'ppt', summary: 'A sample activity outline to discuss before planning a classroom experiment.' },
    { id: 'revision-check', title: 'Revision Checklist', category: 'Testing', kind: 'markdown', summary: 'A sample checklist of topics to revisit before a quiz.' },
    { id: 'field-notes', title: 'Field Notes Template', category: 'Deployment', kind: 'code', summary: 'A sample structure for recording field observations consistently.' },
    { id: 'study-table', title: 'Study Question Matrix', category: 'Research', kind: 'excel', summary: 'A sample matrix for organising topics and open study questions.' },
    { id: 'lab-results', title: 'Lab Results Summary', category: 'Analysis', kind: 'code', summary: 'A sample structure for summarising observations without inventing results.' },
    { id: 'peer-review', title: 'Peer Review Notes', category: 'Feedback', kind: 'markdown', summary: 'Sample prompts for giving constructive feedback on a lab report.' },
  ];
  return projects;
}

export function projectDate(date: string) {
  const value = new Date(date);
  const day = value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return day + ', ' + time;
}

export function projectUrl(id?: string) {
  return id ? `#/onechat/projects/${encodeURIComponent(id)}` : '#/onechat/projects';
}

export function relativeTime(date: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(date)) / 60000));
  if (minutes < 1) return 'Just now';
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (minutes < 60) return format.format(-minutes, 'minute');
  if (minutes < 1440) return format.format(-Math.floor(minutes / 60), 'hour');
  return format.format(-Math.floor(minutes / 1440), 'day');
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
