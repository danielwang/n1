import data from '../../assets/onechat/directory/data.svg';
import aero from '../../assets/onechat/directory/aero.svg';
import knowledge from '../../assets/onechat/directory/knowledge.svg';
import study from '../../assets/onechat/agent/centaurus.png';
import official from '../../assets/onechat/directory/official.svg';
import code from '../../assets/onechat/directory/code.svg';
import search from '../../assets/onechat/directory/search.svg';
import edit from '../../assets/onechat/directory/edit.svg';
import share from '../../assets/onechat/directory/share.svg';
import plus from '../../assets/onechat/directory/plus-circle.svg';
import plusSmall from '../../assets/onechat/directory/plus-small.svg';
import chevron from '../../assets/onechat/directory/chevron.svg';

export type AgentGlyph = 'data' | 'aero' | 'code' | 'knowledge' | 'study';
export interface DirectoryAgent {
  id: string;
  name: string;
  description: string;
  glyph: AgentGlyph;
  scope: 'official' | 'mine' | 'shared';
}
export const directoryArt = { data, aero, knowledge, study, official, code, search, edit, share, plus, plusSmall, chevron };

const officialRow: Omit<DirectoryAgent, 'id'>[] = [
  { name: 'DataAnalyzer', description: 'An AI tool that processes large datasets to uncover trends and insights, aiding decision-making.', glyph: 'data', scope: 'official' },
  { name: 'AeroMind', description: 'A cutting-edge AI designed for optimizing workflow efficiency and managing tasks seamlessly.', glyph: 'aero', scope: 'official' },
  { name: 'CodeMentor', description: 'Your AI coding assistant for debugging and code completion.', glyph: 'code', scope: 'official' },
  { name: 'Knowledge Guide', description: 'Explore new subjects, connect ideas, and find clear explanations for your next learning challenge.', glyph: 'knowledge', scope: 'official' },
];
// Two rows preserve the supplied mockup; placeholder names/copy are made meaningful.
export const officialAgents: DirectoryAgent[] = [0, 1].flatMap(row => officialRow.map((agent, index) => ({ ...agent, id: `official-${row}-${index}` })));
export const initialPersonalAgents: DirectoryAgent[] = [
  { id: 'science-lab', name: 'Science Study Companion', description: 'Explore the wonders of science with engaging experiments and interactive lessons.', glyph: 'study', scope: 'mine' },
  { id: 'history', name: 'History Explorer', description: 'Dive into the past with captivating stories and timelines that bring history to life.', glyph: 'study', scope: 'mine' },
  { id: 'science-study', name: 'Science Study Companion', description: 'Explore the wonders of science with engaging experiments and interactive lessons.', glyph: 'study', scope: 'mine' },
];
// The reference specifies a count of two, without showing this tab's contents.
export const sharedAgents: DirectoryAgent[] = [
  { id: 'shared-campus', name: 'Campus Study Guide', description: 'Plan study sessions and find useful university resources with your classmates.', glyph: 'study', scope: 'shared' },
  { id: 'shared-research', name: 'Research Companion', description: 'Organise research questions and prepare a reading plan with your project team.', glyph: 'knowledge', scope: 'shared' },
];

export const directoryStorageKey = 'n1-directory-agents-v1';
export function loadPersonalAgents(): DirectoryAgent[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(directoryStorageKey) || 'null');
    if (Array.isArray(value) && value.every(item => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.name === 'string' && item.name.trim() && item.name.length <= 60 && typeof item.description === 'string' && item.description.trim() && item.description.length <= 300 && ['data', 'aero', 'code', 'knowledge', 'study'].includes(item.glyph) && item.scope === 'mine')) return value;
  } catch { /* Use local seed data when storage is unavailable or invalid. */ }
  return initialPersonalAgents;
}
