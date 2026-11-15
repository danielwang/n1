import type { Dispatch, KeyboardEvent, PointerEvent, SetStateAction } from 'react';
import { contentOrder, maximumWidths, minimumWidths, panelOrder, type ContentPanel, type Panel, type ViewportBand } from './course-workspace-layout';

interface CoursePanelControls {
  open: Record<Panel, boolean>;
  widths: Record<Panel, number>;
  viewportBand: ViewportBand;
  compactExplorerRail: boolean;
  canFitCompactExplorer: boolean;
  setOpen: Dispatch<SetStateAction<Record<Panel, boolean>>>;
  setCompactExplorerOpen: Dispatch<SetStateAction<boolean>>;
  setExpanded: Dispatch<SetStateAction<Panel | null>>;
  setActiveMobilePanel: Dispatch<SetStateAction<Panel>>;
  setActiveContentPanel: Dispatch<SetStateAction<ContentPanel>>;
  setWidths: Dispatch<SetStateAction<Record<Panel, number>>>;
  setStatus: Dispatch<SetStateAction<string>>;
}

export function coursePanelControls({ open, widths, viewportBand, compactExplorerRail, canFitCompactExplorer, setOpen, setCompactExplorerOpen, setExpanded, setActiveMobilePanel, setActiveContentPanel, setWidths, setStatus }: CoursePanelControls) {
  const showPanel = (panel: Panel) => {
    if (panel === 'explorer' && compactExplorerRail) {
      if (canFitCompactExplorer) {
        setOpen(value => ({ ...value, explorer: true }));
        setCompactExplorerOpen(false);
      } else {
        setCompactExplorerOpen(true);
      }
      return;
    }
    setOpen(value => ({ ...value, [panel]: true }));
    setExpanded(null);
    setActiveMobilePanel(panel);
    if (panel !== 'explorer') setActiveContentPanel(panel);
    if (viewportBand === 'compact') setCompactExplorerOpen(false);
  };
  const closePanel = (panel: Panel) => {
    if (panel === 'explorer' && compactExplorerRail) {
      setCompactExplorerOpen(false);
      return;
    }
    if (panel === 'chat' && !open.material && !open.artifact) return;
    const next = { ...open, [panel]: false };
    if (panel === 'artifact') next.chat = true;
    const onlyChat = !next.material && !next.artifact;
    if (onlyChat) next.chat = true;
    setOpen(next);
    setExpanded(null);
    const fallback = next.chat && panel !== 'chat' ? 'chat' : panelOrder.find(item => item !== panel && next[item]);
    if (fallback) setActiveMobilePanel(fallback);
    const contentFallback = contentOrder.find(item => item !== panel && (item === 'chat' ? next.chat : next[item]));
    if (contentFallback) setActiveContentPanel(contentFallback);
    setStatus(`${panel === 'explorer' ? 'Course explorer' : panel} panel closed.`);
  };
  const toggleExpanded = (panel: Panel) => {
    setExpanded(value => value === panel ? null : panel);
    setActiveMobilePanel(panel);
    if (panel !== 'explorer') setActiveContentPanel(panel);
  };

  const startResize = (left: Panel, right: Panel, event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const start = event.clientX;
    const leftStart = widths[left];
    const rightStart = widths[right];
    const move = (next: globalThis.PointerEvent) => {
      const delta = next.clientX - start;
      const lower = Math.max(minimumWidths[left] - leftStart, rightStart - maximumWidths[right]);
      const upper = Math.min(maximumWidths[left] - leftStart, rightStart - minimumWidths[right]);
      const adjusted = Math.max(lower, Math.min(upper, delta));
      setWidths(value => ({ ...value, [left]: leftStart + adjusted, [right]: rightStart - adjusted }));
    };
    const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); document.body.style.cursor = ''; };
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };
  const resizeWithKeyboard = (left: Panel, right: Panel, event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const pair = widths[left] + widths[right];
    const min = Math.max(minimumWidths[left], pair - maximumWidths[right]);
    const max = Math.min(maximumWidths[left], pair - minimumWidths[right]);
    const target = event.key === 'Home' ? min : event.key === 'End' ? max : widths[left] + (event.key === 'ArrowLeft' ? -16 : 16);
    const next = Math.max(min, Math.min(max, target));
    setWidths(value => ({ ...value, [left]: next, [right]: pair - next }));
  };
  const divider = (left: Panel, right: Panel) => <div key={`${left}-${right}`} className="psy-divider" role="separator" tabIndex={0} aria-orientation="vertical" aria-label={`Resize ${left} and ${right} panels`} aria-valuenow={Math.round(widths[left])} aria-valuemin={minimumWidths[left]} aria-valuemax={maximumWidths[left]} onPointerDown={event => startResize(left, right, event)} onKeyDown={event => resizeWithKeyboard(left, right, event)}><span aria-hidden="true" /></div>;

  return { showPanel, closePanel, toggleExpanded, divider };
}
