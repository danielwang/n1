import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import { BrandingSettings } from './BrandingSettings';
import { instanceSettingsNav, instanceSettingsNavGroups, defaultInstanceSettings, instanceSettingsStorageKey, loadInstanceSettings, type InstanceSettings } from './instance-settings-data';
import nebula from '../../assets/management/instance-settings/nebula.svg';
import nebulaDot from '../../assets/management/instance-settings/nebula-dot.svg';
import modelCore from '../../assets/management/instance-settings/model-core.svg';
import modelBorder from '../../assets/management/instance-settings/model-border.svg';
import modelLineH from '../../assets/management/instance-settings/model-line-h.svg';
import modelLineV1 from '../../assets/management/instance-settings/model-line-v1.svg';
import modelLineV2 from '../../assets/management/instance-settings/model-line-v2.svg';
import infoIcon from '../../assets/management/instance-settings/info.svg';
import switchOff from '../../assets/management/instance-settings/switch-off.svg';
import switchThumb from '../../assets/management/instance-settings/switch-thumb.svg';
import switchTick from '../../assets/management/instance-settings/switch-tick.svg';
import './instance-settings.css';

const tabs = ['General Setting', 'Model Availability', 'Agentic Collaboration (2)'] as const;
type SettingsTab = (typeof tabs)[number];
type FeatureKey = 'onechat' | 'deepResearch' | 'imageCreation' | 'webSearch' | 'codeInterpreter';

const features: { key: FeatureKey; title: string; description: string }[] = [
  { key: 'deepResearch', title: 'Enable Deep Research', description: 'Allow users to run Deep Research in ONEchat.' },
  { key: 'imageCreation', title: 'Enable Image Creation', description: 'Allow users to create images in ONEchat' },
  { key: 'webSearch', title: 'Enable Web Search', description: 'Allow users to search the web in ONEchat' },
  { key: 'codeInterpreter', title: 'Enable Code Interpreter', description: 'Allow users to use code interpreter (e.g. generate visualizations with data) in ONEchat' },
];

function ModelIcon() {
  return <span className="mis-model-icon" aria-hidden="true">
    <img className="mis-model-border" src={modelBorder} alt="" />
    <img className="mis-model-core" src={modelCore} alt="" />
    {[0, 1, 2, 3].map(index => <span className={`mis-model-pin mis-model-pin--${index}`} key={index}>
      <img src={modelLineH} alt="" /><img src={modelLineH} alt="" />
      <img src={modelLineV1} alt="" /><img src={modelLineV2} alt="" />
    </span>)}
  </span>;
}

function FeatureSwitch({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void }) {
  return <Button className="mis-switch-button" role="switch" aria-checked={checked} aria-labelledby={id} onClick={onChange}>
    {checked ? <span className="mis-switch-on"><img src={switchThumb} alt="" /><img src={switchTick} alt="" /></span> : <img className="mis-switch-off" src={switchOff} alt="" />}
  </Button>;
}

export function InstanceSettingsPage() {
  const [saved, setSaved] = useState(loadInstanceSettings);
  const [draft, setDraft] = useState<InstanceSettings>(saved);
  const [section, setSection] = useState<(typeof instanceSettingsNav)[number]['id'] | 'nebulaone'>('onechat');
  const [tab, setTab] = useState<SettingsTab>('General Setting');
  const [nameHelp, setNameHelp] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof InstanceSettings>(key: K, value: InstanceSettings[K]) => {
    setDraft(current => ({ ...current, [key]: value }));
    setStatus('');
    if (key === 'customName') setError('');
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const customName = draft.customName.trim();
    if (!customName) { setError('Enter a custom name.'); nameRef.current?.focus(); return; }
    const next = { ...draft, customName };
    try {
      localStorage.setItem(instanceSettingsStorageKey, JSON.stringify(next));
      setSaved(next);
      setDraft(next);
      setStatus('Settings saved in this browser. No live organisation settings were changed.');
      setError('');
    } catch {
      setStatus('This browser could not save the settings. Your changes remain on this page.');
    }
  };
  const reset = () => {
    setDraft({ ...defaultInstanceSettings });
    setError('');
    setStatus('Default settings restored in this draft. Choose Save to keep them in this browser.');
  };
  const selected = instanceSettingsNav.find(item => item.id === section);

  return <div className="mis-page">
    <header className="mis-page-header">
      <h1>Instance Settings</h1>
      <p>Configure organisation-wide settings and preferences that determine how your nebulaONE environment is set up and operates.</p>
    </header>
    <div className="mis-card">
      <nav className="mis-side-nav" aria-label="Instance settings sections">
        <div className="mis-side-nav-items">
          {instanceSettingsNavGroups.map(group => <div className="mis-side-nav-group" key={group.label}>
            <h2 className="mis-side-nav-heading">{group.label}</h2>
            <div className="mis-side-nav-group-items">{group.items.map(item => <Button key={item.id} className="mis-side-nav-item" aria-current={section === item.id ? 'page' : undefined} onClick={() => { setSection(item.id); setStatus(''); }}>
            {item.id === 'models' ? <ModelIcon /> : <span className="mis-nav-icon"><img src={item.icon!} alt="" /></span>}
            <span>{item.label}</span>
            </Button>)}</div>
          </div>)}
        </div>
        <div className="mis-side-nav-brand">
          <Button className="mis-side-nav-item" aria-current={section === 'nebulaone' ? 'page' : undefined} onClick={() => { setSection('nebulaone'); setStatus(''); }}><span className="mis-nebula-icon"><img src={nebula} alt="" /><img src={nebulaDot} alt="" /></span><span>nebulaONE</span></Button>
        </div>
      </nav>
      <div className="mis-content">
        {section === 'onechat' ? <>
          <h2>ONEchat</h2>
          <div className="mis-tabs" role="tablist" aria-label="ONEchat settings">
            {tabs.map((name, index) => <Button key={name} id={`mis-tab-${index}`} role="tab" aria-controls="mis-tab-panel" aria-selected={tab === name} tabIndex={tab === name ? 0 : -1} onClick={() => setTab(name)} onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
              setTab(tabs[next]);
              document.getElementById(`mis-tab-${next}`)?.focus();
            }}>{name}</Button>)}
          </div>
          <div id="mis-tab-panel" role="tabpanel" aria-labelledby={`mis-tab-${tabs.indexOf(tab)}`} className="mis-tab-panel">
            {tab === 'General Setting' ? <form className="mis-form" onSubmit={save} noValidate>
              <div className="mis-form-fields">
                <div className="mis-feature mis-feature-intro"><div><h3 id="mis-feature-onechat">ONEchat</h3><p>A streamlined interface that becomes the landing page for all users. ONEchat includes file handling, image generation, and web search capabilities, plus access to AI models you select.</p></div><FeatureSwitch id="mis-feature-onechat" checked={draft.onechat} onChange={() => update('onechat', !draft.onechat)} /></div>
                <div className="mis-name-group">
                  <div className="mis-name-heading"><label htmlFor="mis-custom-name">Customize ONEchat Name</label><Button size="icon" aria-label="About custom name" aria-expanded={nameHelp} onClick={() => setNameHelp(value => !value)}><img src={infoIcon} alt="" /></Button></div>
                  {nameHelp && <p className="mis-name-help">This name is shown as the ONEchat label in this local demo.</p>}
                  <div className="mis-name-input"><span>Custom Name</span><input ref={nameRef} id="mis-custom-name" value={draft.customName} maxLength={40} aria-invalid={Boolean(error)} aria-describedby={error ? 'mis-name-error' : undefined} onChange={event => update('customName', event.target.value)} /></div>
                  {error && <p id="mis-name-error" className="mis-error">{error}</p>}
                </div>
                {features.map(feature => <div className="mis-feature" key={feature.key}><div><h3 id={`mis-feature-${feature.key}`}>{feature.title}</h3><p>{feature.description}</p></div><FeatureSwitch id={`mis-feature-${feature.key}`} checked={draft[feature.key]} onChange={() => update(feature.key, !draft[feature.key])} /></div>)}
              </div>
              <div className="mis-form-footer"><Button className="mis-reset" onClick={reset}>Reset</Button><div className="mis-save-group"><p role="status" aria-live="polite">{status}</p><Button variant="default" type="submit">Save</Button></div></div>
            </form> : <div className="mis-placeholder"><h3>{tab}</h3><p>This section is a local prototype placeholder. Model and collaboration settings are not connected to a live service.</p></div>}
          </div>
        </> : section === 'branding' ? <BrandingSettings /> : <div className="mis-placeholder"><h2>{selected?.label || 'nebulaONE'}</h2><p>This instance settings section is a local prototype placeholder. No live organisation settings are changed here.</p><Button variant="outline" onClick={() => setSection('onechat')}>Back to ONEchat settings</Button></div>}
      </div>
    </div>
  </div>;
}
