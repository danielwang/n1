# N1 DESIGN.md — working design contract

> Status: **Context-based and partially unverified**. This is a skill reference, **not a validated export** of the official Google DESIGN.md schema and **not an authoritative Figma token listing**. Replace or augment it with a Figma-verified `DESIGN.md` before claiming production visual fidelity.

## Overview
N1/ONEchat is an AI experience for individuals and organizations, including higher education. Prioritize familiar interaction patterns, user control, visual clarity, accessible design, and organizational customizability. Respect distinct chat and admin work contexts.

## Design tokens — unavailable until verified
- **Colours:** No verified token names, HEX values, semantic roles or dark-mode mappings provided.
- **Typography:** No verified font families, size scale, line-height scale or weights provided.
- **Spacing/grid:** No verified spacing values, breakpoints or maximum widths provided.
- **Radius/elevation:** No verified radius/shadow tokens provided.
- **Iconography:** No verified approved icon family, stroke or sizing system provided.

Do **not** fabricate these values. Request a Figma variables export or access to the official design-system implementation. If generating a demonstration without that data, mark the values `PROVISIONAL` and avoid calling the result N1-compliant.

## Visual interaction guidance
- Establish a clear distinction between navigation, user content, system state and AI-generated content.
- Keep model/agent selection discoverable near the relevant compose action when appropriate; avoid crowding the input.
- Use consistent component hierarchy and explicit primary/secondary/destructive action labels.
- Consider mobile touch targets and voice-first usage where appropriate; do not assume admin feature parity on small screens.
- Make light/dark themes semantically equivalent when implementing both; dark mode is an area of product exploration, not an invented completed specification.
- Allow client branding without sacrificing the interaction model, semantics and accessibility.

## Components to verify against Figma/code
Button, text input, text area / prompt composer, dropdown, pill/chip, navigation, modal/dialog, menu, notification, toast, avatar, card, list, tabs and settings form. Verify each component's real variants, states, anatomy and API before implementation.

## Required states for design reviews
Default, hover where applicable, focus, active/selected, disabled, pending/loading, empty, error, success, responsive, and reduced-motion alternatives as relevant.

## Do / don't
- **Do:** Reference actual semantic tokens, reuse component states, apply design principles, and include graceful recovery.
- **Don't:** Treat screenshots as proof of semantic tokens, infer design-system rules from a single mock, or invent Figma component identifiers.

## Related materials
Read `principles.md`, `patterns.md`, `accessibility.md`, `voice-and-tone.md`, and `figma-extraction.md` according to task.
