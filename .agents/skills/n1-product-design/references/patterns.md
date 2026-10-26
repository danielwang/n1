# N1 interaction patterns

> **Context-based decisions and proposed checks**, not an approved component specification.

## Chat composition
- Keep compose field and relevant model/agent context discoverable without overloading the area.
- For suggested prompts, earlier N1 discussion preferred initial-turn display rather than repetition throughout a thread; verify current product decision.
- When switching context or agents, make the change and persistence visible.

## Multiple agents
- N1 explored adding more than one agent to a conversation, including personal and official agents in university scenarios.
- Use persistent, removable agent pills/chips when appropriate. Explain which agents are active and how to remove them.
- Consider clarifying individual vs collective responses and how the user directs an agent.
- Do not assume permissions or default agent count without current requirements.

## Settings and persistence
- Prior discussions explored Save / Confirm / Cancel / Reset, with a desire for consistent CTA policy.
- Choose explicit save vs autosave based on reversibility, risk, visibility and product decisions; avoid silently mixing models.
- Mark unsaved changes, saving status, success and validation in an appropriate manner.

## Navigation
- Give each page a meaningful title and clear purpose.
- Distinguish admin navigation from everyday chat tasks.
- Avoid assuming full admin functionality is required on mobile.

## Content, attachments and sharing
- Be explicit about scope, recipients, roles and permissions before sharing.
- Provide sensible confirmation for consequential access changes, plus recovery where possible.
- Handle upload, unavailable content, permissions and expiration states.

## Responsive behaviour
- Prior discussion treated chat as responsive and admin as potentially desktop-optimized.
- Use touch-friendly controls and small-screen information hierarchy; for complex admin tasks consider supported-device guidance rather than broken forced layouts.
