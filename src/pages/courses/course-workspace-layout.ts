export type Panel = 'explorer' | 'material' | 'artifact' | 'chat';
export type ContentPanel = Exclude<Panel, 'explorer'>;
export type ViewportBand = 'wide' | 'compact' | 'medium' | 'small';

export const initialWidths: Record<Panel, number> = { explorer: 278, material: 630, artifact: 386, chat: 470 };
export const minimumWidths: Record<Panel, number> = { explorer: 220, material: 280, artifact: 260, chat: 300 };
export const maximumWidths: Record<Panel, number> = { explorer: 440, material: 850, artifact: 850, chat: 700 };
export const panelOrder: Panel[] = ['explorer', 'material', 'chat', 'artifact'];
export const contentOrder: ContentPanel[] = ['material', 'chat', 'artifact'];

export function getViewportBand(navCollapsed: boolean): ViewportBand {
  if (window.innerWidth >= 1920) return 'wide';
  if (window.innerWidth >= 1536) return navCollapsed ? 'wide' : 'compact';
  if (window.innerWidth >= 1200) return 'compact';
  if (window.innerWidth >= 900) return 'medium';
  return 'small';
}

export function courseWorkspaceLayout({ open, widths, expanded, viewportBand, navCollapsed, activeContentPanel, viewportWidth }: {
  open: Record<Panel, boolean>;
  widths: Record<Panel, number>;
  expanded: Panel | null;
  viewportBand: ViewportBand;
  navCollapsed: boolean;
  activeContentPanel: ContentPanel;
  viewportWidth: number;
}) {
  const chatVisible = open.chat || (!open.material && !open.artifact);
  const availableContent = contentOrder.filter(panel => panel === 'chat' ? chatVisible : open[panel]);
  const mediumPanel = availableContent.includes(activeContentPanel) ? activeContentPanel : availableContent[0];
  const layoutPanels: Panel[] = expanded ? [expanded]
    : viewportBand === 'medium' ? ['explorer', mediumPanel]
    : panelOrder.filter(panel => panel === 'explorer' || (panel === 'chat' ? chatVisible : open[panel]));
  const notebookRailVisible = !open.artifact && !expanded && (viewportBand === 'wide' || viewportBand === 'compact');
  const canFitCompactExplorer = widths.explorer + layoutPanels.slice(1).reduce((total, panel) => total + minimumWidths[panel], 0)
    + (notebookRailVisible ? 56 : 0) + (layoutPanels.length - 1 + (notebookRailVisible ? 1 : 0)) * 3
    <= viewportWidth - (navCollapsed ? 80 : 280) - (viewportWidth < 1280 ? 48 : 64);
  const compactExplorerRail = viewportBand === 'compact' && (!open.explorer || !canFitCompactExplorer);
  const contentGridColumns = viewportBand === 'medium' && !expanded ? `${widths.explorer}px minmax(0, 1fr)`
    : viewportBand === 'compact' && !expanded ? [compactExplorerRail ? '56px' : `${widths.explorer}px`, ...layoutPanels.slice(1).map(panel => `minmax(${minimumWidths[panel]}px, ${widths[panel]}fr)`)].join(' ')
    : open.material && !open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, ${widths.material}px) minmax(0, 1fr)`
    : !open.material && open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, 1fr) ${widths.artifact}px`
    : !open.material && !open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, 1fr)`
    : layoutPanels.map(panel => {
      if (panel === 'explorer' && !open.explorer) return '56px';
      if (panel === 'explorer') return `${widths.explorer}px`;
      return `minmax(0, ${widths[panel]}fr)`;
    }).join(' ');
  const gridColumns = notebookRailVisible ? `${contentGridColumns} 56px` : contentGridColumns;

  return { chatVisible, availableContent, mediumPanel, layoutPanels, notebookRailVisible, canFitCompactExplorer, compactExplorerRail, gridColumns };
}
