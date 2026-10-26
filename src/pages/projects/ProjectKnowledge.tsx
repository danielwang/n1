import { useRef, useState, type ChangeEvent, type RefObject } from 'react';
import { Button } from '../../components/ui/button';
import { Feedback } from '../../components/ui/feedback';
import { acceptedFileTypes, formatFileSize, maxFileSize, maxProjectFiles, type Project, type ProjectFile } from './project-data';
import { detailArt, fileArt } from './detail-art';

export function ProjectKnowledge({ project, chooser, onAdd, onRemove, onSelect }: {
  project: Project; chooser: RefObject<HTMLInputElement>; onAdd: (files: ProjectFile[]) => Promise<void>; onRemove: (file: ProjectFile) => void; onSelect: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const addFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []); event.target.value = '';
    if (!selected.length || pending.current) return;
    onSelect(); setError('');
    if (project.files.length + selected.length > maxProjectFiles) { setError('A project can have up to 20 file references. Remove a reference before adding more.'); return; }
    const names = new Set(project.files.map(file => file.name.toLowerCase()));
    for (const file of selected) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFileTypes.split(',').includes(extension)) { setError(`${file.name}: unsupported file type. Choose PDF, DOCX, XLSX, PPTX, TXT, Markdown, CSV, JSON, PNG, or JPG.`); return; }
      if (!file.size || file.size > maxFileSize) { setError(`${file.name}: choose a non-empty file of 10 MB or less.`); return; }
      if (names.has(file.name.toLowerCase())) { setError(`${file.name} is already selected or referenced in this project. Rename the file or choose another.`); return; }
      names.add(file.name.toLowerCase());
    }
    pending.current = true; setBusy(true);
    try {
      // Local preparation feedback; no upload or file-content read.
      await new Promise(resolve => setTimeout(resolve, 250));
      await onAdd(selected.map(file => ({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type || 'application/octet-stream', addedAt: new Date().toISOString() })));
    } catch { setError('File references could not be added. Please try again.'); }
    finally { pending.current = false; setBusy(false); }
  };
  const choose = () => { setError(''); chooser.current?.click(); };
  return <div className="pd-knowledge">
    <input hidden ref={chooser} type="file" multiple accept={acceptedFileTypes} aria-label="Choose project files" disabled={busy} onChange={event => { void addFiles(event); }} />
    {project.files.length ? <ul className="pd-file-grid">{project.files.map(file => <li className="pd-file-card" key={file.id}>
      <img src={fileArt(file.name)} alt="" /><div><strong>{file.name}</strong><span>{formatFileSize(file.size)}</span></div>
      <Button size="icon" aria-label={`Remove ${file.name}`} onClick={() => onRemove(file)}><img src={detailArt.remove} alt="" /></Button>
    </li>)}<li className="pd-add-cell"><Button className="pj-add-files pd-add-file" disabled={busy} onClick={choose}><img src={detailArt.plusCircle} alt="" />{busy ? 'Preparing…' : 'Add'}</Button></li></ul>
      : <Button className="pj-add-files pd-upload" onClick={choose} disabled={busy} aria-label="Select project files">
        <span className="pd-upload-art" aria-hidden="true"><img src={detailArt.uploadBackground} alt="" /><img src={detailArt.uploadContent} alt="" /></span>
        <span className="pd-upload-copy"><strong>{busy ? 'Preparing references…' : 'Select Files'}</strong><span>Add lecture notes, readings, and other files so AI can work with your material.</span></span>
      </Button>}
    <p className="pd-local-note">Local references only. Contents are not uploaded, stored, or processed. Up to 20 files, 10 MB each.</p>
    <Feedback message={busy ? 'Preparing local file references. No upload is taking place.' : ''} tone="loading" /><Feedback message={error} tone="error" />
  </div>;
}
