// Original icon assets used by product controls and content. The gallery
// displays their URLs directly, so the app's artwork remains unchanged.
const svgUrls = import.meta.glob('../../assets/**/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const pngUrls = import.meta.glob('../../assets/**/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export type CompositeIcon = 'chats' | 'phi' | 'model' | 'research-file' | 'markdown-file' | 'slides-file' | 'microsoft' | 'voice' | 'course-voice';
export type AppIcon = { label: string; source: string; src?: string; composite?: CompositeIcon };

const excluded = new Set([
  'account/empty-skills.svg',
  'courses/psy201/chats.svg', // Unused asset.
  'courses/psy201/figma/chat-empty.svg',
  'courses/psy201/figma/card-research-base.svg',
  'courses/psy201/figma/card-research-mark.svg',
  'courses/psy201/figma/card-md-base.svg',
  'courses/psy201/figma/card-md-mark.svg',
  'courses/psy201/figma/card-slides-base.svg',
  'courses/psy201/figma/card-slides-mark.svg',
  'login/aqua-university.svg',
  'management/instance-settings/divider.svg',
  'management/instance-settings/homepage.svg', // Unused asset.
  'management/instance-settings/model-border.svg',
  'management/instance-settings/model-core.svg',
  'management/instance-settings/model-line-h.svg',
  'management/instance-settings/model-line-v1.svg',
  'management/instance-settings/model-line-v2.svg',
  'management/instance-settings/nebula-dot.svg',
  'management/instance-settings/switch-off.svg',
  'management/instance-settings/switch-thumb.svg',
  'notifications/empty-mailbox.svg',
  'onechat/1-logo-aquauni.svg',
  'onechat/0-chat-cta.svg',
  'onechat/0-icons-generic-soundwave.svg',
  'onechat/1-vector.svg',
  'onechat/1-vector1.svg',
  'onechat/1-vector2.svg',
  'onechat/1-vector3.svg',
  'onechat/3-ellipse25.svg',
  'onechat/3-ellipse26.svg',
  'onechat/course-chat-cta.svg',
  'onechat/course-soundwave.svg',
  'onechat/account-panel/bg.svg',
  'onechat/account-panel/bottom-left.svg',
  'onechat/account-panel/cyan-blur.svg',
  'onechat/account-panel/red-blur.svg',
  'onechat/agent/starter.svg',
  'onechat/phi-h.svg',
  'onechat/phi-line.svg',
  'onechat/phi-shield.svg',
  'projects/detail/empty-artifacts.svg',
  'projects/detail/empty-chats.svg',
  'projects/detail/upload-background.svg',
  'projects/detail/upload-content.svg',
]);

const pngIcons = new Set([
  'onechat/agent/cassiopeia.png',
  'onechat/agent/centaurus.png',
  'onechat/agent/lyra.png',
  'onechat/featured/academic.png',
  'onechat/featured/campus.png',
  'onechat/featured/library.png',
]);

const labels: Record<string, string> = {
  'onechat/1-icon.svg': 'New chat',
  'onechat/1-icon1.svg': 'Artifacts',
  'onechat/1-icon2.svg': 'Projects',
  'onechat/1-icon3.svg': 'Explore agents',
  'onechat/2-start-icon.svg': 'Model',
  'onechat/2-end-icon.svg': 'Model chevron',
  'onechat/2-group14754.svg': 'Private chat',
  'onechat/1-icons-solid-ic-eva-arrow-ios-back-fill.svg': 'Collapse sidebar',
};

function labelFor(source: string) {
  const stem = source.split('/').pop()!.replace(/\.(svg|png)$/, '').replace(/^\d+-/, '').replace(/^icons?-(generic|agent|navigation)-/, '');
  return labels[source] ?? stem.replace(/-/g, ' ').replace(/^./, character => character.toUpperCase())
    .replace(/\bApi\b/g, 'API').replace(/\bHipaa\b/g, 'HIPAA').replace(/\bJson\b/g, 'JSON')
    .replace(/\bPdf\b/g, 'PDF').replace(/\bPpt\b/g, 'PPT').replace(/\bMd\b/g, 'Markdown')
    .replace(/\bOnechat\b/g, 'ONEchat').replace(/Power point/g, 'PowerPoint');
}

function groupFor(source: string) {
  if (source.startsWith('login/')) return 'Sign-in';
  if (source.startsWith('account/')) return 'Account';
  if (source.startsWith('courses/psy201/')) return 'Course workspace';
  if (source.startsWith('courses/')) return 'Courses';
  if (source.startsWith('management/instance-settings/')) return 'Instance settings';
  if (source.startsWith('management/')) return 'Management';
  if (source.startsWith('notifications/')) return 'Notifications';
  if (source.startsWith('onechat/artifact-open/')) return 'Artifact viewer';
  if (source.startsWith('onechat/artifacts/')) return 'Artifact file types';
  if (source.startsWith('onechat/agent/')) return 'Agent icons';
  if (source.startsWith('onechat/directory/')) return 'Agent directory';
  if (source.startsWith('onechat/featured/')) return 'Featured agents';
  if (source.startsWith('onechat/')) return 'Chat and navigation';
  if (source.startsWith('projects/detail/')) return 'Project detail';
  if (source.startsWith('projects/')) return 'Project types';
  return 'Messages';
}

export function iconAssetUrl(source: string) {
  return svgUrls[`../../assets/${source}`];
}

const darkPreviewSources = new Set([
  'courses/psy201/chat/chevron.svg',
  'courses/psy201/close-light.svg',
  'courses/psy201/figma/tab-file-inactive.svg',
  'courses/psy201/full-screen-light.svg',
  'courses/psy201/quit-full-screen-light.svg',
  'onechat/0-icons-generic-soundwave.svg',
  'onechat/1-icon.svg',
  'onechat/1-icon1.svg',
  'onechat/1-icon2.svg',
  'onechat/1-icon3.svg',
  'onechat/1-icons-generic-bell.svg',
  'onechat/1-icons-generic-search.svg',
  'onechat/1-icons-navigation-bot.svg',
  'onechat/1-icons-navigation-courses.svg',
  'onechat/1-icons-solid-ic-eva-arrow-ios-back-fill.svg',
  'onechat/1-vector.svg',
  'onechat/agent/send.svg',
  'onechat/artifact-open/chevron-down.svg',
  'onechat/artifact-open/close.svg',
  'onechat/artifact-open/download.svg',
  'onechat/artifact-open/fullscreen.svg',
  'onechat/artifact-open/more.svg',
  'onechat/artifact-open/send-arrow.svg',
  'onechat/course-material-tab.svg',
  'onechat/course-soundwave.svg',
  'onechat/featured/arrow.svg',
]);

export function needsDarkPreview(source: string) {
  return (source.startsWith('management/') && !source.startsWith('management/instance-settings/')) || darkPreviewSources.has(source);
}

const composites: AppIcon[] = [
  { label: 'Voice chat', source: 'onechat/0-chat-cta.svg', composite: 'voice' },
  { label: 'Course voice chat', source: 'onechat/course-chat-cta.svg', composite: 'course-voice' },
  { label: 'Chats', source: 'onechat/1-vector.svg', composite: 'chats' },
  { label: 'PHI reminder', source: 'onechat/phi-shield.svg', composite: 'phi' },
  { label: 'Model', source: 'management/instance-settings/model-border.svg', composite: 'model' },
  { label: 'Research file', source: 'courses/psy201/figma/card-research-base.svg', composite: 'research-file' },
  { label: 'Markdown file', source: 'courses/psy201/figma/card-md-base.svg', composite: 'markdown-file' },
  { label: 'Slides file', source: 'courses/psy201/figma/card-slides-base.svg', composite: 'slides-file' },
  { label: 'Microsoft sign-in', source: 'login/microsoft-inline', composite: 'microsoft' },
];

const icons: AppIcon[] = [
  ...Object.entries({ ...svgUrls, ...pngUrls })
    .map(([key, src]) => ({ source: key.replace('../../assets/', ''), src }))
    .filter(icon => icon.source.endsWith('.svg') ? !excluded.has(icon.source) : pngIcons.has(icon.source))
    .map(icon => ({ ...icon, label: labelFor(icon.source) })),
  ...composites,
].sort((a, b) => a.source.localeCompare(b.source));

const groupOrder = [
  'Sign-in',
  'Chat and navigation', 'Agent icons', 'Agent directory', 'Featured agents',
  'Artifact viewer', 'Artifact file types', 'Courses', 'Course workspace',
  'Project types', 'Project detail', 'Management', 'Instance settings',
  'Notifications', 'Account', 'Messages',
] as const;

export const appIconGroups = groupOrder.map(title => ({
  title,
  icons: icons.filter(icon => groupFor(icon.source) === title),
})).filter(group => group.icons.length > 0);
