import { createContext, useContext, useState, type ReactNode } from 'react';
import { campusAgent, chatAgents, type ChatAgent } from './agent-data';
import type { Conversation } from './data';

type Collection = 'recent' | 'pinned';
interface AgentNavigationState {
  agent: ChatAgent;
  setAgent: (agent: ChatAgent) => void;
  collection: Collection;
  setCollection: (collection: Collection) => void;
  pinned: string[];
  togglePinned: (id: string) => void;
  agents: ChatAgent[];
  pendingConversation: Conversation | null;
  setPendingConversation: (conversation: Conversation | null) => void;
}

const AgentNavigationContext = createContext<AgentNavigationState | null>(null);

// Keep the selection and pins consistent between both chat routes and mobile sheets.
// This is session-only demonstration state; nothing is sent or persisted.
export function AgentNavigationProvider({ children }: { children: ReactNode }) {
  const [agent, setSelectedAgent] = useState(campusAgent);
  const [agents, setAgents] = useState(chatAgents);
  const [pendingConversation, setPendingConversation] = useState<Conversation | null>(null);
  const setAgent = (next: ChatAgent) => {
    setSelectedAgent(next);
    if (next.id !== campusAgent.id) setAgents(items => items.some(item => item.id === next.id)
      ? items.map(item => item.id === next.id ? next : item)
      : [next, ...items]);
  };
  const [collection, setCollection] = useState<Collection>('recent');
  const [pinned, setPinned] = useState(['phoenix', 'lyra', 'cassiopeia']);
  const togglePinned = (id: string) => setPinned(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);

  return <AgentNavigationContext.Provider value={{ agent, setAgent, collection, setCollection, pinned, togglePinned, agents, pendingConversation, setPendingConversation }}>
    {children}
  </AgentNavigationContext.Provider>;
}

export function useAgentNavigation() {
  const context = useContext(AgentNavigationContext);
  if (!context) throw new Error('Agent navigation must be inside AgentNavigationProvider.');
  return context;
}
