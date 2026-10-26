import { projectStorageKey, seedProjects, type Project } from './project-data';
import { projectArt } from './project-art';
import { projectFileArt } from './detail-art';

export interface ProjectLoadResult {
  projects: Project[];
  warning: string;
}

// Storage lives behind an async boundary so the UI can later use an API adapter.
export interface ProjectRepository {
  load(): Promise<ProjectLoadResult>;
  save(projects: Project[]): Promise<void>;
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const validDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const text = (value: unknown): value is string => typeof value === 'string';
const unique = (items: { id: string }[]) => new Set(items.map(item => item.id)).size === items.length;

function validProject(value: unknown): value is Project {
  if (record(value) && value.artifacts !== undefined && (!Array.isArray(value.artifacts) || !value.artifacts.every(item => record(item) && text(item.id) && text(item.title) && text(item.category) && text(item.summary) && text(item.kind) && Object.prototype.hasOwnProperty.call(projectFileArt, item.kind)) || !unique(value.artifacts))) return false;
  if (!record(value) || (value.archived !== undefined && typeof value.archived !== 'boolean') || (value.glyph !== undefined && (typeof value.glyph !== 'string' || !Object.prototype.hasOwnProperty.call(projectArt, value.glyph)))) return false;
  if (!record(value) || !text(value.id) || !value.id || !text(value.name) || !value.name.trim() || !text(value.description) || !text(value.instructions) || !validDate(value.createdAt) || !validDate(value.updatedAt)) return false;
  if (!Array.isArray(value.files) || !value.files.every(file => record(file) && text(file.id) && text(file.name) && typeof file.size === 'number' && Number.isFinite(file.size) && file.size >= 0 && text(file.type) && validDate(file.addedAt)) || !unique(value.files)) return false;
  if (!Array.isArray(value.conversations) || !value.conversations.every(chat => record(chat) && text(chat.id) && text(chat.title) && validDate(chat.updatedAt) && Array.isArray(chat.messages) && chat.messages.every(message => record(message) && text(message.id) && text(message.text) && validDate(message.createdAt)) && unique(chat.messages)) || !unique(value.conversations)) return false;
  return true;
}

export const projectRepository: ProjectRepository = {
  async load() {
    try {
      const stored = localStorage.getItem(projectStorageKey);
      if (stored === null) return { projects: seedProjects(), warning: '' };
      const parsed: unknown = JSON.parse(stored);
      if (!record(parsed) || parsed.version !== 1 || !Array.isArray(parsed.projects) || !parsed.projects.every(validProject) || !unique(parsed.projects)) throw new Error('Invalid project data');
      return { projects: parsed.projects, warning: '' };
    } catch {
      return { projects: seedProjects(), warning: 'Saved project data could not be read. Sample projects and any new changes are available for this session only. Existing saved data has not been changed.' };
    }
  },
  async save(projects) {
    localStorage.setItem(projectStorageKey, JSON.stringify({ version: 1, projects }));
  },
};
