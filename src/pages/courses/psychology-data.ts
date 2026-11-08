export type PsychologyMaterial = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  sections: { heading: string; body: string }[];
};

export type DueMaterial = { id: PsychologyMaterial['id']; title: string; due: string };

// Sample deadlines for the PSY201 course explorer.
export const dueMaterials: DueMaterial[] = [
  { id: 'attention', title: 'Attention and perception quiz', due: 'Due Nov 12 at 11:59pm' },
  { id: 'memory', title: 'Learning and memory response', due: 'Due Nov 15 at 11:59pm' },
];

// Sample course content for this static prototype.
export const psychologyMaterials: PsychologyMaterial[] = [
  { id: 'attention', title: 'Week 1 · Attention and perception', kind: 'Reading · 14 pages', summary: 'Explore how selective attention shapes what we notice and how we interpret sensory information.', sections: [
    { heading: 'Selective attention', body: 'Attention helps us prioritise information when the environment offers more than we can process at once. In a divided attention task, performance often drops as the demands of both tasks increase.' },
    { heading: 'Perception and expectation', body: 'Perception combines sensory input with prior knowledge. Expectations can help us interpret incomplete signals, but they can also introduce errors.' },
  ] },
  { id: 'memory', title: 'Week 2 · Learning and memory', kind: 'Lecture notes · 18 pages', summary: 'Compare working memory, long term memory, and the strategies that support retrieval.', sections: [
    { heading: 'Working memory', body: 'Working memory holds and manipulates information for a short period. Its limited capacity matters when following complex instructions or solving a problem.' },
    { heading: 'Retrieval practice', body: 'Trying to recall an idea can strengthen later access to it. Spacing practice over time helps reveal what still needs review.' },
  ] },
  { id: 'methods', title: 'Week 3 · Research methods', kind: 'Study guide · 9 pages', summary: 'Review experimental design, measurement, and how evidence supports a claim.', sections: [
    { heading: 'Designing a study', body: 'A clear research question identifies what will be measured and compared. Random assignment helps limit systematic differences between groups.' },
    { heading: 'Interpreting evidence', body: 'An association does not establish causation. Consider alternative explanations, sample size, and the limits of each method before drawing a conclusion.' },
  ] },
];
