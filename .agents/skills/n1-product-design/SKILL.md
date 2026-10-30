---
name: n1-product-design
description: Apply nebulaONE product and visual design conventions to UX strategy, feature design, interaction patterns, personas, UX writing, accessibility reviews, Figma-to-code workflows, and frontend UI implementation. Use for N1 designs, design critiques, agent and chat experiences, admin workflows, mobile and voice interfaces, design-system documentation, and AI-generated prototypes. Consult task-specific reference files, distinguish established decisions from proposals, and verify tokens against the authoritative Figma or code library.
---

# N1 Product Design

## Mission
Create and critique N1 experiences that feel familiar, support human agency, and make AI understandable. Treat this package as a **working knowledge snapshot**, not a substitute for current product requirements, Figma variables, design system source, or research.

## Sources and precedence
1. Follow the user's current explicit requirements and current verified N1 specifications.
2. Use connected official Figma / source-code design-system definitions for exact tokens, component APIs and states.
3. Apply established N1 decisions documented in references; label them **Context-based** until confirmed against source documents.
4. Treat anything tagged **Proposed** as a design recommendation, not an approved policy.
5. If sources conflict, show the conflict and request a decision only when it blocks the deliverable. Never invent research findings, token values or approved flows.

## Workflow
1. Classify the task: UX strategy, flow, visual design, UI implementation, content, design review, or AI experience.
2. Load the relevant direct reference files below; avoid loading all references needlessly.
3. Identify persona, device, product area, scope, design-system source and unknowns. Continue with visibly labelled assumptions when needed.
4. Produce the requested output with rationale tied to a user job and the design principles.
5. Verify interaction states, error/recovery, responsive behaviour, AI transparency and accessibility.
6. Distinguish **Verified**, **Context-based** and **Proposed** guidance in conclusions and implementation notes.

## Reference routing
- [patterns.md](references/patterns.md), [accessibility.md](references/accessibility.md).
- Product decisions, UX critique: [principles.md](references/principles.md), [personas.md](references/personas.md), [patterns.md](references/patterns.md).
- UX writing: [voice-and-tone.md](references/voice-and-tone.md), [accessibility.md](references/accessibility.md).
- Research or persona work: [personas.md](references/personas.md), [principles.md](references/principles.md). Never pass hypotheses off as actual research.

## Default response standards
- State the problem, user goal and constraints before recommending a complex interaction.
- Separate requirements, observations, assumptions and recommendations.
- Prefer an accessible, reusable established pattern over novel interaction mechanics.
- Address first use, subsequent use, loading, empty, failure, permissions, cancellation, undo and success as applicable.
- For AI workflows identify who acts (user or AI), what is visible, how to approve/correct/stop, and what persists.
- For implementations use verified design tokens and approved components; if unavailable, use explicitly provisional placeholders rather than invented N1 values.
- Use "AI" in end-user UI copy unless more precise task language is needed. Product/team name "N1" may appear in technical docs.

