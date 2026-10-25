import { useState } from 'react';
import { Button } from '../../components/ui/button';
import official from '../../assets/onechat/featured/official.svg';
import arrow from '../../assets/onechat/featured/arrow.svg';
import { featuredAgents, type FeaturedAgent } from './featured-agent-data';

export function FeaturedAgents({ onSelect, onBrowse }: {
  onSelect: (agent: FeaturedAgent) => void;
  onBrowse: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = hovered ?? focused;

  return <section className="oc-featured" aria-labelledby="oc-featured-heading">
    <div className="oc-featured-heading">
      <h2 id="oc-featured-heading">Featured agents</h2>
      <img className="oc-featured-arrow" src={arrow} alt="" draggable={false} />
      <Button className="oc-browse-agents" onClick={onBrowse}>Browse more agents</Button>
    </div>
    <ul className="oc-agent-dock" onPointerLeave={() => setHovered(null)}>
      {featuredAgents.map((agent, index) => {
        const distance = active === null ? Infinity : Math.abs(index - active);
        return <li key={agent.id} className="oc-agent-slot" data-active={distance === 0} data-neighbor={distance === 1}>
          <Button className="oc-agent-card" title={agent.name} aria-label={`Start a chat with ${agent.name}`}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(index); }}
            onFocus={() => setFocused(index)} onBlur={() => setFocused(null)} onClick={() => onSelect(agent)}>
            <span className={`oc-agent-art oc-agent-art--${agent.id}`} aria-hidden="true">
              {agent.background && <img className="oc-agent-background" src={agent.background} alt="" draggable={false} />}
              <span className="oc-agent-avatar">
                <span className="oc-agent-icon"><img src={agent.icon} alt="" draggable={false} /></span>
                <img className="oc-agent-official" src={official} alt="" draggable={false} />
              </span>
            </span>
            <span className="oc-agent-name">{agent.name}</span>
            <span className="oc-agent-description">{agent.description}</span>
          </Button>
        </li>;
      })}
    </ul>
  </section>;
}
