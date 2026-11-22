export type DashboardChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

export type DashboardConversation = {
  id: string;
  title: string;
  messages: DashboardChatMessage[];
  kind: 'sample' | 'session';
  updatedLabel: string;
};

// Example history for the static dashboard. These questions and times are demonstration data.
const examples = [
  ["What's changed in the last 30 days?", 'just now', 'The sample dashboard shows monthly active users at 1,233 (+35.2%), conversations at 123,456 (+22.1%), and token consumption at 12,345,689 (+3.5%) versus the previous 30 days.'],
  ['How many conversations were started?', '2 minutes ago', 'The sample dashboard records 123,456 conversations in the last 30 days, up 22.1% from the previous period.'],
  ['Which agents are most popular?', '4 minutes ago', 'Agent-level popularity is not available in this sample view. The dashboard shows 123,456 total conversations, but does not rank individual agents.'],
  ['How has token consumption changed?', '5 minutes ago', 'Token consumption is 12,345,689 in the sample dashboard, up 3.5% compared with the previous 30 days.'],
  ['What is the daily active user trend?', '6 minutes ago', 'The sample dashboard shows 45 daily active users, down 4.8% from the previous period.'],
  ['How many users signed up?', '8 minutes ago', 'The weekly insight says new signups are rising. This sample view does not include an exact signup count.'],
  ['Compare monthly and daily active users', '15 minutes ago', 'The sample dashboard shows 1,233 monthly active users and 45 daily active users. These are different time windows, so compare their trends rather than treating them as equivalent counts.'],
  ['Which models use the most tokens?', '30 minutes ago', 'This sample dashboard does not include a model-by-model token breakdown. Open Model Usage when that reporting view is available.'],
  ['How many inactive users do we have?', '45 minutes ago', 'The weekly insight calls out inactive users for review, but the sample overview does not provide a verified total.'],
  ['How has activation changed?', '1 hour ago', 'The weekly insight flags activation for review. The current sample overview does not include an activation-rate metric.'],
  ["Summarize this month's key metrics", '2 hours ago', 'The sample dashboard shows 8,950 total accounts, 1,233 monthly active users, 45 daily active users, 123,456 conversations, and 12,345,689 tokens consumed.'],
] as const;

export const sampleConversations: DashboardConversation[] = examples.map(([title, updatedLabel, answer], index) => ({
  id: `example-${index}`,
  title,
  updatedLabel,
  kind: 'sample',
  messages: [
    { id: `example-${index}-question`, role: 'user', text: title },
    { id: `example-${index}-answer`, role: 'assistant', text: answer },
    ...(index === 0 ? [
      { id: 'example-0-follow-up', role: 'user' as const, text: 'What should I look at next?' },
      { id: 'example-0-follow-up-answer', role: 'assistant' as const, text: 'Start with the drop in daily active users: 45 users, down 4.8%. Then compare activation and inactive-user cohorts in a more detailed report. This prototype only shows sample summary figures, so it cannot identify the cause of the change.' },
    ] : []),
  ],
}));
