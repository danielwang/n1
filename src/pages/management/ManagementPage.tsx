import { useEffect, useState } from 'react';
import { Bell, Menu, X } from '../../components/ui/solar-icons';
import { Button, buttonVariants } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import { SidebarContent, type Info } from '../onechat/ChatShell';
import { managementItems } from './data';
import { InstanceSettingsPage } from './InstanceSettingsPage';
import './management.css';

const tabs = ['Overview', 'User Insights', 'Conversations Analytics', 'Tokens Consumption'] as const;
type Tab = (typeof tabs)[number];
const metrics = [
  { label: 'Total User Accounts', value: '8,950', change: '+15.6%' },
  { label: 'Monthly Active Users', value: '1,233', change: '+35.2%' },
  { label: 'Daily Active Users', value: '45', change: '−4.8%' },
  { label: 'Conversations', value: '123,456', change: '+22.1%' },
  { label: 'Avg Conversations/User', value: '120', change: '−10.0%' },
  { label: 'Token Consumption', value: '12,345,689', change: '+3.5%' },
] as const;

export function ManagementPage() {
  const notifications = useNotifications();
  const agentNavigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [tab, setTab] = useState<Tab>('Overview');
  const [insightVisible, setInsightVisible] = useState(true);
  const section = window.location.hash.split('/')[3] || 'dashboard';
  const item = managementItems.find(candidate => candidate.id === section);
  const title = item?.label || 'Dashboard';

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · Management · Aqua University`;
    return () => { document.title = previous; };
  }, [title]);

  const sidebarProps = {
    management: true,
    onNewChat: () => { window.location.hash = '/onechat'; },
    onSelect: () => { window.location.hash = '/onechat'; },
    onSelectAgent: (agent: Parameters<typeof agentNavigation.setAgent>[0]) => { agentNavigation.setAgent(agent); window.location.hash = '/onechat/agent'; },
    onInfo: setInfo,
    onNotifications: notifications.open,
    unreadCount: notifications.unreadCount,
    notificationsOpen: notifications.isOpen,
  };

  return <div className={`onechat management-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a href="#mg-main" className="oc-skip-link" onClick={event => { event.preventDefault(); document.getElementById('mg-main')?.focus(); }}>Skip to management content</a>
    <aside className="oc-sidebar" aria-label="Management sidebar">
      <SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} />
    </aside>
    <main className="mg-main" id="mg-main" tabIndex={-1}>
      <div className="mg-mobile-toolbar">
        <Button size="icon" aria-label="Open management navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        <strong>Management</strong>
        <Button size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      {section === 'dashboard' || !item ? <>
        <div className="mg-dashboard">
          <Tabs value={tab} onValueChange={value => setTab(value as Tab)}>
          <TabsList className="mg-tabs" aria-label="Dashboard analytics">
            {tabs.map(name => <TabsTrigger key={name} value={name} className={buttonVariants()}>{name}</TabsTrigger>)}
          </TabsList>
          {tabs.map(panel => <TabsContent key={panel} value={panel} tabIndex={-1}>
            {panel === tab && (tab === 'Overview' ? <>
              {insightVisible && <section className="mg-card mg-insight" aria-labelledby="mg-insight-title">
                <div className="mg-card-heading"><h1 id="mg-insight-title">Weekly Insight &amp; Recommendations</h1><Button size="icon" aria-label="Dismiss weekly insight" onClick={() => setInsightVisible(false)}><X size={20} /></Button></div>
                <p className="mg-subtitle">Example insights · sample data</p><div className="mg-insight-columns">
                  <div><h2>🎉 &nbsp;Wins</h2><ul><li>New user signups are up this month</li><li>Daily engagement is trending higher</li></ul></div>
                  <div><h2>⚠ &nbsp;Attention Needed</h2><ul><li>Review activation and inactive users</li><li>Check the latest moderation queue</li></ul></div>
                </div>
              </section>}
              <section className="mg-card mg-overview" aria-labelledby="mg-overview-title">
                <h2 id="mg-overview-title">Overview</h2><p className="mg-subtitle">Last 30 days vs previous 30 days · sample data</p>
                <div className="mg-metrics">{metrics.map(metric => <article className="mg-metric" key={metric.label}><h3>{metric.label}</h3><span className={metric.change.startsWith('−') ? 'mg-trend-down' : 'mg-trend-up'}>{metric.change.startsWith('−') ? '↘' : '↗'} &nbsp;{metric.change}</span><strong>{metric.value}</strong></article>)}</div>
              </section>
              {['User Activity', 'Consumption', 'Model Usage'].map(name => <section className="mg-card mg-chart" key={name}><h2>{name}</h2><p className="mg-subtitle">Analytics preview · sample data</p><div className="mg-chart-placeholder" aria-label={`${name} chart placeholder`}>Chart preview</div></section>)}
            </> : <section className="mg-card mg-empty-panel"><h1>{tab}</h1><p>This analytics view is a placeholder in the local prototype. No live reporting service is connected.</p></section>)}
          </TabsContent>)}
          </Tabs>
        </div>
      </> : section === 'instance-settings' ? <InstanceSettingsPage /> : <div className="mg-dashboard"><section className="mg-card mg-empty-panel"><h1>{title}</h1><p>This management section is a placeholder in the local prototype. No changes are made to a live service.</p><Button variant="outline" onClick={() => { window.location.hash = '/onechat/management/dashboard'; }}>Back to dashboard</Button></section></div>}
    </main>
    {mobileOpen && <Dialog title="Management navigation" hideHeading className="oc-navigation-dialog mg-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
