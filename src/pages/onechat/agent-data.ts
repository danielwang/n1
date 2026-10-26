import aquila from '../../assets/onechat/agent/aquila.svg';
import phoenix from '../../assets/onechat/agent/phoenix.svg';
import pegasus from '../../assets/onechat/agent/pegasus.svg';
import draco from '../../assets/onechat/agent/draco.svg';
import lyra from '../../assets/onechat/agent/lyra.png';
import cassiopeia from '../../assets/onechat/agent/cassiopeia.png';
import centaurus from '../../assets/onechat/agent/centaurus.png';
import andromeda from '../../assets/onechat/agent/andromeda.svg';
import compass from '../../assets/onechat/agent/compass.svg';
import campus from '../../assets/onechat/agent/campus.svg';
import officialSmall from '../../assets/onechat/agent/official-small.svg';
import officialLarge from '../../assets/onechat/agent/official-large.svg';
import prompt from '../../assets/onechat/agent/prompt.svg';
import starter from '../../assets/onechat/agent/starter.svg';
import next from '../../assets/onechat/agent/next.svg';
import guideline from '../../assets/onechat/agent/guideline.svg';
import send from '../../assets/onechat/agent/send.svg';
import dots from '../../assets/onechat/agent/dots.svg';

export const agentAssets = { officialSmall, officialLarge, prompt, starter, next, guideline, send, dots };
export type ChatAgent = { id: string; name: string; icon: string; official?: boolean; iconSize?: 36; art?: 'lyra' | 'cassiopeia' | 'centaurus' };
export const campusAgent: ChatAgent = { id: 'campus', name: 'AQUA Campus Info', icon: campus, official: true };
export const chatAgents: ChatAgent[] = [
  { id: 'aquila', name: 'Aquila Dashboard', icon: aquila },
  { id: 'phoenix', name: 'Phoenix Framework', icon: phoenix, official: true },
  { id: 'pegasus', name: 'Pegasus Suite', icon: pegasus },
  { id: 'draco', name: 'Draco Library', icon: draco },
  { id: 'lyra', name: 'Lyra Platform', icon: lyra, official: true, art: 'lyra' },
  { id: 'cassiopeia', name: 'Cassiopeia Interface', icon: cassiopeia, official: true, art: 'cassiopeia' },
  { id: 'centaurus', name: 'Centaurus Kit', icon: centaurus, art: 'centaurus' },
  { id: 'andromeda', name: 'Andromeda Explorer', icon: andromeda },
  { id: 'compass', name: 'Compass Explorer', icon: compass },
];
export const chatStarters = [
  { title: 'Code Optimization', prompt: 'How can I optimize my code for faster execution and reduced memory usage?' },
  { title: 'Explain It Like I’m New', prompt: 'Explain a complex topic in simple terms, with a practical example I can follow.' },
  { title: 'Debugging Strategies', prompt: 'Can you guide me through debugging a complex algorithm with multiple nested loops?' },
  { title: 'Recursion Explained', prompt: 'I’m struggling with understanding recursion. Can you provide a simple example?' },
];
