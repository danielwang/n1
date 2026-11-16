import dashboard from '../../assets/management/dashboard.svg';
import agents from '../../assets/management/agents.svg';
import fileLibraries from '../../assets/management/file-libraries.svg';
import connections from '../../assets/management/connections.svg';
import skills from '../../assets/management/skills.svg';
import agentBrands from '../../assets/management/agent-brands.svg';
import guidelines from '../../assets/management/guidelines.svg';
import moderation from '../../assets/management/moderation.svg';
import users from '../../assets/management/users.svg';
import apiProfiles from '../../assets/management/api-profiles.svg';
import foundry from '../../assets/management/foundry.svg';
import audit from '../../assets/management/audit.svg';
import settings from '../../assets/management/settings.svg';
import chevron from '../../assets/management/chevron.svg';

export const managementChevron = chevron;

export const managementItems = [
  { id: 'dashboard', label: 'Dashboard', group: 'agents', icon: dashboard },
  { id: 'agents', label: 'Agents', group: 'agents', icon: agents, hasChildren: true },
  { id: 'file-libraries', label: 'File Libraries', group: 'agents', icon: fileLibraries },
  { id: 'connections', label: 'Connections', group: 'agents', icon: connections },
  { id: 'skills', label: 'Skills', group: 'agents', icon: skills },
  { id: 'agent-brands', label: 'Agent Brands', group: 'agents', icon: agentBrands },
  { id: 'guidelines', label: 'Guidelines', group: 'agents', icon: guidelines },
  { id: 'moderation', label: 'Moderation', group: 'agents', icon: moderation },
  { id: 'users-management', label: 'Users Management', group: 'admin', icon: users, hasChildren: true },
  { id: 'api-access-profiles', label: 'API Access Profiles', group: 'admin', icon: apiProfiles },
  { id: 'foundry-models', label: 'Foundry Models', group: 'admin', icon: foundry },
  { id: 'audit-logs', label: 'Audit Logs', group: 'admin', icon: audit },
  { id: 'instance-settings', label: 'Instance Settings', group: 'admin', icon: settings },
] as const;

export type ManagementItem = (typeof managementItems)[number];
