# N1 accessibility review guide

> **Proposed operational standard:** Use WCAG 2.2 AA as a sensible design and acceptance target unless an official N1 standard specifies otherwise. This file does not assert audited product compliance.

## Core requirements
- Check text contrast: typically at least 4.5:1 for normal text and 3:1 for large text under WCAG AA, with the standard's exceptions.
- Check non-text UI indicator and component-boundary contrast of at least 3:1 where required.
- Support keyboard operation, visible keyboard focus, predictable navigation, and appropriate semantics/accessible names.
- Make touch targets practical; WCAG 2.2 target size (minimum) is generally 24×24 CSS px or sufficient spacing, subject to exceptions. Prefer larger touch targets for mobile.
- Never communicate status through colour alone; supplement with text/icon/shape where meaningful.
- Associate form labels, instructions, validation and errors with controls; preserve user entries on failures when feasible.
- Announce important asynchronous updates without intrusive focus shifts; manage dialogs and menus correctly.
- Offer reduced-motion adaptations; avoid animation required to understand the task.
- Confirm accessibility for voice entry/exit and transcription alternatives.

## AI-specific checks
- Identify AI-generated material and important uncertainty clearly.
- Communicate generation progress, interruptibility and completion without excessive announcement noise.
- Ensure agent-selection controls, chips and prompt attachments work with keyboard and screen reader.
- Make model changes, contextual data sharing and tool actions understandable before consequential operations.
- Consider long responses: headings, list structure, source links, copy controls and reading order.

## Testing protocol
Use keyboard-only testing, browser accessibility tree/screen reader checks, contrast evaluation, zoom and narrow viewport testing. Report issues with reproduction steps, impact, criterion (if confidently applicable) and remediation. Do not claim WCAG compliance on visual review alone.
