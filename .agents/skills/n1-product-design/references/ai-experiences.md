# N1 AI experience patterns

> Synthesized from prior N1 product discussions. These are **context-based**, and some are design explorations rather than shipped requirements.

## Agent creation and setup
- Previous workflow explored an eight-step agent creation process, naming early, grouping steps and reducing unnecessary friction.
- Evaluate progressive disclosure and optional/skippable configuration against the user's job.
- Show what is required to activate an agent versus what can be edited later. Never imply unverified publishing rules.

## Agent collaboration
- Higher-ed scenarios may involve course-related, institutional and personal agents.
- Clarify agents' identities, scope, allowed data and distinct responsibilities.
- Preserve explicit user control over selection; show active agents during the conversation.
- Test when suggestions should appear (especially first turn) and when extra agent selection becomes distracting.

## Memory and context
- Prior design discussions covered user memories: facts, episodes and profile summaries.
- Allow users to understand, inspect, correct and delete appropriate saved context, subject to actual product permissions.
- Explain whether a change affects the current response, future conversations or organization-managed knowledge.
- Do not conflate personal memory with project/course resources or uploaded files.

## Voice and mobile
- Prior N1 direction explored voice mode as the mobile default and a voice style selector.
- Treat voice-first mobile as a working product direction, not a verified shipped default.
- Preserve visible controls for stop, switch to text, retry, audio permissions and confirmation.
- Design meaningful feedback for recording, processing, speaking and interruption.

## Notifications
- Prior work considered persona-specific notifications and an admin notification centre.
- Prioritize actionable content, clear destination, read/unread semantics and meaningful grouping.
- Distinguish user-facing chat notifications from operational admin alerts.

## AI trust and agency checklist
For each AI feature: identify inputs, model or agent choice, context/data boundaries, permissions, generation vs execution, previews/confirmations, cancellation, fallback, transparency, human correction and accessibility.
