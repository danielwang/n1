import { Button } from '../../components/ui/button';
import { assets } from './assets';
import { agentAssets, campusAgent, type ChatAgent } from './agent-data';
import { useAgentNavigation } from './AgentNavigationState';
import './agent-navigation.css';

export function AgentAvatar({ agent, large = false }: { agent: ChatAgent; large?: boolean }) {
  return <span className={`ac-avatar ${large ? 'ac-avatar-large' : ''} ${agent.art ? `ac-art-${agent.art}` : ''} ${agent.iconSize === 36 ? 'ac-avatar--directory' : ''}`}>
    <span className="ac-avatar-icon"><img src={agent.icon} alt="" draggable={false} /></span>
    {agent.official && <img className="ac-official" src={large ? agentAssets.officialLarge : agentAssets.officialSmall} alt="Verified agent" />}
  </span>;
}

export function AgentNavigation({ onSelect }: { onSelect: (agent: ChatAgent) => void }) {
  const { agent, collection, setCollection, pinned, agents } = useAgentNavigation();
  const available = pinned.includes(campusAgent.id) ? [...agents, campusAgent] : agents;
  const visible = available.filter(item => collection === 'recent' ? item.id !== campusAgent.id : pinned.includes(item.id));

  return <div className="ac-agent-directory">
    <div className="ac-agent-list" role="group" aria-label={`${collection === 'recent' ? 'Recent' : 'Pinned'} agents`}>
      {visible.map(item => <Button key={item.id} className="ac-agent-row" aria-label={item.name}
        aria-description={item.official ? 'Official university agent' : undefined}
        title={item.name} aria-current={item.id === agent.id ? 'true' : undefined} onClick={() => onSelect(item)}>
        <AgentAvatar agent={item} /><span>{item.name}</span>
      </Button>)}
      {!visible.length && <p className="oc-empty">No pinned agents. Open an agent’s options to pin it here.</p>}
    </div>
    <div className="oc-history-tabs ac-collection-tabs" role="group" aria-label="Agent collection">
      {(['recent', 'pinned'] as const).map(value => <Button key={value} aria-pressed={collection === value} onClick={() => setCollection(value)}>
        {collection === value && <img className="oc-asset" src={assets.historyTab} alt="" />}
        <span>{value === 'recent' ? 'Recent' : 'Pinned'}</span>
      </Button>)}
    </div>
  </div>;
}
