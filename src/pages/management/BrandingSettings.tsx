import { NativeSelect } from '../../components/ui/native-select';
import { Input } from '../../components/ui/input';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Check, Plus } from '../../components/ui/solar-icons';
import { defaultBranding, saveBranding, useBranding, type BrandImage, type BrandingSettings } from '../../branding';
import loginLogoDefault from '../../assets/login/aqua-university.svg';
import loginBackgroundDefault from '../../assets/login/campus.webp';
import sidebarLogoDefault from '../../assets/onechat/1-logo-aquauni.svg';
import './branding-settings.css';

type ImageKey = 'loginBackground' | 'favicon' | 'loginLogo' | 'sidebarLogo';
type ColorKey = 'sidebarColor' | 'avatarColor';
type FieldErrors = Partial<Record<ImageKey | ColorKey, string>>;

const uploads: { key: ImageKey; title: string; hint: string; accept: string; maxBytes: number }[] = [
  { key: 'loginBackground', title: 'Login background', hint: 'PNG, JPEG or WebP · up to 2 MB · landscape works best', accept: '.png,.jpg,.jpeg,.webp', maxBytes: 2 * 1024 * 1024 },
  { key: 'loginLogo', title: 'Login page logo', hint: 'PNG, JPEG or WebP · up to 400 KB · use a transparent image for best results', accept: '.png,.jpg,.jpeg,.webp', maxBytes: 400 * 1024 },
  { key: 'sidebarLogo', title: 'Navigation sidebar logo', hint: 'PNG, JPEG or WebP · up to 400 KB · use a light logo on dark backgrounds', accept: '.png,.jpg,.jpeg,.webp', maxBytes: 400 * 1024 },
  { key: 'favicon', title: 'Favicon', hint: 'PNG or ICO · up to 150 KB · a square image works best', accept: '.png,.ico', maxBytes: 150 * 1024 },
];

const hexColor = /^#[0-9a-f]{6}$/i;
function contrast(first: string, second: string) {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
    const [red, green, blue] = channels.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * red + .7152 * green + .0722 * blue;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

function readImage(file: File, key: ImageKey, maxBytes: number): Promise<BrandImage> {
  const suffix = file.name.split('.').pop()?.toLowerCase();
  const mime = suffix === 'ico' && key === 'favicon' ? 'image/x-icon'
    : suffix === 'png' ? 'image/png' : suffix === 'jpg' || suffix === 'jpeg' ? 'image/jpeg'
    : suffix === 'webp' ? 'image/webp' : '';
  if (!mime || (key === 'favicon' && mime !== 'image/png' && mime !== 'image/x-icon')) {
    return Promise.reject(new Error(key === 'favicon' ? 'Choose a PNG or ICO file.' : 'Choose a PNG, JPEG or WebP image.'));
  }
  if (file.size > maxBytes) return Promise.reject(new Error(`This file is too large. Choose one under ${maxBytes >= 1024 * 1024 ? '2 MB' : `${Math.round(maxBytes / 1024)} KB`}.`));
  if (!file.size) return Promise.reject(new Error('This file is empty. Choose another image.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The image could not be read. Try another file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.includes(';base64,')) { reject(new Error('The image could not be read. Try another file.')); return; }
      const dataUrl = result.replace(/^data:[^;]*;base64,/, `data:${mime};base64,`);
      const image = new Image();
      image.onload = () => resolve({ name: file.name, dataUrl });
      image.onerror = () => reject(new Error('This file is not a valid image. Choose another file.'));
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function UploadField({ config, image, error, busy, tileColor, onUpload, onRemove }: {
  config: (typeof uploads)[number]; image: BrandImage | null; error?: string; busy: boolean;
  tileColor?: string;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void;
}) {
  const id = `mis-brand-${config.key}`;
  const defaultImage = config.key === 'loginBackground' ? loginBackgroundDefault : config.key === 'loginLogo' ? loginLogoDefault : config.key === 'sidebarLogo' ? sidebarLogoDefault : null;
  return <div className="mis-brand-field">
    <div className="mis-brand-field-heading"><label htmlFor={id}>{config.title}</label>{image && <Button variant="ghost" onClick={onRemove}>Remove</Button>}</div>
    <div className="mis-brand-asset-tiles">
      <div className={`mis-brand-current-tile mis-brand-current-tile--${config.key}`} style={tileColor ? { backgroundColor: tileColor } : undefined}>
        {image || defaultImage ? <img src={image?.dataUrl || defaultImage || ''} alt="" /> : <span className="mis-brand-empty-icon" aria-hidden="true">◈</span>}
        <span>{image ? 'Selected' : config.key === 'favicon' ? 'None' : 'Default'}</span>
        {(image || defaultImage) && <span className="mis-brand-selected-mark" aria-hidden="true"><Check size={12} /></span>}
      </div>
      <div className="mis-brand-add-tile">
        <Plus size={20} />
        <strong>{busy ? 'Checking…' : image ? 'Replace' : 'Add image'}</strong>
        <input id={id} type="file" accept={config.accept} onChange={onUpload} aria-label={`Upload ${config.title.toLowerCase()}`} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`} disabled={busy} />
      </div>
    </div>
    <p id={`${id}-hint`}>{config.hint}</p>
    <span className="mis-brand-file-name">{busy ? 'Checking image…' : image ? image.name : config.key === 'favicon' ? 'No custom favicon' : 'Using the Aqua University default'}</span>
    {error && <p className="mis-brand-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>;
}

function ColorField({ id, label, hint, value, fallback, error, onChange, inputRef }: {
  id: ColorKey; label: string; hint: string; value: string; fallback: string; error?: string;
  onChange: (value: string) => void; inputRef: React.RefObject<HTMLInputElement>;
}) {
  return <div className="mis-brand-field">
    <label htmlFor={`mis-brand-${id}`}>{label}</label>
    <p id={`mis-brand-${id}-hint`}>{hint}</p>
    <div className="mis-brand-color-control">
      <input type="color" aria-label={`Choose ${label.toLowerCase()}`} value={hexColor.test(value) ? value : fallback} onChange={event => onChange(event.target.value)} />
      <Input unstyled ref={inputRef} id={`mis-brand-${id}`} type="text" value={value} maxLength={7} spellCheck={false} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={`mis-brand-${id}-hint${error ? ` mis-brand-${id}-error` : ''}`} />
    </div>
    {error && <p className="mis-brand-error" id={`mis-brand-${id}-error`} role="alert">{error}</p>}
  </div>;
}

export function BrandingSettings() {
  const saved = useBranding();
  const [draft, setDraft] = useState<BrandingSettings>(() => ({ ...saved }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState<ImageKey | null>(null);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState(false);
  const [preview, setPreview] = useState<'login' | 'navigation' | 'favicon'>('login');
  const sidebarColorRef = useRef<HTMLInputElement>(null);
  const avatarColorRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const sidebarColor = hexColor.test(draft.sidebarColor) ? draft.sidebarColor : saved.sidebarColor;
  const avatarColor = hexColor.test(draft.avatarColor) ? draft.avatarColor : saved.avatarColor;

  const update = <K extends keyof BrandingSettings>(key: K, value: BrandingSettings[K]) => {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    setStatus('');
    setSaveError(false);
    setPreview(key === 'favicon' ? 'favicon' : key === 'sidebarColor' || key === 'sidebarLogo' || key === 'avatarColor' ? 'navigation' : 'login');
  };
  const upload = async (key: ImageKey, maxBytes: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setBusy(key);
    setStatus('');
    setErrors(current => ({ ...current, [key]: undefined }));
    try { update(key, await readImage(file, key, maxBytes)); }
    catch (failure) { setErrors(current => ({ ...current, [key]: failure instanceof Error ? failure.message : 'The image could not be uploaded.' })); }
    finally { setBusy(null); }
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!hexColor.test(draft.sidebarColor)) nextErrors.sidebarColor = 'Enter a six-digit hex color, such as #16213E.';
    else if (contrast(draft.sidebarColor, '#ffffff') < 4.5) nextErrors.sidebarColor = 'Choose a darker color so white sidebar text stays readable.';
    if (!hexColor.test(draft.avatarColor)) nextErrors.avatarColor = 'Enter a six-digit hex color, such as #EFC07B.';
    else if (contrast(draft.avatarColor, '#161c24') < 4.5) nextErrors.avatarColor = 'Choose a lighter color so avatar initials stay readable.';
    setErrors(nextErrors);
    if (nextErrors.sidebarColor) { sidebarColorRef.current?.focus(); return; }
    if (nextErrors.avatarColor) { avatarColorRef.current?.focus(); return; }
    try {
      saveBranding(draft);
      setStatus('Branding saved in this browser. The login page and navigation now use these settings.');
      setSaveError(false);
    } catch {
      setStatus('This browser could not save the images. Try smaller files, or remove an image and save again. Your draft is still here.');
      setSaveError(true);
    }
  };

  return <section className="mis-branding" aria-labelledby="mis-branding-title">
    <header className="mis-branding-heading"><span>Admin settings</span><h2 id="mis-branding-title">Branding</h2><p>Customize the login page and navigation for this instance. Changes are saved only in this browser.</p></header>
    <div className="mis-branding-layout">
      <form className="mis-branding-form" onSubmit={save} noValidate>
        <div className="mis-branding-group"><h3>Login page</h3>
          {uploads.filter(item => item.key === 'loginBackground' || item.key === 'loginLogo').map(config => <UploadField key={config.key} config={config} image={draft[config.key]} error={errors[config.key]} busy={busy === config.key} onUpload={event => upload(config.key, config.maxBytes, event)} onRemove={() => update(config.key, null)} />)}
          <div className="mis-brand-field"><div className="mis-brand-range-heading"><label htmlFor="mis-brand-opacity">Background shade</label><output htmlFor="mis-brand-opacity">{draft.loginOverlayOpacity}%</output></div><p id="mis-brand-opacity-hint">Darkens the image behind the login card.</p><input id="mis-brand-opacity" type="range" min="0" max="80" step="5" value={draft.loginOverlayOpacity} aria-describedby="mis-brand-opacity-hint" onChange={event => update('loginOverlayOpacity', Number(event.target.value))} /></div>
          <div className="mis-brand-field"><label htmlFor="mis-brand-position">Background position</label><p id="mis-brand-position-hint">Choose which part of the image stays in view.</p><NativeSelect unstyled id="mis-brand-position" value={draft.loginBackgroundPosition} aria-describedby="mis-brand-position-hint" onChange={event => update('loginBackgroundPosition', event.target.value as BrandingSettings['loginBackgroundPosition'])}><option value="58% center">Aqua default</option><option value="center center">Center</option><option value="left center">Left</option><option value="right center">Right</option></NativeSelect></div>
        </div>
        <div className="mis-branding-group"><h3>Navigation</h3>
          <ColorField id="sidebarColor" label="Sidebar background color" hint="Used behind navigation and the sidebar logo." value={draft.sidebarColor} fallback={saved.sidebarColor} error={errors.sidebarColor} onChange={value => update('sidebarColor', value)} inputRef={sidebarColorRef} />
          <UploadField config={uploads[2]} image={draft.sidebarLogo} error={errors.sidebarLogo} busy={busy === 'sidebarLogo'} tileColor={sidebarColor} onUpload={event => upload('sidebarLogo', uploads[2].maxBytes, event)} onRemove={() => update('sidebarLogo', null)} />
          <ColorField id="avatarColor" label="User avatar secondary color" hint="Used behind user initials in the sidebar and conversation." value={draft.avatarColor} fallback={saved.avatarColor} error={errors.avatarColor} onChange={value => update('avatarColor', value)} inputRef={avatarColorRef} />
        </div>
        <div className="mis-branding-group"><h3>Browser tab</h3><UploadField config={uploads[3]} image={draft.favicon} error={errors.favicon} busy={busy === 'favicon'} onUpload={event => upload('favicon', uploads[3].maxBytes, event)} onRemove={() => update('favicon', null)} /></div>
        <div className="mis-branding-actions"><Button variant="outline" onClick={() => { setDraft({ ...saved }); setErrors({}); setStatus('Draft changes discarded.'); }} disabled={!dirty}>Discard changes</Button><Button variant="outline" onClick={() => { setDraft({ ...defaultBranding }); setErrors({}); setStatus('Defaults are shown in the preview. Save to apply them.'); }}>Restore defaults</Button><Button variant="default" type="submit" disabled={!dirty || busy !== null}>Save branding</Button></div>
        <p className="mis-branding-status" data-error={saveError} role="status" aria-live="polite">{status}</p>
      </form>
      <aside className="mis-branding-previews" aria-label="Branding preview">
        <div className="mis-branding-preview-heading"><h3>Preview</h3><span>{dirty ? 'Unsaved changes' : 'Saved appearance'}</span></div>
        <div className="mis-branding-preview-tabs" role="group" aria-label="Preview type">
          <Button aria-pressed={preview === 'login'} onClick={() => setPreview('login')}>Login</Button>
          <Button aria-pressed={preview === 'navigation'} onClick={() => setPreview('navigation')}>Navigation</Button>
          <Button aria-pressed={preview === 'favicon'} onClick={() => setPreview('favicon')}>Favicon</Button>
        </div>
        <section className="mis-branding-preview-stage" aria-label={`${preview === 'login' ? 'Login page' : preview === 'navigation' ? 'Navigation' : 'Favicon'} preview`}>
          <div className="mis-branding-browser-bar"><span className="mis-branding-browser-dots" aria-hidden="true"><i /><i /><i /></span><div className="mis-branding-browser-tab">{draft.favicon ? <img src={draft.favicon.dataUrl} alt="" /> : <span aria-hidden="true">◈</span>}<span>Aqua University</span></div></div>
          {preview === 'login' ? <div className="mis-branding-login-preview" style={{ backgroundImage: `linear-gradient(rgb(0 0 0 / ${draft.loginOverlayOpacity}%), rgb(0 0 0 / ${draft.loginOverlayOpacity}%)), url('${draft.loginBackground?.dataUrl || loginBackgroundDefault}')`, backgroundPosition: draft.loginBackgroundPosition }}><div><img src={draft.loginLogo?.dataUrl || loginLogoDefault} alt="Login page logo preview" /><span>Log in to AI portal</span><b>Sign in with Microsoft</b></div></div>
            : preview === 'navigation' ? <div className="mis-branding-navigation-stage"><div className="mis-branding-sidebar-preview" style={{ backgroundColor: sidebarColor }}><img src={draft.sidebarLogo?.dataUrl || sidebarLogoDefault} alt="Navigation logo preview" /><span>New Chat</span><span>Courses</span><span>Artifacts</span><span>Projects</span><div><span style={{ backgroundColor: avatarColor }}>DW</span>Daniel Wang</div></div><div className="mis-branding-navigation-canvas"><span>ONEchat</span><div /></div></div>
              : <div className="mis-branding-favicon-stage"><div className="mis-branding-tab-preview">{draft.favicon ? <img src={draft.favicon.dataUrl} alt="Favicon preview" /> : <span aria-hidden="true">◈</span>}<span>Aqua University</span></div><div className="mis-branding-address-preview">example.local/onechat</div><p>Your favicon appears on the browser tab after saving.</p></div>}
        </section>
      </aside>
    </div>
  </section>;
}
