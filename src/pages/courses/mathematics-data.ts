import type { CourseMaterial, DueMaterial } from './psychology-data';

// Sample course files and deadlines for the static MAT203 workspace.
export const mathematicsDueMaterials: DueMaterial[] = [
  { id: 'describing-data', title: 'Describing data problem set', due: 'Due Nov 13 at 11:59pm' },
  { id: 'probability', title: 'Probability practice quiz', due: 'Due Nov 17 at 11:59pm' },
];

export const mathematicsMaterials: CourseMaterial[] = [
  { id: 'describing-data', title: 'Week 1 · Describing data', kind: 'Lecture notes · 16 pages', summary: 'Summarise a data set with suitable measures and see how a visualisation can reveal its shape.', sections: [
    { heading: 'Centre and spread', body: 'The mean uses every value, while the median identifies the middle of an ordered data set. Compare both when values are skewed or contain outliers. The interquartile range describes the spread of the middle half.' },
    { heading: 'Choosing a display', body: 'Histograms show the distribution of a quantitative variable. Box plots make the median, quartiles, and possible outliers easier to compare across groups. Always label the variable and its units.' },
  ] },
  { id: 'probability', title: 'Week 2 · Probability', kind: 'Reading · 12 pages', summary: 'Use probability rules to reason about events, independence, and conditional information.', sections: [
    { heading: 'Events and probability', body: 'An event is a set of possible outcomes. Probabilities range from 0 to 1, and the probabilities of all outcomes in a sample space add to 1. A tree diagram can make a sequence of events easier to follow.' },
    { heading: 'Conditional probability', body: 'Conditional probability updates the chance of an event when another event is known. Independence means that knowing one event does not change the probability of the other.' },
  ] },
  { id: 'inference', title: 'Week 3 · Inference and testing', kind: 'Study guide · 10 pages', summary: 'Connect samples to populations and interpret the evidence from a hypothesis test.', sections: [
    { heading: 'Sampling and uncertainty', body: 'A statistic calculated from a sample estimates a population value. Sampling variability means that another sample could produce a different estimate. A confidence interval describes a range of plausible values under the method used.' },
    { heading: 'Testing a claim', body: 'State the null and alternative hypotheses before examining the result. A p-value describes how surprising the observed data would be if the null model were true; it is not the probability that the null hypothesis is true.' },
  ] },
];
