import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { Asset, BudgetIndicator } from '../onechat/OneChatPage';
import { assets } from '../onechat/assets';
import { projectArt } from './project-art';
import { projectUrl, relativeTime, type Project, type ProjectArtifact, type ProjectConversation, type ProjectFile } from './project-data';
import { detailArt, projectFileArt } from './detail-art';
import { ProjectKnowledge } from './ProjectKnowledge';
import './project-detail.css';

const detailTabs = [
  { id: 'chats', label: 'Chats', icon: detailArt.chat, active: detailArt.chatActive },
  { id: 'artifacts', label: 'Artifacts', icon: detailArt.artifacts, active: detailArt.artifactsActive },
  { id: 'knowledge', label: 'Knowledge', icon: detailArt.knowledge, active: detailArt.knowledgeActive },
  { id: 'instruction', label: 'Instruction', icon: detailArt.instruction, active: detailArt.instructionActive },
  { id: 'memory', label: 'Memory', icon: detailArt.memory, active: detailArt.memory },
] as const;
type DetailTab = typeof detailTabs[number]['id'];

export function ProjectDetail({ project, actions, navigationControls, notificationControl, onShare, onInfo, onStartConversation, onConversation, onSaveInstructions, onAddFiles, onRemoveFile }: {
  project: Project; actions: ReactNode; navigationControls: ReactNode; notificationControl: ReactNode;
  onShare: () => void; onInfo: (info: { title: string; message: string }) => void;
  onStartConversation: (text: string) => Promise<void>; onConversation: (conversation: ProjectConversation) => void;
  onSaveInstructions: (instructions: string) => Promise<void>; onAddFiles: (files: ProjectFile[]) => Promise<void>; onRemoveFile: (file: ProjectFile) => void;
}) {
  const [tab, setTab] = useState<DetailTab>('chats');
  const [text, setText] = useState('');
  const [messageError, setMessageError] = useState('');
  const [sending, setSending] = useState(false);
  const [instructions, setInstructions] = useState(project.instructions);
  const [instructionError, setInstructionError] = useState('');
  const [instructionStatus, setInstructionStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [preview, setPreview] = useState<ProjectArtifact | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const fileChooser = useRef<HTMLInputElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const instructionLimit = Math.max(500, project.instructions.length);
  const description = project.description || 'Keep related chats, files, and context together for this project.';
  const conversations = [...project.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const artifacts = project.artifacts || [];
  useEffect(() => { setInstructions(project.instructions); }, [project.instructions]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    if (!text.trim()) { setMessageError('Write a message to start a project conversation.'); input.current?.focus(); return; }
    setSending(true); setMessageError('');
    try { await onStartConversation(text.trim()); setText(''); setTab('chats'); }
    catch { setMessageError('Your message could not be saved. Please try again.'); }
    finally { setSending(false); }
  };
  return <>
    <header className="pd-toolbar" aria-label="Project toolbar">
      <div className="pd-toolbar-start">{navigationControls}<a className="ui-button ui-button--size-icon pd-back" href={projectUrl()} aria-label="All projects"><img src={detailArt.back} alt="" /></a>
        <Button variant="outline" className="oc-model-selector" aria-label="Chat model: GPT 5.1" aria-haspopup="dialog" aria-expanded={modelOpen} onClick={() => setModelOpen(true)}><Asset src={assets.model} /><span>GPT 5.1</span><Asset src={assets.chevron} /></Button>
      </div>
      <div className="pd-toolbar-aux"><Button size="icon" aria-label="Share project" onClick={onShare}><img src={detailArt.share} alt="" /></Button>{actions}</div>
      <div className="pd-toolbar-end">{notificationControl}<BudgetIndicator /></div>
    </header>
    <div className="pd-workspace">
      <div className="pd-project-heading"><span className={`pd-avatar ${project.glyph === 'biology' ? 'pd-avatar--biology' : ''}`}><img src={project.glyph === 'biology' ? detailArt.testTube : projectArt[project.glyph || 'project']} alt="" /></span>
        <div><h1 tabIndex={-1}>{project.name}</h1><p>{description.length > 96 ? description.slice(0, 96).trimEnd() + '… ' : description}{description.length > 96 && <Button className="pd-show-more" onClick={() => onInfo({ title: project.name, message: description })}>show more</Button>}</p></div>
      </div>
      <form className="pd-composer-form" onSubmit={submit} noValidate>
        <div className="oc-composer pd-composer"><Button size="icon" className="oc-attach" aria-label="Add project files" onClick={() => fileChooser.current?.click()}><Asset src={assets.plus} /></Button>
          <textarea ref={input} rows={1} maxLength={10000} value={text} aria-label="Project message" aria-invalid={Boolean(messageError)} aria-describedby={messageError ? 'pd-message-error' : undefined} placeholder="Type a message" onChange={event => { setText(event.target.value); setMessageError(''); }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <Button size="icon" className="pd-mic" aria-label="Voice input information" onClick={() => onInfo({ title: 'Voice input', message: 'Voice input is not connected in this local prototype. Type a message to save a project conversation; no AI response will be generated.' })}><img src={detailArt.mic} alt="" /></Button>
          <Button size="icon" className="pd-send" type="submit" aria-label={sending ? 'Saving project conversation' : 'Start project conversation'} disabled={sending}><img src={detailArt.send} alt="" /></Button>
        </div><Feedback id="pd-message-error" message={messageError} tone="error" />
      </form>
      <div ref={tabs} className="pd-tabs" role="tablist" aria-label="Project content" onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); const index = detailTabs.findIndex(item => item.id === tab);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? detailTabs.length - 1 : (index + (event.key === 'ArrowLeft' ? -1 : 1) + detailTabs.length) % detailTabs.length;
        setTab(detailTabs[next].id); tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${detailTabs[next].id}"]`)?.focus();
      }}>{detailTabs.map(item => <Button key={item.id} id={`pd-tab-${item.id}`} role="tab" data-tab={item.id} aria-controls={`pd-panel-${item.id}`} aria-selected={tab === item.id} tabIndex={tab === item.id ? 0 : -1} onClick={() => setTab(item.id)}><img src={tab === item.id ? item.active : item.icon} alt="" /><span>{item.label}</span></Button>)}</div>
      <section id="pd-panel-chats" role="tabpanel" aria-labelledby="pd-tab-chats" className="pd-panel" hidden={tab !== 'chats'}>
        {conversations.length ? <ul className="pd-chat-list">{conversations.map(chat => <li key={chat.id}><Button onClick={() => onConversation(chat)} aria-label={`Open conversation: ${chat.title}`}><span>{chat.title}</span><time dateTime={chat.updatedAt} title={new Date(chat.updatedAt).toLocaleString()}>{relativeTime(chat.updatedAt)}</time></Button></li>)}</ul>
          : <div className="pd-empty pd-empty--chats"><img src={detailArt.emptyChats} alt="" /><p>Ask a question, explore an idea, or get help with your work.</p></div>}
      </section>
      <section id="pd-panel-artifacts" role="tabpanel" aria-labelledby="pd-tab-artifacts" className="pd-panel" hidden={tab !== 'artifacts'}>
        {artifacts.length ? <ul className="pd-artifact-grid">{artifacts.map(artifact => <li key={artifact.id}><Button className="pd-artifact-card" onClick={() => setPreview(artifact)} aria-label={`Preview ${artifact.title}`}><img src={projectFileArt[artifact.kind]} alt="" /><span><strong>{artifact.title}</strong><span>{artifact.category}</span></span></Button></li>)}</ul>
          : <div className="pd-empty pd-empty--artifacts"><img src={detailArt.emptyArtifacts} alt="" /><p>Your notes, drafts, study guides, and other creations will live here.</p></div>}
      </section>
      <section id="pd-panel-knowledge" role="tabpanel" aria-labelledby="pd-tab-knowledge" className="pd-panel" hidden={tab !== 'knowledge'}><ProjectKnowledge project={project} chooser={fileChooser} onAdd={onAddFiles} onRemove={onRemoveFile} onSelect={() => setTab('knowledge')} /></section>
      <section id="pd-panel-instruction" role="tabpanel" aria-labelledby="pd-tab-instruction" className="pd-panel" hidden={tab !== 'instruction'}>
        <form className="pd-instruction-form" onSubmit={async event => {
          event.preventDefault(); setSaving(true); setInstructionError(''); setInstructionStatus('');
          try { await onSaveInstructions(instructions.trim()); setInstructionStatus('Instructions saved locally. No model is connected.'); }
          catch { setInstructionError('Instructions could not be saved. Your text is still here; please try again.'); }
          finally { setSaving(false); }
        }}>
          <div className="pd-instruction-wrap"><label className="oc-sr-only" htmlFor="pd-instructions">Project instructions</label><textarea id="pd-instructions" value={instructions} maxLength={instructionLimit} placeholder="Tell AI how you'd like it to help, respond, and work with you." aria-describedby="pd-instruction-count" onChange={event => { setInstructions(event.target.value); setInstructionStatus(''); }} /><span id="pd-instruction-count">{instructions.length}/{instructionLimit}</span></div>
          <div className="pd-instruction-actions"><Button variant="default" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></div><Feedback message={instructionError} tone="error" /><Feedback message={instructionStatus} tone="success" />
        </form>
      </section>
      <section id="pd-panel-memory" role="tabpanel" aria-labelledby="pd-tab-memory" className="pd-panel" hidden={tab !== 'memory'}><div className="pd-memory"><h2>No project memory</h2><p>Automatic memory is not connected in this prototype. Use Instruction to keep project context nearby.</p></div></section>
    </div>
    {modelOpen && <Dialog title="Chat model" className="oc-model-dialog" onClose={() => setModelOpen(false)}><Button className="oc-model-option" onClick={() => setModelOpen(false)}><Asset src={assets.model} /><span>GPT 5.1</span><Check size={18} /><span className="oc-sr-only">Selected</span></Button><p>Model selection is simulated. No AI service is connected.</p></Dialog>}
    {preview && <Dialog title={preview.title} className="pj-dialog" onClose={() => setPreview(null)}><p>{preview.summary}</p><p>Local sample preview. The original artifact contents are not included; no file is generated or downloaded.</p></Dialog>}
  </>;
}
