import onechat from '../../assets/management/instance-settings/onechat.svg';
import agents from '../../assets/management/instance-settings/agents.svg';
import agreements from '../../assets/management/instance-settings/agreements.svg';
import announcements from '../../assets/management/instance-settings/announcements.svg';
import branding from '../../assets/management/instance-settings/branding.svg';
import budget from '../../assets/management/instance-settings/budget.svg';
import hipaa from '../../assets/management/instance-settings/hipaa.svg';
import integration from '../../assets/management/instance-settings/integration.svg';
import homepage from '../../assets/management/instance-settings/homepage.svg';
import moreSettings from '../../assets/management/instance-settings/more-settings.svg';

export const instanceSettingsNav = [
  { id: 'onechat', label: 'ONEchat', icon: onechat },
  { id: 'agents', label: 'Agents', icon: agents },
  { id: 'models', label: 'Models', icon: null },
  { id: 'agreements', label: 'Agreements', icon: agreements },
  { id: 'announcements', label: 'Announcements', icon: announcements },
  { id: 'branding', label: 'Branding', icon: branding },
  { id: 'budget', label: 'Budget', icon: budget },
  { id: 'hipaa', label: 'HIPAA', icon: hipaa },
  { id: 'integration', label: 'Integration', icon: integration },
  { id: 'homepage', label: 'Homepage', icon: homepage },
  { id: 'more-settings', label: 'More Settings', icon: moreSettings },
] as const;

export type InstanceSettings = {
  onechat: boolean;
  customName: string;
  deepResearch: boolean;
  imageCreation: boolean;
  webSearch: boolean;
  codeInterpreter: boolean;
};

export const defaultInstanceSettings: InstanceSettings = {
  onechat: true,
  customName: 'Cloudforce',
  deepResearch: false,
  imageCreation: false,
  webSearch: false,
  codeInterpreter: false,
};

export const instanceSettingsStorageKey = 'n1-prototype-instance-settings';

export function loadInstanceSettings(): InstanceSettings {
  try {
    const stored = JSON.parse(localStorage.getItem(instanceSettingsStorageKey) || 'null') as Partial<InstanceSettings> | null;
    if (!stored || typeof stored.customName !== 'string' || !['onechat', 'deepResearch', 'imageCreation', 'webSearch', 'codeInterpreter'].every(key => typeof stored[key as keyof InstanceSettings] === 'boolean')) return defaultInstanceSettings;
    return { ...defaultInstanceSettings, ...stored };
  } catch {
    return defaultInstanceSettings;
  }
}
