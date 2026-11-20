import { Input } from '../../components/ui/input';
import { NativeSelect } from '../../components/ui/native-select';
import { Textarea } from '../../components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { Bell, Menu } from '../../components/ui/solar-icons';
import { Button, buttonVariants } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { ToggleButtonGroup } from '../../components/ui/toggle-button-group';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Switch } from '../../components/ui/switch';
import * as SolarIcons from '../../components/ui/solar-icons';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/ChatShell';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { appIconGroups, iconAssetUrl, needsDarkPreview, type AppIcon } from './icon-data';
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

function iconPreview(icon: AppIcon) {
  switch (icon.composite) {
    case 'chats':
      return <span className="oc-chats-icon"><img className="oc-asset oc-chat-back" src={iconAssetUrl('onechat/1-vector.svg')} alt="" /><img className="oc-asset oc-chat-front" src={iconAssetUrl('onechat/1-vector1.svg')} alt="" /><img className="oc-asset oc-chat-dots" src={iconAssetUrl('onechat/1-vector2.svg')} alt="" /></span>;
    case 'phi':
      return <span className="oc-phi-icon"><img src={iconAssetUrl('onechat/phi-shield.svg')} alt="" className="oc-phi-shield" /><img src={iconAssetUrl('onechat/phi-h.svg')} alt="" className="oc-phi-h" /><img src={iconAssetUrl('onechat/phi-line.svg')} alt="" className="oc-phi-line" /></span>;
    case 'model':
      return <span className="ul-composite-model"><img className="ul-model-border" src={iconAssetUrl('management/instance-settings/model-border.svg')} alt="" /><img className="ul-model-core" src={iconAssetUrl('management/instance-settings/model-core.svg')} alt="" />{[0, 1, 2, 3].map(index => <span className={`ul-model-pin ul-model-pin--${index}`} key={index}><img src={iconAssetUrl('management/instance-settings/model-line-h.svg')} alt="" /><img src={iconAssetUrl('management/instance-settings/model-line-h.svg')} alt="" /><img src={iconAssetUrl('management/instance-settings/model-line-v1.svg')} alt="" /><img src={iconAssetUrl('management/instance-settings/model-line-v2.svg')} alt="" /></span>)}</span>;
    case 'research-file':
      return <span className="ul-composite-file ul-composite-research"><img src={iconAssetUrl('courses/psy201/figma/card-research-base.svg')} alt="" /><img src={iconAssetUrl('courses/psy201/figma/card-research-mark.svg')} alt="" /></span>;
    case 'markdown-file':
      return <span className="ul-composite-file ul-composite-markdown"><img src={iconAssetUrl('courses/psy201/figma/card-md-base.svg')} alt="" /><img src={iconAssetUrl('courses/psy201/figma/card-md-mark.svg')} alt="" /></span>;
    case 'slides-file':
      return <span className="ul-composite-file ul-composite-slides"><img src={iconAssetUrl('courses/psy201/figma/card-slides-base.svg')} alt="" /><img src={iconAssetUrl('courses/psy201/figma/card-slides-mark.svg')} alt="" /></span>;
    case 'microsoft':
      return <svg width="21" height="21" viewBox="0 0 21 21" aria-hidden="true"><path fill="#f25022" d="M0 0h10v10H0z" /><path fill="#7fba00" d="M11 0h10v10H11z" /><path fill="#00a4ef" d="M0 11h10v10H0z" /><path fill="#ffb900" d="M11 11h10v10H11z" /></svg>;
    case 'voice':
      return <span className="ul-composite-voice"><img src={iconAssetUrl('onechat/0-chat-cta.svg')} alt="" /><img src={iconAssetUrl('onechat/0-icons-generic-soundwave.svg')} alt="" /></span>;
    case 'course-voice':
      return <span className="ul-composite-voice"><img src={iconAssetUrl('onechat/course-chat-cta.svg')} alt="" /><img src={iconAssetUrl('onechat/course-soundwave.svg')} alt="" /></span>;
    default:
      return <img src={icon.src} alt="" />;
  }
}
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
  const [sampleSelect, setSampleSelect] = useState('standard');
  const [sampleDescription, setSampleDescription] = useState('');
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
          <div className="ul-subsection"><h3>Text input</h3><div className="ul-form-samples"><label htmlFor="ul-sample-input">Text field</label><Input id="ul-sample-input" value={sampleText} onChange={event => setSampleText(event.target.value)} placeholder="Type to preview the field" /></div></div>
          <div className="ul-subsection"><h3>Select</h3><div className="ul-form-samples"><label htmlFor="ul-sample-select">Display density</label><NativeSelect id="ul-sample-select" value={sampleSelect} onChange={event => setSampleSelect(event.target.value)}><option value="standard">Standard</option><option value="compact">Compact</option></NativeSelect></div></div>
          <div className="ul-subsection"><h3>Textarea</h3><div className="ul-form-samples"><label htmlFor="ul-sample-description">Description</label><Textarea id="ul-sample-description" value={sampleDescription} onChange={event => setSampleDescription(event.target.value)} placeholder="Add a short description" /></div></div>
          <div className="ul-subsection"><h3>Checkboxes</h3><fieldset className="ul-choice-group"><legend>Select any that apply</legend><div className="ul-choice"><Checkbox id="ul-email-updates" checked={checked} onCheckedChange={value => setChecked(value === true)} /><label htmlFor="ul-email-updates">Email updates</label></div><div className="ul-choice"><Checkbox id="ul-product-announcements" checked={secondChecked} onCheckedChange={value => setSecondChecked(value === true)} /><label htmlFor="ul-product-announcements">Product announcements</label></div></fieldset></div>
          <div className="ul-subsection"><h3>Radio buttons</h3><fieldset className="ul-choice-group"><legend id="ul-density-legend">Density preference</legend><RadioGroup className="gap-1" aria-labelledby="ul-density-legend" value={radioChoice} onValueChange={value => setRadioChoice(value as typeof radioChoice)}><div className="ul-choice"><RadioGroupItem id="ul-density-standard" value="standard" /><label htmlFor="ul-density-standard">Standard</label></div><div className="ul-choice"><RadioGroupItem id="ul-density-compact" value="compact" /><label htmlFor="ul-density-compact">Compact</label></div></RadioGroup></fieldset></div>
          <div className="ul-subsection"><h3>Switch</h3><div className="ul-subsection-content"><div className="ul-switch-example"><label htmlFor="ul-notifications">Enable notifications</label><Switch id="ul-notifications" checked={switchOn} onCheckedChange={setSwitchOn} /></div><p className="ul-component-note">Switch · {switchOn ? 'on' : 'off'}</p></div></div>
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
          <p className="ul-icon-description">Icons used across the prototype. Original artwork is shown unchanged.</p>
          <h3 className="ul-icon-group-heading">Solar UI icons</h3>
          <div className="ul-icon-grid">{Object.entries(SolarIcons).map(([name, Icon]) => <div className="ul-icon-example" key={name}><Icon size={24} /><span>{name}</span></div>)}</div>
          {appIconGroups.map((group, index) => <section className="ul-icon-section" aria-labelledby={`ul-icon-group-${index}`} key={group.title}>
            <h3 id={`ul-icon-group-${index}`}>{group.title} <span>{group.icons.length}</span></h3>
            <div className="ul-app-icon-grid">{group.icons.map(icon => <div className="ul-app-icon-example" key={icon.source} title={icon.source}>
              <span className={`ul-app-icon-preview ${needsDarkPreview(icon.source) ? 'ul-app-icon-preview--dark' : ''}`} aria-hidden="true">{iconPreview(icon)}</span><span>{icon.label}</span>
            </div>)}</div>
          </section>)}
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
