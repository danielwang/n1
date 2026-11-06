import { materialBody, materials } from './course-workspace-data';

export type StudyOutput = 'guide' | 'summary' | 'practice';
export type SourceReference = { materialId: string; sectionIndex: number };

export const outputOptions: { id: StudyOutput; title: string; description: string }[] = [
  { id: 'guide', title: 'Study guide', description: 'Key ideas and a short review plan' },
  { id: 'summary', title: 'Summary', description: 'A concise overview of selected material' },
  { id: 'practice', title: 'Practice questions', description: 'Questions to check your understanding' },
];

export const outputName = (type: StudyOutput) => outputOptions.find(option => option.id === type)?.title || 'Study guide';

export function makeStudyOutput(type: StudyOutput, sourceIds: string[]) {
  const sources = sourceIds.map(id => ({ material: materials.find(item => item.id === id), body: materialBody[id] })).filter(item => item.material && item.body);
  const sourceLine = `Sources: ${sources.map(item => item.material!.title).join(' · ')}`;
  if (type === 'practice') return `${outputName(type)} · BIO101\n${sourceLine}\n\n${sources.flatMap(({ body }) => body.sections.slice(0, 2).map(section => section)).map((section, index) => `${index + 1}. Explain ${section.title.replace(/^\d+(\.\d+)? · /, '').toLowerCase()} in your own words.\n   Check the original section after answering.`).join('\n\n')}\n\nThese are sample questions for self-study, not a course assessment.`;
  if (type === 'summary') return `${outputName(type)} · BIO101\n${sourceLine}\n\n${sources.map(({ body }) => `${body.heading}\n${body.intro}\n${body.sections.map(section => `• ${section.title}: ${section.text}`).join('\n')}`).join('\n\n')}\n\nReview the original materials before using this summary for coursework.`;
  return `${outputName(type)} · BIO101\n${sourceLine}\n\nKey ideas\n${sources.map(({ body }) => `• ${body.heading}: ${body.intro}`).join('\n')}\n\nReview plan\n${sources.flatMap(({ body }) => body.sections.slice(0, 2).map(section => `• Revisit ${section.title} and explain it without looking.`)).join('\n')}\n\nCheck each point against the source material.`;
}

export function refineStudyOutput(text: string, request: string, type: StudyOutput, sourceIds: string[], revision: number) {
  const lower = request.toLowerCase();
  if (/short|brief|concise/.test(lower)) {
    const shorter = makeStudyOutput(type, sourceIds).split('\n').filter(line => !line.startsWith('   Check') && line.length < 180).join('\n');
    return `${shorter}\n\nRevision ${revision}: shortened for quick review.`;
  }
  if (/question|quiz|practice/.test(lower)) {
    const section = materialBody[sourceIds[0]]?.sections[0];
    return `${text}\n\nRevision ${revision} · More practice\n• What is the main idea of ${section?.title || 'this topic'}?\n• How would you apply it to a new example?`;
  }
  const answer = makeDemoAnswer(request, sourceIds);
  return `${text}\n\nRevision ${revision} · ${request}\n${answer.text.replace('This is an illustrative local demo answer. Check the linked sections for the full context.', '').trim()}`;
}

export function makeDemoAnswer(question: string, sourceIds: string[]): { text: string; references: SourceReference[] } {
  if (!sourceIds.length) return { text: 'Start with one course material, or ask a general question. Select sources in Materials to get a course-grounded demo answer.', references: [] };
  const query = question.toLowerCase();
  const references = sourceIds.map(materialId => {
    const sections = materialBody[materialId]?.sections || [];
    const matches = sections.map((section, index) => ({ index, score: `${section.title} ${section.text}`.toLowerCase().split(/\W+/).filter(word => word.length > 4 && query.includes(word)).length }));
    const sectionIndex = matches.sort((a, b) => b.score - a.score)[0]?.index || 0;
    return { materialId, sectionIndex };
  }).filter(reference => materialBody[reference.materialId]);
  const details = references.map(reference => {
    const section = materialBody[reference.materialId].sections[reference.sectionIndex];
    return `${section.title}: ${section.text}`;
  });
  const lead = references.length > 1 ? 'Across the selected materials, these points connect:' : 'In the selected course material:';
  return { text: `${lead}\n${details.map((detail, index) => `${index + 1}. ${detail}`).join('\n')}\n\nThis is an illustrative local demo answer. Check the linked sections for the full context.`, references };
}
