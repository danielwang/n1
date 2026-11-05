export type Material = {
  id: string;
  title: string;
  kind: 'reading' | 'slides' | 'lab' | 'quiz';
  module: string;
  detail: string;
};

export const materials: Material[] = [
  { id: 'syllabus', title: 'Course syllabus', kind: 'reading', module: 'Course info', detail: 'Overview · Fall 2026' },
  { id: 'cell-reading', title: 'Chapter 2 · Cell structure', kind: 'reading', module: 'Week 2 · Cell structure', detail: 'Reading · 12 pages' },
  { id: 'cell-slides', title: 'Cell structure lecture slides', kind: 'slides', module: 'Week 2 · Cell structure', detail: 'Slides · 24 pages' },
  { id: 'cell-lab', title: 'Lab 2 · Exploring cells', kind: 'lab', module: 'Week 2 · Cell structure', detail: 'Lab · due Friday' },
  { id: 'genetics-reading', title: 'Chapter 5 · Inheritance', kind: 'reading', module: 'Week 3 · Genetics', detail: 'Reading · 16 pages' },
  { id: 'genetics-quiz', title: 'Quiz 3 · Mendelian genetics', kind: 'quiz', module: 'Week 3 · Genetics', detail: 'Quiz · due next Tuesday' },
];

export const materialBody: Record<string, { eyebrow: string; heading: string; intro: string; sections: { title: string; text: string }[] }> = {
  syllabus: { eyebrow: 'BIO101 / FALL 2026', heading: 'Foundations of Biology', intro: 'Explore the structures and processes that make life possible, from individual cells to ecosystems.', sections: [
    { title: 'What you will learn', text: 'By the end of the course, you should be able to explain how cells function, describe basic patterns of inheritance, and connect organisms with their environments.' },
    { title: 'How the course works', text: 'Weekly readings and slides prepare you for labs and practice quizzes. Use the materials in this workspace to review concepts and plan your study.' },
    { title: 'Assessment', text: 'Labs, quizzes, and a final project provide opportunities to apply what you learn. Dates and progress shown here are sample data for this prototype.' },
  ] },
  'cell-reading': { eyebrow: 'CHAPTER 02 / FOUNDATIONS', heading: 'The structure of a cell', intro: 'Cells are the smallest units of life. Their internal structures work together to obtain energy, build molecules, and respond to the environment.', sections: [
    { title: '2.1 · The cell membrane', text: 'The plasma membrane forms a selective boundary around the cell. Its phospholipid bilayer allows some substances to pass while proteins help move others across. This regulation keeps the internal environment stable.' },
    { title: '2.2 · Organelles and their roles', text: 'Eukaryotic cells contain specialised compartments. The nucleus stores genetic instructions, mitochondria release usable energy, and ribosomes assemble proteins. Each structure contributes to the cell as a whole.' },
    { title: '2.3 · Looking closer', text: 'A light microscope reveals cell shape and larger structures. Electron microscopes show much finer detail, including membrane systems and the arrangement of organelles.' },
  ] },
  'cell-slides': { eyebrow: 'LECTURE / WEEK 02', heading: 'Cell structure and function', intro: 'Today’s question: how does the organisation of a cell support the work it needs to do?', sections: [
    { title: 'The big picture', text: 'All cells share a membrane, cytoplasm, and genetic material. Prokaryotic and eukaryotic cells differ in how that material and their internal structures are organised.' },
    { title: 'From structure to function', text: 'Compare the nucleus, mitochondria, chloroplasts, and vacuoles. Consider which structures you would expect to find in a cell with a particular job.' },
  ] },
  'cell-lab': { eyebrow: 'PRACTICAL / WEEK 02', heading: 'Lab 2 · Exploring cells', intro: 'Use prepared slides to compare plant and animal cells. Record observations before drawing conclusions.', sections: [
    { title: 'Before you begin', text: 'Review microscope handling and identify the objective lenses. Start on the lowest magnification, then move to higher magnification when the sample is in focus.' },
    { title: 'What to submit', text: 'Submit two labelled drawings and a short comparison of visible cell structures. Include magnification and one limitation of your observations.' },
  ] },
  'genetics-reading': { eyebrow: 'CHAPTER 05 / INHERITANCE', heading: 'How traits are inherited', intro: 'Inheritance connects the genetic information passed between generations with the traits we can observe.', sections: [
    { title: 'Genes and alleles', text: 'A gene is a region of DNA that contributes to a trait. Different versions of a gene are called alleles. An organism’s combination of alleles helps determine its phenotype.' },
    { title: 'Patterns of inheritance', text: 'Punnett squares model the probability of allele combinations. They are useful for simple crosses, but many real traits involve multiple genes and environmental effects.' },
  ] },
  'genetics-quiz': { eyebrow: 'PRACTICE / WEEK 03', heading: 'Quiz 3 · Mendelian genetics', intro: 'Check your understanding of genes, alleles, and simple inheritance patterns.', sections: [
    { title: 'Topics covered', text: 'Distinguish genotype from phenotype, identify dominant and recessive alleles, and predict outcomes for a single-gene cross.' },
    { title: 'Before attempting', text: 'Review the chapter examples and practise drawing a Punnett square. This prototype shows the quiz brief only; it does not submit answers.' },
  ] },
};
