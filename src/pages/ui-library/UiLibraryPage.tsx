import { Input } from '../../components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { Bell, Menu } from '../../components/ui/solar-icons';
import { Button, buttonVariants } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { ToggleButtonGroup } from '../../components/ui/toggle-button-group';
import * as SolarIcons from '../../components/ui/solar-icons';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/ChatShell';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import './ui-library.css';

const colors = [
  { name: 'Primary', value: '#4759A7', text: '#fff' },
  { name: 'Accent', value: '#37C5F0', text: '#161C24' },
  { name: 'Text', value: '#161C24', text: '#fff' },
  { name: 'Muted text', value: '#637381', text: '#fff' },
  { name: 'Surface subtle', value: '#F9FAFB', text: '#161C24' },
  { name: 'Border', value: '#DFE2E8', text: '#161C24' },
  { name: 'Success', value: '#0F913B', text: '#fff' },
  { name: 'Warning', value: '#E88310', text: '#161C24' },
  { name: 'Error', value: '#D82934', text: '#fff' },
] as const;
const categories = ['foundations', 'components', 'icons'] as const;
type Category = (typeof categories)[number];
const messageTones = ['info', 'success', 'warning', 'error'] as const;
const messageCopy = {
  info: 'A new course space is ready to review.',
  success: 'Your changes have been saved.',
  warning: 'This course has unpublished changes.',
  error: 'The file could not be added. Try again.',
} as const;

export function UiLibraryPage() {
  const notifications = useNotifications();
  const navigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sampleText, setSampleText] = useState('');
  const [checked, setChecked] = useState(true);
  const [secondChecked, setSecondChecked] = useState(false);
  const [radioChoice, setRadioChoice] = useState<'standard' | 'compact'>('standard');
  const [switchOn, setSwitchOn] = useState(true);
  const [sampleTab, setSampleTab] = useState<'Overview' | 'Activity' | 'Settings'>('Overview');
  const [view, setView] = useState<'Preview' | 'Code' | 'Details' | 'Unavailable'>('Preview');
  const [toastVisible, setToastVisible] = useState(false);
  const [dismissedMessages, setDismissedMessages] = useState<string[]>([]);
  const [messageActionStatus, setMessageActionStatus] = useState('');
  const [dialogVariant, setDialogVariant] = useState<'visible' | 'hidden' | null>(null);
  const [category, setCategory] = useState<Category>('foundations');
  const categoryTabs = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.title;
    document.title = 'UI Library · Aqua University';
    return () => { document.title = previous; };
  }, []);

  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: () => {}, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const dismissMessage = (id: string) => setDismissedMessages(items => [...items, id]);
  const resetMessages = () => { setDismissedMessages([]); setMessageActionStatus(''); };
  const reviewMessage = (id: string, tone: string) => { setMessageActionStatus(`${tone[0].toUpperCase() + tone.slice(1)} message reviewed in this preview.`); dismissMessage(id); };

  return <div className={`onechat ui-library-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#ul-main" onClick={event => { event.preventDefault(); document.getElementById('ul-main')?.focus(); }}>Skip to UI Library</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <main className="oc-main ul-main" id="ul-main" tabIndex={-1}>
      <div className="ul-toolbar">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="ul-content">
        <header className="ul-heading"><h1>UI Library</h1><p>ONEdesign foundations and interface components used in this prototype.</p></header>
        <div className="ul-tabs" ref={categoryTabs} role="tablist" aria-label="UI Library categories" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const index = categories.indexOf(category);
          const next = event.key === 'Home' ? categories[0] : event.key === 'End' ? categories[categories.length - 1] : categories[(index + (event.key === 'ArrowRight' ? 1 : categories.length - 1)) % categories.length];
          setCategory(next);
          categoryTabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
        }}>
          {categories.map(item => <Button key={item} data-tab={item} role="tab" id={`ul-tab-${item}`} aria-selected={category === item} aria-controls="ul-category-panel" tabIndex={category === item ? 0 : -1} onClick={() => setCategory(item)}>{item[0].toUpperCase() + item.slice(1)}</Button>)}
        </div>
        <div className="ul-tab-panel" id="ul-category-panel" role="tabpanel" aria-labelledby={`ul-tab-${category}`} tabIndex={0}>
        {category === 'foundations' && <section className="ul-section" id="ul-foundations" aria-labelledby="ul-foundations-heading">
          <h2 id="ul-foundations-heading">Foundations</h2>
          <div className="ul-subsection"><h3>Color</h3><div className="ul-color-grid">{colors.map(color => <div className="ul-color" key={color.name}><div className="ul-swatch" style={{ backgroundColor: color.value, color: color.text }}><span>{color.value}</span></div><span>{color.name}</span></div>)}</div></div>
          <div className="ul-subsection"><h3>Typography</h3><div className="ul-type-samples"><p className="ul-type-heading">Make useful work feel clear.</p><p className="ul-type-body">Body text gives people the detail they need to understand a task and choose what to do next.</p><p className="ul-type-small">Supporting text · 14px / 22px</p><p className="ul-type-caption">Caption · 12px / 18px</p></div></div>
          <div className="ul-subsection"><h3>Spacing</h3><div className="ul-spacing-list">{[4, 8, 12, 16, 24, 32, 48].map(size => <div key={size}><span>{size}px</span><span className="ul-spacing-bar" style={{ width: `${size * 2}px` }} /></div>)}</div></div>
        </section>}

        {category === 'components' && <section className="ul-section" id="ul-components" aria-labelledby="ul-components-heading">
          <h2 id="ul-components-heading">Components</h2>
          <div className="ul-subsection"><h3>Button</h3><div className="ul-subsection-content"><div className="ul-button-matrix" aria-label="Button appearance variants by size">
            <div className="ul-button-matrix-row"><span className="ul-component-label">Default · 44px</span><Button variant="default">Primary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button></div>
            <div className="ul-button-matrix-row"><span className="ul-component-label">Large · 48px</span><Button variant="default" size="large">Primary</Button><Button variant="outline" size="large">Outline</Button><Button variant="ghost" size="large">Ghost</Button></div>
            <div className="ul-button-matrix-row"><span className="ul-component-label">Medium · 36px</span><Button variant="default" size="medium">Primary</Button><Button variant="outline" size="medium">Outline</Button><Button variant="ghost" size="medium">Ghost</Button></div>
            <div className="ul-button-matrix-row"><span className="ul-component-label">Small · 30px</span><Button variant="default" size="small">Primary</Button><Button variant="outline" size="small">Outline</Button><Button variant="ghost" size="small">Ghost</Button></div>
            <div className="ul-button-matrix-row"><span className="ul-component-label">Icon · 44px</span><Button variant="default" size="icon" aria-label="Add item"><SolarIcons.Plus size={20} /></Button><Button variant="outline" size="icon" aria-label="Search"><SolarIcons.Search size={20} /></Button><Button variant="ghost" size="icon" aria-label="More options"><SolarIcons.MoreHorizontal size={20} /></Button></div>
            <div className="ul-button-matrix-row"><span className="ul-component-label">Disabled</span><Button variant="default" disabled>Primary</Button><Button variant="outline" disabled>Outline</Button><Button variant="ghost" disabled>Ghost</Button></div>
          </div><p className="ul-component-note">Compact sizes retain an expanded 44px touch target.</p></div></div>
          <div className="ul-subsection"><h3>Tabs</h3><div className="ul-subsection-content"><Tabs className="ul-example-tabs-root" value={sampleTab} onValueChange={value => setSampleTab(value as typeof sampleTab)}>
            <TabsList className="ul-example-tabs" aria-label="Example content">{(['Overview', 'Activity', 'Settings'] as const).map(tab => <TabsTrigger key={tab} value={tab} className={buttonVariants()}>{tab}</TabsTrigger>)}</TabsList>
            {(['Overview', 'Activity', 'Settings'] as const).map(tab => <TabsContent key={tab} value={tab} className="ul-example-tab-panel"><p>{tab} panel content</p></TabsContent>)}
          </Tabs><p className="ul-component-note">Tabs · selected state, panel association, and arrow-key navigation</p></div></div>
          <div className="ul-subsection"><h3>Toggle button group</h3><div className="ul-subsection-content"><ToggleButtonGroup ariaLabel="Preview display mode" options={[{ value: 'Preview', label: 'Preview' }, { value: 'Code', label: 'Code' }, { value: 'Details', label: 'Details' }, { value: 'Unavailable', label: 'Unavailable', disabled: true }]} value={view} onValueChange={setView} /><p className="ul-component-note">Selected: {view} · final option shows disabled state</p></div></div>
          <div className="ul-subsection"><h3>Text input</h3><div className="ul-form-samples"><label htmlFor="ul-sample-input">Text field</label><Input unstyled id="ul-sample-input" value={sampleText} onChange={event => setSampleText(event.target.value)} placeholder="Type to preview the field" /></div></div>
          <div className="ul-subsection"><h3>Checkboxes</h3><fieldset className="ul-choice-group"><legend>Select any that apply</legend><label className="ul-choice"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} /><span>Email updates</span></label><label className="ul-choice"><input type="checkbox" checked={secondChecked} onChange={event => setSecondChecked(event.target.checked)} /><span>Product announcements</span></label></fieldset></div>
          <div className="ul-subsection"><h3>Radio buttons</h3><fieldset className="ul-choice-group"><legend>Density preference</legend><label className="ul-choice"><input type="radio" name="ul-density" value="standard" checked={radioChoice === 'standard'} onChange={() => setRadioChoice('standard')} /><span>Standard</span></label><label className="ul-choice"><input type="radio" name="ul-density" value="compact" checked={radioChoice === 'compact'} onChange={() => setRadioChoice('compact')} /><span>Compact</span></label></fieldset></div>
          <div className="ul-subsection"><h3>Switch</h3><div className="ul-subsection-content"><div className="ul-switch-example"><span id="ul-switch-label">Enable notifications</span><Button className="ul-switch" role="switch" aria-labelledby="ul-switch-label" aria-checked={switchOn} onClick={() => setSwitchOn(value => !value)}><span className="ul-switch-track"><span className="ul-switch-thumb" /></span></Button></div><p className="ul-component-note">Switch · {switchOn ? 'on' : 'off'}</p></div></div>
          <div className="ul-subsection"><h3>Feedback</h3><div className="ul-subsection-content"><div className="ul-feedback-examples">{[
            { tone: 'info', message: 'This is an informational message.' },
            { tone: 'success', message: 'Your changes have been saved.' },
            { tone: 'error', message: 'Check the field and try again.' },
            { tone: 'loading', message: 'Working on your request…' },
          ].map(item => <div className="ul-feedback-example" key={item.tone}><span className="ul-component-label">{item.tone}</span><Feedback message={item.message} tone={item.tone as 'info' | 'success' | 'error' | 'loading'} /></div>)}</div><Button variant="outline" onClick={() => setToastVisible(true)}>Show toast variant</Button><p className="ul-component-note">Inline feedback and toast presentation · dismiss the toast with its close button.</p></div></div>
          <div className="ul-subsection"><h3>Messages</h3><div className="ul-subsection-content ul-message-examples">
            <p className="ul-component-note">Snackbar, alert, and banner treatments from ONEdesign. Dismiss a sample or use its action to preview the interaction.</p>
            <div className="ul-message-group"><h4>Snackbar</h4><div className="ul-snackbar-grid">{messageTones.map(tone => {
              const id = `snackbar-${tone}`;
              return !dismissedMessages.includes(id) && <Feedback key={id} appearance="snackbar" tone={tone} message={messageCopy[tone]} actionLabel="Review" onAction={() => reviewMessage(id, tone)} onDismiss={() => dismissMessage(id)} />;
            })}</div></div>
            <div className="ul-message-group"><h4>Alert</h4><div className="ul-message-stack">{messageTones.map(tone => {
              const id = `alert-${tone}`;
              return !dismissedMessages.includes(id) && <Feedback key={id} appearance="alert" tone={tone} message={`${tone[0].toUpperCase() + tone.slice(1)}: ${messageCopy[tone]}`} onDismiss={() => dismissMessage(id)} />;
            })}</div></div>
            <div className="ul-message-group"><h4>Banner</h4><div className="ul-message-stack">{messageTones.map(tone => {
              const id = `banner-${tone}`;
              return !dismissedMessages.includes(id) && <Feedback key={id} appearance="banner" tone={tone} message={`${tone[0].toUpperCase() + tone.slice(1)}: ${messageCopy[tone]}`} actionLabel="Review" onAction={() => reviewMessage(id, tone)} onDismiss={() => dismissMessage(id)} />;
            })}</div></div>
            {messageActionStatus && <p className="ul-message-action-status" role="status">{messageActionStatus}</p>}
            <Button variant="outline" onClick={resetMessages}>Restore message samples</Button>
          </div></div>
          <div className="ul-subsection"><h3>Dialog</h3><div className="ul-subsection-content"><div className="ul-button-row"><Button variant="outline" onClick={() => setDialogVariant('visible')}>Visible heading</Button><Button variant="outline" onClick={() => setDialogVariant('hidden')}>Visually hidden heading</Button></div><p className="ul-component-note">Both variants retain an accessible dialog name.</p></div></div>
        </section>}
        {category === 'icons' && <section className="ul-section" id="ul-icons" aria-labelledby="ul-icons-heading">
          <h2 id="ul-icons-heading">Icons</h2>
          <p className="ul-icon-description">Solar line icons available in the application.</p>
          <div className="ul-icon-grid">{Object.entries(SolarIcons).map(([name, Icon]) => <div className="ul-icon-example" key={name}><Icon size={20} /><span>{name}</span></div>)}</div>
        </section>}
        </div>
        <p className="ul-note">Examples use local interface styles. Actions on this page are previews and do not change account data.</p>
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {dialogVariant === 'visible' && <Dialog title="Dialog example" onClose={() => setDialogVariant(null)}><p>This is the existing dialog component. It supports Escape, focus containment, and returning focus to its trigger.</p><div className="ul-dialog-actions"><Button variant="default" onClick={() => setDialogVariant(null)}>Close dialog</Button></div></Dialog>}
    {dialogVariant === 'hidden' && <Dialog title="Dialog example with a visually hidden heading" hideHeading onClose={() => setDialogVariant(null)}><p>The heading is visually hidden while the dialog keeps its accessible name.</p><div className="ul-dialog-actions"><Button variant="default" onClick={() => setDialogVariant(null)}>Close dialog</Button></div></Dialog>}
    {toastVisible && <Feedback message="Toast feedback is visible." tone="success" toast onDismiss={() => setToastVisible(false)} />}
  </div>;
}
