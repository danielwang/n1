export interface Conversation {
  id: string;
  title: string;
  group: 'Today' | 'Previous 7 days';
  prompt: string;
  archived?: boolean;
}

// Local demonstration content replaces the reference's lorem ipsum titles.
export const conversations: Conversation[] = [
  { id: 'research', title: 'Plan a literature review', group: 'Today', prompt: 'Help me plan a literature review for my research project.' },
  { id: 'lecture', title: 'Summarise my lecture notes', group: 'Today', prompt: 'Help me turn my lecture notes into a concise study guide.' },
  { id: 'proposal', title: 'Refine my research proposal', group: 'Today', prompt: 'What should I consider when refining my research proposal?' },
  { id: 'sources', title: 'Compare primary and secondary sources', group: 'Today', prompt: 'Explain the difference between primary and secondary sources.' },
  { id: 'revision', title: 'Build a revision timetable', group: 'Today', prompt: 'Help me build a manageable revision timetable.' },
  { id: 'feedback', title: 'Review my essay structure', group: 'Today', prompt: 'What makes a clear and persuasive essay structure?' },
  { id: 'methods', title: 'Explore qualitative research methods', group: 'Previous 7 days', prompt: 'Compare common qualitative research methods.' },
  { id: 'citations', title: 'Understand citation styles', group: 'Previous 7 days', prompt: 'Help me understand when to use different citation styles.' },
  { id: 'presentation', title: 'Prepare for a seminar presentation', group: 'Previous 7 days', prompt: 'Help me prepare for a seminar presentation.' },
  { id: 'data', title: 'Interpret survey findings', group: 'Previous 7 days', prompt: 'What should I look for when interpreting survey findings?' },
  { id: 'questions', title: 'Develop interview questions', group: 'Previous 7 days', prompt: 'Help me develop open-ended research interview questions.' },
  { id: 'reading', title: 'Organise this week’s reading', group: 'Previous 7 days', prompt: 'Help me organise my reading for this week.' },
  { id: 'archive', title: 'First-year study planning', group: 'Previous 7 days', prompt: 'Help me plan my first year of study.', archived: true },
];
