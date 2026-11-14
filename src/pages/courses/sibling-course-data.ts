import type { DueMaterial, PsychologyMaterial } from './psychology-data';
import { mathematicsDueMaterials, mathematicsMaterials } from './mathematics-data';

export type SiblingCourseId = 'bio101' | 'mat203' | 'eng220';

type NotebookItem = { title: string; type: string };
type ResponseRule = { pattern: RegExp; answer: string };

export type SiblingCourse = {
  code: string;
  title: string;
  subject: string;
  materials: PsychologyMaterial[];
  coursework: DueMaterial[];
  notebookItems: NotebookItem[];
  initialNote: string;
  artifactIntro: string;
  artifactStages: [string, string, string];
  artifactIdea: string;
  artifactExercise: string;
  artifactComparison: [string, string][];
  replies: ResponseRule[];
  fallbackReply: string;
};

const biologyMaterials: PsychologyMaterial[] = [
  { id: 'cells', title: 'Week 1 · Cell structure and function', kind: 'Reading · 12 pages', summary: 'Explore how cell structures work together to support life.', sections: [
    { heading: 'Cell membranes', body: 'The plasma membrane forms a selective boundary around a cell. Proteins in the membrane help move materials in and out, keeping internal conditions suitable for cellular processes.' },
    { heading: 'Organelles and their roles', body: 'The nucleus stores genetic instructions, mitochondria release usable energy, and ribosomes assemble proteins. Comparing plant and animal cells shows how structure supports different needs.' },
  ] },
  { id: 'genetics', title: 'Week 2 · Genetics and inheritance', kind: 'Lecture notes · 16 pages', summary: 'Connect genes and alleles with patterns of inherited traits.', sections: [
    { heading: 'Genes and alleles', body: 'Genes are regions of DNA that contribute to traits. Alternative versions of a gene are alleles. An organism’s combination of alleles can influence its observable characteristics.' },
    { heading: 'Predicting inheritance', body: 'A Punnett square models possible allele combinations for a simple cross. It describes probability, not the guaranteed outcome for any individual offspring.' },
  ] },
  { id: 'ecology', title: 'Week 3 · Ecology and ecosystems', kind: 'Study guide · 10 pages', summary: 'Trace how organisms interact with one another and their environment.', sections: [
    { heading: 'Energy in ecosystems', body: 'Producers capture energy that moves through food webs as organisms eat and are eaten. Less energy is available at each higher level, which limits the size of populations.' },
    { heading: 'Changing conditions', body: 'Temperature, water, nutrients, and competition all affect where organisms thrive. A change to one population can alter several relationships in an ecosystem.' },
  ] },
];

const biologyCoursework: DueMaterial[] = [
  { id: 'cells', title: 'Cell structure lab', due: 'Due Nov 12 at 11:59pm' },
  { id: 'genetics', title: 'Inheritance practice quiz', due: 'Due Nov 16 at 11:59pm' },
];

const writingMaterials: PsychologyMaterial[] = [
  { id: 'questions', title: 'Week 1 · Research questions', kind: 'Reading · 11 pages', summary: 'Turn a broad topic into a focused, answerable research question.', sections: [
    { heading: 'Narrowing a topic', body: 'A useful research question names a specific issue, population, or setting. It leaves room for evidence and interpretation rather than inviting only a yes or no answer.' },
    { heading: 'Testing the scope', body: 'Check that the question can be explored with available sources and within the assignment length. Revise terms that are vague, too broad, or difficult to define.' },
  ] },
  { id: 'argument', title: 'Week 2 · Building an argument', kind: 'Lecture notes · 15 pages', summary: 'Use claims, reasons, and evidence to build a clear line of argument.', sections: [
    { heading: 'Claims and reasons', body: 'A thesis gives the reader a position to follow. Each paragraph should develop a reason that supports that position and connect it to the overall argument.' },
    { heading: 'Working with evidence', body: 'Introduce evidence, explain what it shows, and consider its limits. A quotation or statistic cannot make the connection to your claim on its own.' },
  ] },
  { id: 'revision', title: 'Week 3 · Revision and citation', kind: 'Study guide · 9 pages', summary: 'Revise for structure and clarity while crediting sources accurately.', sections: [
    { heading: 'Revision passes', body: 'Start by checking the overall argument and paragraph order. Then improve transitions, sentence clarity, and word choice. Proofreading works best after larger changes are complete.' },
    { heading: 'Using sources responsibly', body: 'Paraphrase ideas in your own language and cite the source. Check every quotation, paraphrase, and reference against the required citation style.' },
  ] },
];

const writingCoursework: DueMaterial[] = [
  { id: 'questions', title: 'Research question proposal', due: 'Due Nov 11 at 11:59pm' },
  { id: 'argument', title: 'Argument draft', due: 'Due Nov 18 at 11:59pm' },
];

export const siblingCourses: Record<SiblingCourseId, SiblingCourse> = {
  bio101: {
    code: 'BIO101', title: 'BIO101 · Foundations of Biology', subject: 'biology', materials: biologyMaterials, coursework: biologyCoursework,
    notebookItems: [
      { title: 'Cell structure study guide', type: 'Study guide' }, { title: 'Genetics lab summary', type: 'Research' },
      { title: 'Ecology review checklist', type: 'Checklist' }, { title: 'Organelles overview', type: 'Summary' }, { title: 'Biology revision plan', type: 'Plan' },
    ],
    initialNote: 'Compare the role of the cell membrane with two organelles. Add a labelled example from the Week 1 reading.',
    artifactIntro: 'How cell structures work together to keep an organism alive.',
    artifactStages: ['Environment', 'Cell membrane', 'Cell activity'],
    artifactIdea: 'A cell’s membrane regulates exchange with its surroundings while organelles carry out specialised work inside the cell.',
    artifactExercise: 'Sketch a cell and explain how a material enters, moves through, and is used by the cell. Check your explanation against the course reading.',
    artifactComparison: [['Rereading', 'Familiarity'], ['Labelling', 'Structure and function'], ['Self-testing', 'What you can explain']],
    replies: [
      { pattern: /cell|membrane|organelle/i, answer: 'start with the cell membrane as a selective boundary, then explain which organelles use the materials that enter the cell.' },
      { pattern: /gene|allele|inherit/i, answer: 'separate the gene from its alternative alleles, then use a simple cross to describe possible combinations rather than guaranteed outcomes.' },
      { pattern: /ecolog|ecosystem|food web/i, answer: 'trace energy from producers through consumers and consider how a change to one population affects the others.' },
    ],
    fallbackReply: 'identify the biological structure or process, describe its role, and connect it to a concrete example from the course material.',
  },
  mat203: {
    code: 'MAT203', title: 'MAT203 · Applied Statistics', subject: 'statistics', materials: mathematicsMaterials, coursework: mathematicsDueMaterials,
    notebookItems: [
      { title: 'Describing data study guide', type: 'Study guide' }, { title: 'Probability examples', type: 'Research' },
      { title: 'Hypothesis test checklist', type: 'Checklist' }, { title: 'Inference overview', type: 'Summary' }, { title: 'Statistics revision plan', type: 'Plan' },
    ],
    initialNote: 'Compare the mean and median of a data set, then explain which measure better describes its centre when outliers are present.',
    artifactIntro: 'How a sample becomes evidence for a statistical claim.',
    artifactStages: ['Sample', 'Statistic', 'Inference'],
    artifactIdea: 'A statistic summarises sample data. Its interpretation depends on the sampling method, variability, and the question being asked.',
    artifactExercise: 'Choose a small data set, calculate its mean and median, then explain how an outlier changes each measure.',
    artifactComparison: [['Mean', 'All values'], ['Median', 'Middle value'], ['IQR', 'Middle-half spread']],
    replies: [
      { pattern: /probab|independen|conditional/i, answer: 'list the possible outcomes first. For conditional probability, restrict the sample space to outcomes where the given condition holds.' },
      { pattern: /hypothes|p.value|significan/i, answer: 'state the null and alternative hypotheses, then interpret the p-value in relation to the null model. It is not the probability that the null hypothesis is true.' },
      { pattern: /mean|median|spread|data|outlier/i, answer: 'compare the mean and median to describe centre, then check the distribution and outliers before choosing a measure of spread.' },
    ],
    fallbackReply: 'write down what is known, choose a suitable statistical method, and explain the result in the context of the question.',
  },
  eng220: {
    code: 'ENG220', title: 'ENG220 · Academic Writing', subject: 'academic writing', materials: writingMaterials, coursework: writingCoursework,
    notebookItems: [
      { title: 'Research question worksheet', type: 'Study guide' }, { title: 'Source evaluation notes', type: 'Research' },
      { title: 'Revision checklist', type: 'Checklist' }, { title: 'Argument structure overview', type: 'Summary' }, { title: 'Writing plan', type: 'Plan' },
    ],
    initialNote: 'Draft a focused research question, then list two claims you could support with evidence from the Week 1 reading.',
    artifactIntro: 'How a focused question develops into a supported argument.',
    artifactStages: ['Question', 'Evidence', 'Argument'],
    artifactIdea: 'A strong paragraph makes a claim, supports it with relevant evidence, and explains how that evidence advances the overall argument.',
    artifactExercise: 'Take one paragraph from your draft. Underline the claim, highlight the evidence, and add a sentence explaining the connection between them.',
    artifactComparison: [['Planning', 'Argument structure'], ['Revising', 'Clarity and flow'], ['Proofreading', 'Surface errors']],
    replies: [
      { pattern: /question|topic|scope/i, answer: 'narrow the topic to a specific issue and check that the question can be answered with available sources and space.' },
      { pattern: /argument|thesis|claim|evidence/i, answer: 'state a clear claim, add a reason and relevant evidence, then explain how the evidence supports the claim.' },
      { pattern: /citat|source|paraphras|revis/i, answer: 'revise the argument and paragraph order first, then check that every quotation and paraphrase is credited in the required style.' },
    ],
    fallbackReply: 'identify the main claim, organise the supporting reasons, and check each paragraph against the assignment brief.',
  },
};

export function siblingSampleReply(course: SiblingCourse, question: string, sourceTitle?: string) {
  const context = sourceTitle ? `Using ${sourceTitle} as context, ` : 'For this course, ';
  const answer = course.replies.find(rule => rule.pattern.test(question))?.answer ?? course.fallbackReply;
  return `${context}${answer} This is a sample local response; no AI service is connected.`;
}
