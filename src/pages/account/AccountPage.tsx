import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Bell, Menu } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import userIcon from '../../assets/account/user.svg';
import shieldIcon from '../../assets/account/shield.svg';
import memoryIcon from '../../assets/account/memory.svg';
import skillsIcon from '../../assets/account/skills.svg';
import connectorsIcon from '../../assets/account/connectors.svg';
import apiIcon from '../../assets/account/api.svg';
import keyIcon from '../../assets/account/key.svg';
import settingsIcon from '../../assets/account/settings.svg';
import emptySkills from '../../assets/account/empty-skills.svg';
import './account.css';

const sections = [
  { id: 'profile', label: 'Profile', icon: userIcon },
  { id: 'privacy', label: 'Privacy & Security', icon: shieldIcon },
  { id: 'memory', label: 'Memory', icon: memoryIcon },
  { id: 'skills', label: 'Skills', icon: skillsIcon },
  { id: 'connectors', label: 'Connectors', icon: connectorsIcon },
  { id: 'api', label: 'API Projects', icon: apiIcon },
  { id: 'tokens', label: 'Access Tokens', icon: keyIcon },
  { id: 'general', label: 'General Settings', icon: settingsIcon },
] as const;

type SectionId = (typeof sections)[number]['id'];
type Skill = { id: string; name: string; instructions: string };

function SkillEditor({ skill, onSave, onClose }: { skill?: Skill; onSave: (name: string, instructions: string) => void; onClose: () => void }) {
  const [name, setName] = useState(skill?.name ?? '');
  const [instructions, setInstructions] = useState(skill?.instructions ?? '');
  const [errors, setErrors] = useState({ name: '', instructions: '' });
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = { name: name.trim() ? '' : 'Enter a skill name.', instructions: instructions.trim() ? '' : 'Describe what the skill should do.' };
    setErrors(next);
    if (next.name) { nameRef.current?.focus(); return; }
    if (next.instructions) { instructionsRef.current?.focus(); return; }
    onSave(name.trim(), instructions.trim());
  };
  return <Dialog title={skill ? 'Edit skill' : 'Create a skill'} onClose={onClose} className="ua-editor">
    {close => <form onSubmit={submit} noValidate>
      <p>This local demo keeps skills only until you leave the page. No AI service is connected.</p>
      <label htmlFor={`${id}-name`}>Skill name <span>Required</span></label>
      <input autoFocus ref={nameRef} id={`${id}-name`} value={name} maxLength={60} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} onChange={event => { setName(event.target.value); setErrors(value => ({ ...value, name: '' })); }} />
      <Feedback id={`${id}-name-error`} message={errors.name} tone="error" />
      <label htmlFor={`${id}-instructions`}>Instructions <span>Required</span></label>
      <textarea ref={instructionsRef} id={`${id}-instructions`} value={instructions} maxLength={1000} rows={5} aria-invalid={Boolean(errors.instructions)} aria-describedby={errors.instructions ? `${id}-instructions-error` : undefined} onChange={event => { setInstructions(event.target.value); setErrors(value => ({ ...value, instructions: '' })); }} />
      <Feedback id={`${id}-instructions-error`} message={errors.instructions} tone="error" />
      <div className="ua-editor-actions"><Button variant="outline" onClick={close}>Cancel</Button><Button variant="default" type="submit">{skill ? 'Save changes' : 'Create skill'}</Button></div>
    </form>}
  </Dialog>;
}

export function AccountPage() {
  const notifications = useNotifications();
  const navigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState<SectionId>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editor, setEditor] = useState<{ skill?: Skill } | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    const previous = document.title;
    document.title = 'My Skills · Aqua University';
    return () => { document.title = previous; };
  }, []);
  useEffect(() => { document.title = `${section === 'skills' ? 'My Skills' : sections.find(item => item.id === section)?.label} · Aqua University`; }, [section]);

  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const currentSection = sections.find(item => item.id === section)!;
  const saveSkill = (name: string, instructions: string) => {
    if (editor?.skill) setSkills(items => items.map(item => item.id === editor.skill?.id ? { ...item, name, instructions } : item));
    else setSkills(items => [...items, { id: crypto.randomUUID(), name, instructions }]);
    setStatus(`${name} ${editor?.skill ? 'updated' : 'created'} in this page session.`);
    setEditor(null);
  };

  return <div className={`onechat account-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#ua-main" onClick={event => { event.preventDefault(); document.getElementById('ua-main')?.focus(); }}>Skip to account</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <main className="oc-main ua-main" id="ua-main" tabIndex={-1}>
      <div className="ua-responsive-toolbar">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="ua-card">
        <nav className="ua-sections" aria-label="Account sections">
          {sections.map(item => <Button key={item.id} className="ua-section-button" aria-current={section === item.id ? 'page' : undefined} onClick={() => { setSection(item.id); setStatus(''); }}><img src={item.icon} alt="" width="20" height="20" /><span>{item.label}</span></Button>)}
        </nav>
        <section className="ua-content" aria-labelledby="ua-heading">
          <header className="ua-heading">
            <h1 id="ua-heading">{section === 'skills' ? 'My Skills' : currentSection.label}</h1>
            {section === 'skills' && <p>Personal AI skills empower you to build custom AI-driven behaviors tailored to your workflow. Define how the AI responds and what tasks it automates.</p>}
          </header>
          {section === 'skills' ? skills.length ? <div className="ua-skill-list" aria-label="My skills">{skills.map(skill => <article className="ua-skill-card" key={skill.id}>
            <h2>{skill.name}</h2><p>{skill.instructions}</p><div><Button variant="outline" onClick={() => setEditor({ skill })}>Edit</Button><Button variant="outline" onClick={() => { setSkills(items => items.filter(item => item.id !== skill.id)); setStatus(`${skill.name} removed from this page session.`); }}>Remove</Button></div>
          </article>)}<Button variant="default" onClick={() => setEditor({})}>Create a skill</Button></div> : <div className="ua-empty">
            <img src={emptySkills} alt="" width="150" height="146" />
            <p>Get started by creating your first skill to fit your needs and bring your ideas to life.</p>
            <Button variant="default" onClick={() => setEditor({})}>Create a skill</Button>
          </div> : <div className="ua-placeholder"><h2>{currentSection.label} preview</h2><p>This account section is not included in the local prototype. No account service is connected.</p></div>}
        </section>
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {editor && <SkillEditor skill={editor.skill} onSave={saveSkill} onClose={() => setEditor(null)} />}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
    <Feedback message={status} tone="success" toast onDismiss={() => setStatus('')} />
  </div>;
}
