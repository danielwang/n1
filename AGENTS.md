# AGENTS.md

## Project purpose

`n1 prototype` is a frontend-only SaaS prototype for idea validation and product demonstrations. Build the actual product interface, not a marketing landing page. Prioritize polished, believable interactions over production backend functionality.

The assumed product journey is: capture an idea, review its audience and validation signal, run or draft an experiment, and use the resulting evidence to decide what to build next. If a product requirement is incomplete, state the assumption in the relevant documentation or final handoff.

## Source of truth

- Read [`design.md`](./design.md) in full before making UI changes.
- Treat it as the source of truth for visual direction, layout, typography, colors, spacing, responsive behavior, accessibility, motion, and interaction patterns.
- Preserve existing project conventions unless they conflict with `design.md` or these instructions.

## Technology

- Use Vite, React, and TypeScript.
- Use shadcn/ui as the primary component system when adding or extending UI. Customize components to follow `design.md`.
- Use Tailwind CSS and Lucide icons where appropriate.
- Keep dependencies minimal; do not add a library when an existing primitive or small reusable component is sufficient.
- Prefer reusable, typed, maintainable components and realistic interface copy.

## Static application constraints

- The application must remain a completely static website deployable to GitHub Pages under a repository subpath.
- Preserve Vite’s configured relative base path (`base: './'`) unless a documented deployment decision requires changing it.
- Keep asset references base-aware and relative where possible.
- If client-side routing becomes necessary, use hash-based routing. Do not introduce features that require server-side URL rewrites.
- Do not add SSR, server components, API routes, middleware, databases, backend services, or authentication providers.

## Mock functionality

- Keep realistic, typed local mock data in local source files.
- Use client-side state for interactions. Use `localStorage` only when persistence improves the demonstration.
- Simulate relevant loading, empty, validation, success, and error states locally when they are part of the demonstrated flow.
- Controls must work convincingly and must not be decorative.
- Clearly label or describe simulated backend behavior; do not present it as a real service.

## Design and responsiveness

- Design desktop-first, then verify tablet and mobile layouts.
- Use shadcn/ui components when suitable, with styling aligned to `design.md`.
- Maintain accessible labels, semantic structure, keyboard navigation, visible focus states, and suitable contrast.
- Preserve minimum touch targets and prevent clipped text, overlap, broken layouts, and horizontal page overflow.
- Respect reduced-motion preferences and use motion only when it improves feedback or orientation.
- Use concise, realistic product copy; never use lorem ipsum.

## Working practices

- Inspect relevant files before editing.
- Keep changes focused on the requested task.
- Do not rewrite unrelated code or remove existing behavior without a clear reason.
- Do not add unnecessary abstractions or dependencies.
- Update `README.md` when setup, build, deployment, or user-visible prototype behavior changes.
- Do not modify application code for documentation-only tasks unless required to validate documented commands.

## Verification

Before completing an implementation change:

1. Run `npm run lint`.
2. Run `npm run build` (this includes the TypeScript project check and creates `dist/`).
3. Test the affected interactions in the built application, not only the development server.
4. For UI changes, check representative desktop, tablet, and mobile viewport sizes.
5. Verify that assets and any navigation remain compatible with a non-root GitHub Pages path.
6. Report which checks were completed and disclose any checks that could not be run.

Current project commands:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```
