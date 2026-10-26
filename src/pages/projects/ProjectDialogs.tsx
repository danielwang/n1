import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, FileText, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { formatFileSize, type Project, type ProjectConversation, type ProjectFile } from './project-data';

export function ProjectEditor({ project, onSave, onClose }: {
  project?: Project;
  onSave: (name: string, description: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) { setError('Enter a project name.'); input.current?.focus(); return; }
    setSaving(true);
    try { await onSave(name.trim(), description.trim()); }
    catch { setError('The project could not be saved. Your text is still here; please try again.'); setSaving(false); }
  };
  return <Dialog title={project ? 'Rename project' : 'Create project'} onClose={onClose} className="pj-dialog">
    {close => <form className="pj-form" onSubmit={submit} noValidate>
      <p>Keep related conversations, instructions, and file references together.</p>
      <label htmlFor={`${id}-name`}>Project name <span>Required</span></label>
      <input autoFocus ref={input} id={`${id}-name`} value={name} maxLength={80} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} placeholder="e.g. Student onboarding" onChange={event => { setName(event.target.value); setError(''); }} />
      <Feedback id={`${id}-error`} message={error} tone="error" />
      <label htmlFor={`${id}-description`}>Description <span>Optional</span></label>
      <textarea id={`${id}-description`} value={description} maxLength={240} rows={3} placeholder="What are you working towards?" onChange={event => setDescription(event.target.value)} />
      <p className="pj-form-note">Saved in this browser. No shared workspace or AI service is connected.</p>
      <div className="pj-dialog-actions"><Button variant="outline" onClick={close}>Cancel</Button><Button variant="default" type="submit" disabled={saving}>{saving ? 'Saving…' : project ? 'Save changes' : 'Create project'}</Button></div>
    </form>}
  </Dialog>;
}

export function DeleteProjectDialog({ project, onDelete, onClose }: { project: Project; onDelete: () => Promise<void>; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <Dialog title="Delete project?" onClose={onClose} className="pj-dialog">
    {close => <><div className="pj-delete-symbol"><Trash2 size={24} /></div>
      <p>Delete <strong>{project.name}</strong> and its {project.conversations.length} conversations and {project.files.length} file references from this demo? This cannot be undone. Original files on your device are unaffected.</p>
      <Feedback message={error} tone="error" />
      <div className="pj-dialog-actions"><Button autoFocus variant="outline" onClick={close}>Cancel</Button><Button className="pj-danger" onClick={async () => {
        setBusy(true); try { await onDelete(); } catch { setError('The project could not be deleted. Please try again.'); setBusy(false); }
      }} disabled={busy}>{busy ? 'Deleting…' : 'Delete project'}</Button></div>
    </>}
  </Dialog>;
}

export function RemoveFileDialog({ file, onRemove, onClose }: { file: ProjectFile; onRemove: () => Promise<void>; onClose: () => void }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return <Dialog title="Remove file reference?" onClose={onClose} className="pj-dialog">
    {close => <><p>Remove <strong>{file.name}</strong> ({formatFileSize(file.size)}) from this project? This only removes its local reference; the original file is unaffected.</p>
      <Feedback message={error} tone="error" />
      <div className="pj-dialog-actions"><Button autoFocus variant="outline" onClick={close}>Cancel</Button><Button className="pj-danger" disabled={busy} onClick={async () => {
        setBusy(true); try { await onRemove(); } catch { setError('The file reference could not be removed. Please try again.'); setBusy(false); }
      }}>{busy ? 'Removing…' : 'Remove reference'}</Button></div>
    </>}
  </Dialog>;
}

export function ProjectConversationDialog({ project, conversation, onMessage, onClose }: {
  project: Project;
  conversation?: ProjectConversation;
  onMessage: (text: string) => Promise<void>;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => { if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }, [conversation?.messages.length]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) { setError('Write a message to start or continue this conversation.'); input.current?.focus(); return; }
    setSaving(true); setError('');
    try { await onMessage(text.trim()); setText(''); requestAnimationFrame(() => input.current?.focus()); }
    catch { setError('Your message could not be saved. Please try again.'); }
    finally { setSaving(false); }
  };
  return <Dialog title={conversation?.title || 'New conversation'} onClose={onClose} className="pj-dialog pj-conversation-dialog">
    <p className="pj-conversation-project">{project.name}</p>
    <div className="pj-context-strip"><span><Pencil size={14} />{project.instructions ? 'Instructions saved' : 'No instructions yet'}</span><span><FileText size={14} />{project.files.length} file references</span></div>
    <p className="pj-local-note">Local conversation demo. Messages are saved in this browser. No AI responses are generated and files are not processed.</p>
    <div className="pj-transcript" ref={transcript} role="region" aria-label="Conversation messages" tabIndex={0}>
      {conversation?.messages.length ? <ol>{conversation.messages.map(message => <li key={message.id}><div><strong>You</strong><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time></div><p>{message.text}</p></li>)}</ol>
        : <div className="pj-conversation-empty"><MessageSquare size={28} /><h3>A fresh thread for this project</h3><p>Capture a question, explore an idea, or outline the next experiment.</p></div>}
    </div>
    <form className="pj-form pj-message-form" onSubmit={submit} noValidate>
      <label htmlFor={id}>Message</label>
      <textarea autoFocus ref={input} id={id} rows={3} maxLength={10000} value={text} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} placeholder="What would you like to work on?" onChange={event => { setText(event.target.value); setError(''); }} />
      <Feedback id={`${id}-error`} message={error} tone="error" />
      <div className="pj-dialog-actions"><span className="pj-form-note">Local draft · no AI service</span><Button type="submit" variant="default" disabled={saving}><ArrowUp size={16} />{saving ? 'Saving…' : conversation ? 'Save message' : 'Start conversation'}</Button></div>
    </form>
  </Dialog>;
}

export function ShareProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  return <Dialog title="Share project" className="pj-dialog" onClose={onClose}><form className="pj-form" noValidate onSubmit={event => {
    event.preventDefault();
    if (!email.trim() || !input.current?.validity.valid) { setError('Enter a valid email address.'); input.current?.focus(); return; }
    setError(''); setPreview('Demo invitation preview: ' + project.name + ' would be shared with ' + email.trim() + '. No invitation has been sent and no permissions have changed.');
  }}>
    <p>Preview sharing this project with a colleague. Sharing is simulated; no email is sent.</p>
    <label htmlFor={id}>Email address</label><input autoFocus ref={input} id={id} type="email" required value={email} aria-invalid={Boolean(error)} aria-describedby={error ? id + '-error' : undefined} onChange={event => { setEmail(event.target.value); setError(''); setPreview(''); }} />
    <Feedback id={id + '-error'} message={error} tone="error" /><Feedback message={preview} tone="success" />
    <div className="pj-dialog-actions"><Button variant="default" type="submit">Preview invitation</Button></div>
  </form></Dialog>;
}
