# n1 prototype

`n1 prototype` is a frontend-only idea validation workspace for product managers, founders, and small product teams. It helps users capture product ideas, run validation experiments, review signal scores, and decide what to build next.

## Primary workflow

Create an idea → review its audience and current signal → start a validation experiment → return to the overview to monitor respondents and confidence.

## Run locally

```bash
npm install
npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## GitHub Pages

Vite uses `base: './'`, so the generated `dist/` bundle uses relative asset paths and works at a repository subpath such as `https://username.github.io/repository-name/`. Push to GitHub, enable Pages with **GitHub Actions** as the source, and the included workflow builds and deploys on pushes to `main`.

If your setup requires an absolute base, update `base` in `vite.config.ts` to `'/repository-name/'` and rebuild. Page navigation uses URL hashes, so no server rewrite is required.

## ONEchat page

Open `/#/onechat` locally, or `/repository-name/#/onechat` on GitHub Pages. The existing idea workspace remains at `/#/`; its sidebar includes a ONEchat link. The requested route was left as `[SPECIFY ROUTE]`, so `#/onechat` was chosen as the page route.

The page implements [Master - N1 Mockups, frame 21874:28494](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=21874-28494). The reference contains two overlapping screen instances; the implementation renders one. Its 280px sidebar, 850px composer, 32px greeting, navy/gold client theme, 36px model selector, and restrained border treatment are documented adaptations of the defaults in `design.md`. Exact logo and icon SVGs retrieved through Figma MCP are bundled locally in `src/assets/onechat/`; no temporary Figma URLs are used at runtime.

The original Segoe UI font is requested through the existing system font stack. Figma did not supply distributable font files, so devices without Segoe UI use the system sans-serif fallback. For contrast, the greeting accent is darkened from gold to `#93631F`, placeholder text uses `#637381`, and sidebar group labels use `#B4BEC9`. The gold avatar retains the reference colour. Visible compact controls have expanded hit areas; history rows become 44px high below 1024px. Below that breakpoint the sidebar becomes a modal navigation sheet with focus containment, Escape dismissal, and focus restoration. Below 768px the composer reflows for readable 16px text and touch controls.

Working interactions include sidebar collapse/expand, mobile navigation, Chats/Agents tabs, History/Archived switching, conversation search and selection, new-chat reset, the model selector, private-mode selection, local attachment selection/removal (10 MB limit), and local prompt submission feedback. Enter submits; Shift+Enter adds a line break. Search has an empty state and prompt submission has validation and loading feedback. Messages and attachments remain in memory and are never uploaded; submission does not produce an AI response. Voice, account, notifications, and help controls explain the prototype limits. Artifacts and Projects remain presentational because the supplied frame defines no destination or workflow. The history's lorem ipsum was replaced with realistic local conversation titles, as required by `AGENTS.md`.

Components live in `src/pages/onechat/`. Shared native button and dialog primitives live in `src/components/ui/`; the button adapts the shadcn variant API to the existing CSS without adding a second styling system or runtime dependencies. Existing global typography/focus conventions and Lucide state icons are reused. The page adds no backend, authentication, or persistent chat storage.

The approved Code Connect match is `Chat/ONEchat Landing` (`14819:41482`) → `OneChatPage` in `src/pages/onechat/OneChatPage.tsx`. Its parserless template is kept in `figma/OneChatPage.figma.ts`, outside the application TypeScript build. Figma rejected publishing the mapping with `CODE_CONNECT_COMPONENT_NOT_PUBLISHED`; the Figma component must first be published to a team library. No Code Connect mapping was saved remotely.

### Featured agents

The ONEchat page includes the five featured agents from Figma frame `26589:45403`, with its overlapping white cards, rotations, official badges, avatar artwork, and decorative arrow. The assets are bundled in `src/assets/onechat/featured/`. Meaningful descriptions replace the reference's placeholder copy; descriptions use 12px text for readability. On desktop the cards peek from the bottom of the page, matching the reference. Hovering or keyboard focus lifts and enlarges a card, with a smaller lift on its neighbors, using the shared 200ms transition for lift and return. Repeated entrance staggers and extra avatar motion are omitted to keep this daily-use surface calm. Motion rules override the shared button transition so transforms remain smooth. Reduced-motion mode removes the movement and reveals the cards fully; touch devices also reveal the full cards. Below 768px the cards reflow into a readable two-column grid.

Selecting a card prepares its editable suggested prompt and focuses the composer. “Browse more agents” opens an accessible local directory; the sidebar Agents tab also lists the same agents. These are simulated selections with no agent service or AI responses. Typed local agent data lives in `src/pages/onechat/featured-agent-data.ts`.

### Interaction feedback and motion

Shared motion tokens in `src/motion.css` follow `design.md`: 120ms feedback, 200ms transitions, and `cubic-bezier(0.2, 0, 0, 1)`. Pointer presses shrink action buttons to 0.97 over 120ms and release in 60ms. Native dialogs use a centered 0.97-scale entrance over 200ms and exit over 120ms; the mobile navigation sheet uses the same timings while entering and exiting the left edge. The dialog remains modal during pointer dismissal, with a 160ms fallback if a transition is interrupted. Keyboard opening, Escape, and focus jumps stay immediate. Workspace idea dialogs now use the same native dialog primitive, preserving their existing content while adding focus containment and restoration.

ONEchat keeps the send control's layout size stable through its labeled loading state, then shows an explicitly simulated success message. Errors stay next to the composer with text, an icon, and an alert announcement. A reserved feedback area limits composer movement. Status messages fade over 120ms; workspace toasts transition from and back toward the bottom edge over 200ms. Replacing a toast resets its dismissal timer. No animation delays message updates, search results, tab switches, route changes, or readable dashboard data. There are no new dropdowns or popovers; the model picker remains a centered modal.

All new movement is limited to transforms and opacity; no motion library was added. Reduced motion disables positional changes and waiting for exits. Touch devices retain static agent cards. Existing static colors, selection states, focus outlines, labels, and announcements remain available independently of animation.

## Mock data and limitations

Typed mock data lives in `src/data.ts`. Create and delete interactions are local and persisted in `localStorage` to make demonstrations repeatable. There is no backend, authentication, network request, real survey collection, or external data service. Starting an experiment is represented by a local success toast; it does not create a live experiment.

The interface follows the visual tokens, responsive guidance, accessibility expectations, and motion guidance in `design.md`. The product definition placeholders in the brief were resolved as documented above.
