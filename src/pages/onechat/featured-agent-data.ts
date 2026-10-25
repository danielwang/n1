import research from '../../assets/onechat/featured/research.svg';
import library from '../../assets/onechat/featured/library.png';
import admissions from '../../assets/onechat/featured/admissions.svg';
import academic from '../../assets/onechat/featured/academic.png';
import campus from '../../assets/onechat/featured/campus.png';
import admissionsBackground from '../../assets/onechat/featured/admissions-background.png';
import advisorBackground from '../../assets/onechat/featured/advisor-background.png';

export interface FeaturedAgent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  background?: string;
}

// Figma artwork and names; meaningful copy replaces placeholder descriptions.
export const featuredAgents: FeaturedAgent[] = [
  { id: 'research', name: 'Research Assistant', description: 'Explore ideas and sources.', prompt: 'Help me find and evaluate sources for my research project.', icon: research },
  { id: 'library', name: 'Library Guide', description: 'Find your next great source.', prompt: 'Help me find library resources for my next assignment.', icon: library },
  { id: 'admissions', name: 'Admissions Advisor', description: 'Plan your application.', prompt: 'Help me understand the university application process.', icon: admissions, background: admissionsBackground },
  { id: 'academic', name: 'Academic Advisor', description: 'Make a plan for your studies.', prompt: 'Help me plan my courses and academic goals for this semester.', icon: academic, background: advisorBackground },
  { id: 'campus', name: 'Campus Guide', description: 'Discover life on campus.', prompt: 'Help me explore campus facilities and student services.', icon: campus, background: advisorBackground },
];
