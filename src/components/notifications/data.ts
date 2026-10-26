export type NotificationScope = 'me' | 'admin';
export type NotificationType = 'content-filter' | 'user-budget' | 'message-feedback' | 'moderation' | 'model-availability' | 'budget-threshold' | 'model-fallback' | 'release';

export const notificationTypes: Record<NotificationType, string> = {
  'content-filter': 'Content filter alerts',
  'user-budget': 'Users running out of budget',
  'message-feedback': 'Message feedback submission',
  moderation: 'Report moderation',
  'model-availability': 'Model availability changes',
  'budget-threshold': 'Budget usage thresholds',
  'model-fallback': 'AI model fallbacks',
  release: 'Release note links',
};

export interface NotificationItem {
  id: string;
  type: NotificationType;
  scope: NotificationScope;
  title: string;
  time: string;
  initialRead: boolean;
  person?: { name: string; initials: string };
  details: string;
  context: { label: string; value: string }[];
  nextStep: string;
}

// Fixed, fictional events for the local demo, dated 26 October 2026.
export const demoNotifications: NotificationItem[] = [
  { id: 'filter-1026', type: 'content-filter', scope: 'admin', title: 'A content filter blocked a Research Assistant response', time: '2 min ago', initialRead: false,
    details: 'A response triggered the workspace safety filter and was withheld. The user was shown a safe alternative. This example contains no original conversation or sensitive content.',
    context: [{ label: 'Agent', value: 'Research Assistant' }, { label: 'Category', value: 'Potentially harmful content' }, { label: 'Outcome', value: 'Response blocked' }],
    nextStep: 'Review the filter category and your workspace guidelines before deciding whether a policy change is needed.' },
  { id: 'budget-80', type: 'budget-threshold', scope: 'me', title: 'You’ve used 80% of your monthly AI budget', time: '8 min ago', initialRead: false,
    details: 'Your personal AI usage reached the 80% notification threshold. You can continue chatting with the remaining allowance.',
    context: [{ label: 'Usage', value: '$40 of $50' }, { label: 'Remaining', value: '$10' }, { label: 'Resets', value: '1 November 2026' }],
    nextStep: 'Use a lighter model for routine questions to make the remaining budget last longer.' },
  { id: 'fallback-1026', type: 'model-fallback', scope: 'me', title: 'Your conversation switched to a backup model', time: '24 min ago', initialRead: false,
    details: 'The selected model was temporarily unavailable. A backup model continued the conversation so the request could complete. This is a simulated event; no model call was made.',
    context: [{ label: 'Requested model', value: 'GPT 5.1' }, { label: 'Backup model', value: 'GPT 5 mini' }, { label: 'Conversation', value: 'Plan a literature review' }],
    nextStep: 'Check the model selector before your next message if you want to switch back.' },
  { id: 'feedback-1026', type: 'message-feedback', scope: 'admin', title: 'Harry Smith submitted feedback on an agent response', time: '1 hour ago', initialRead: true, person: { name: 'Harry Smith', initials: 'H' },
    details: 'Harry marked a Library Guide answer as unhelpful and noted that one of the suggested sources was not available through the university library.',
    context: [{ label: 'Agent', value: 'Library Guide' }, { label: 'Rating', value: 'Needs improvement' }, { label: 'Feedback', value: 'Suggested source was unavailable' }],
    nextStep: 'Review the agent’s source guidance and check that the linked library resources are up to date.' },
  { id: 'user-budget-1026', type: 'user-budget', scope: 'admin', title: 'Sarah Chen has 5% of her monthly budget remaining', time: '2 hours ago', initialRead: true, person: { name: 'Sarah Chen', initials: 'S' },
    details: 'Sarah’s usage is close to her assigned monthly allowance. Her access is still active; it will pause at the limit unless her allocation changes.',
    context: [{ label: 'User', value: 'Sarah Chen' }, { label: 'Usage', value: '$47.50 of $50' }, { label: 'Remaining', value: '$2.50' }],
    nextStep: 'Discuss the user’s needs before changing the allocation in the full product. Budget management is not connected in this demo.' },
  { id: 'moderation-1026', type: 'moderation', scope: 'admin', title: 'A reported response is waiting for moderation', time: '3 hours ago', initialRead: true,
    details: 'A user reported an Academic Advisor response as inaccurate. It has been added to the moderation queue for a human review. No moderation decision has been made.',
    context: [{ label: 'Report', value: 'MOD-1042' }, { label: 'Reason', value: 'Inaccurate course information' }, { label: 'Status', value: 'Awaiting review' }],
    nextStep: 'Compare the response with the current course handbook. The report and review queue shown here are sample data.' },
  { id: 'model-new', type: 'model-availability', scope: 'admin', title: 'A new model is available for your workspace', time: 'Yesterday', initialRead: true,
    details: 'The demo model catalog now includes GPT 5 mini as an option for lighter tasks. Workspace administrators can evaluate a new model before making it available to users.',
    context: [{ label: 'Model', value: 'GPT 5 mini' }, { label: 'Change', value: 'Newly available in the demo catalog' }, { label: 'Access', value: 'Not enabled automatically' }],
    nextStep: 'Evaluate quality, usage, and cost before changing an agent’s model. Availability is fictional demo data, not a live provider announcement.' },
  { id: 'model-retiring', type: 'model-availability', scope: 'admin', title: 'The legacy chat model is being deprecated', time: 'Yesterday', initialRead: true,
    details: 'A legacy model in the demo catalog is scheduled for retirement. Agents using it will need a replacement before the retirement date.',
    context: [{ label: 'Model', value: 'Legacy chat model' }, { label: 'Retirement date', value: '30 November 2026 · Demo date' }, { label: 'Affected agents', value: '2 demo agents' }],
    nextStep: 'Test a replacement with representative prompts, then update affected agents. No actual provider retirement is implied.' },
  { id: 'release-1026', type: 'release', scope: 'me', title: 'What’s new: a clearer notification center', time: '2 days ago', initialRead: true,
    details: 'Read the prototype release notes for personal and admin inboxes, read/unread controls, and notification preferences.',
    context: [{ label: 'Release', value: 'October 2026 prototype update' }, { label: 'Published', value: '24 October 2026 · Demo release' }],
    nextStep: 'Open the local release notes to explore what changed.' },
];
