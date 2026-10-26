import { useCallback, useEffect, useRef, useState } from 'react';
import { projectRepository } from './project-repository';
import type { Project, ProjectConversation, ProjectFile, ProjectMessage } from './project-data';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const current = useRef<Project[]>([]);
  const sessionOnly = useRef(false);
  const mounted = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await projectRepository.load();
      if (!mounted.current) return;
      current.current = result.projects;
      sessionOnly.current = Boolean(result.warning);
      setProjects(result.projects); setWarning(result.warning);
    } catch {
      if (mounted.current) setError('Projects could not be loaded. Please try again.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    void load();
    return () => { mounted.current = false; };
  }, [load]);

  const commit = async (next: Project[]) => {
    current.current = next; setProjects(next);
    if (sessionOnly.current) return;
    try { await projectRepository.save(next); }
    catch {
      sessionOnly.current = true;
      setWarning('Browser storage is unavailable or full. Your changes are kept for this session only and will be lost when you leave this page or reload.');
    }
  };
  const update = async (id: string, change: (project: Project) => Project) => {
    if (!current.current.some(project => project.id === id)) throw new Error('This project is no longer available.');
    await commit(current.current.map(project => project.id === id ? { ...change(project), updatedAt: new Date().toISOString() } : project));
  };
  return {
    projects, loading, error, warning, reload: load,
    async create(name: string, description: string) {
      const now = new Date().toISOString();
      const project: Project = { id: crypto.randomUUID(), name, description, instructions: '', createdAt: now, updatedAt: now, files: [], conversations: [] };
      await commit([project, ...current.current]); return project;
    },
    rename: (id: string, name: string, description: string) => update(id, project => ({ ...project, name, description })),
    saveInstructions: (id: string, instructions: string) => update(id, project => ({ ...project, instructions })),
    setArchived: (id: string, archived: boolean) => update(id, project => ({ ...project, archived })),
    remove: (id: string) => commit(current.current.filter(project => project.id !== id)),
    addFiles: (id: string, files: ProjectFile[]) => update(id, project => ({ ...project, files: [...project.files, ...files] })),
    removeFile: (id: string, fileId: string) => update(id, project => ({ ...project, files: project.files.filter(file => file.id !== fileId) })),
    addConversation: (id: string, conversation: ProjectConversation) => update(id, project => ({ ...project, conversations: [conversation, ...project.conversations] })),
    appendMessage: (id: string, conversationId: string, message: ProjectMessage) => update(id, project => ({
      ...project,
      conversations: project.conversations.map(chat => chat.id === conversationId ? { ...chat, updatedAt: message.createdAt, messages: [...chat.messages, message] } : chat),
    })),
  };
}
