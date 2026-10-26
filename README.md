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

Working interactions include sidebar collapse/expand, mobile navigation, Chats/Agents tabs, History/Archived switching, conversation search and selection, new-chat reset, the model selector, private-mode selection, local attachment selection/removal (10 MB limit), and local prompt submission feedback. Enter submits; Shift+Enter adds a line break. Search has an empty state and prompt submission has validation and loading feedback. Messages and attachments remain in memory and are never uploaded; submission does not produce an AI response. Voice, account, and help controls explain the prototype limits. Notifications open the local notification center described below. Artifacts opens the library described below. Projects remains presentational because the supplied frame defines no destination or workflow. The history's lorem ipsum was replaced with realistic local conversation titles, as required by `AGENTS.md`.

Components live in `src/pages/onechat/`. Shared native button and dialog primitives live in `src/components/ui/`; the button adapts the shadcn variant API to the existing CSS without adding a second styling system or runtime dependencies. Existing global typography/focus conventions and Lucide state icons are reused. The page adds no backend, authentication, or persistent chat storage.

The approved Code Connect match is `Chat/ONEchat Landing` (`14819:41482`) → `OneChatPage` in `src/pages/onechat/OneChatPage.tsx`. Its parserless template is kept in `figma/OneChatPage.figma.ts`, outside the application TypeScript build. Figma rejected publishing the mapping with `CODE_CONNECT_COMPONENT_NOT_PUBLISHED`; the Figma component must first be published to a team library. No Code Connect mapping was saved remotely.

### Featured agents

The ONEchat page includes the five featured agents from Figma frame `26589:45403`, with its overlapping white cards, rotations, official badges, avatar artwork, and decorative arrow. The assets are bundled in `src/assets/onechat/featured/`. Meaningful descriptions replace the reference's placeholder copy; descriptions use 12px text for readability. On desktop the cards peek from the bottom of the page, matching the reference. Hovering or keyboard focus lifts and enlarges a card, with a smaller lift on its neighbors, using the shared 200ms transition for lift and return. Repeated entrance staggers and extra avatar motion are omitted to keep this daily-use surface calm. Motion rules override the shared button transition so transforms remain smooth. Reduced-motion mode removes the movement and reveals the cards fully; touch devices also reveal the full cards. Below 768px the cards reflow into a readable two-column grid.

Selecting a card prepares its editable suggested prompt and focuses the composer. “Browse more agents” opens the full agents directory at `#/onechat/agents`. These are simulated selections with no agent service or AI responses. Typed local featured-agent data lives in `src/pages/onechat/featured-agent-data.ts`.

### Agents navigation

Choose **Agents** in the ONEchat sidebar to open the navigation from [Figma node 25508:38112](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=25508-38112). The shared panel includes all nine named agents, original 24px artwork inside 36px avatars, official badges, the reference’s 52px row rhythm, and Recent/Pinned controls. Its 554px maximum height matches the mockup, with the account footer anchored below it. At shorter heights the agent list scrolls independently, keeping both collection controls and account actions available. Existing mobile navigation sheets reuse the same panel, and rows retain 44px touch targets. On sheets shorter than 600px, the logo is hidden and the primary navigation scrolls within an 88px area so agent tabs, collection controls, and account actions remain reachable.

Selecting an agent opens `#/onechat/agent` with that agent selected; selecting another agent on that screen updates the existing conversation interface. Recent initially shows the nine reference agents in the mockup’s order. Opening an agent from the full directory also adds it to this session’s recent list, so it can be selected and pinned through the existing chat options. Pinned initially contains Phoenix, Lyra, and Cassiopeia, following the existing agent-chat demo. Agent options can pin or unpin the current agent, including AQUA Campus Info; an empty state appears when all agents are unpinned. Selection, collection, and pin state are shared across both chat routes and navigation sheets for the current application session, and reset on reload. No backend or storage was added. Shared components and state live in `AgentNavigation.tsx` and `AgentNavigationState.tsx`; existing locally bundled Figma artwork is reused.

### Interaction feedback and motion

Shared motion tokens in `src/motion.css` follow `design.md`: 120ms feedback, 200ms transitions, and `cubic-bezier(0.2, 0, 0, 1)`. Pointer presses shrink action buttons to 0.97 over 120ms and release in 60ms. Native dialogs use a centered 0.97-scale entrance over 200ms and exit over 120ms; the mobile navigation sheet uses the same timings while entering and exiting the left edge. The dialog remains modal during pointer dismissal, with a 160ms fallback if a transition is interrupted. Keyboard opening, Escape, and focus jumps stay immediate. Workspace idea dialogs now use the same native dialog primitive, preserving their existing content while adding focus containment and restoration.

ONEchat keeps the send control's layout size stable through its labeled loading state, then shows an explicitly simulated success message. Errors stay next to the composer with text, an icon, and an alert announcement. A reserved feedback area limits composer movement. Status messages fade over 120ms; workspace toasts transition from and back toward the bottom edge over 200ms. Replacing a toast resets its dismissal timer. No animation delays message updates, search results, tab switches, route changes, or readable dashboard data. There are no new dropdowns or popovers; the model picker remains a centered modal.

All new movement is limited to transforms and opacity; no motion library was added. Reduced motion disables positional changes and waiting for exits. Touch devices retain static agent cards. Existing static colors, selection states, focus outlines, labels, and announcements remain available independently of animation.

### Notification center

The notification center follows [the populated Figma mockup](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=24301-35663) and [the empty state](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=24301-43099): a 356px right drawer, Me/Admin tabs, 36px avatars, red unread indicators, a fixed footer, and the original empty-mailbox illustration. Exact panel icons are bundled under `src/assets/notifications/`. The panel stays within the viewport on small screens. An extra unread filter and detail views support the requested notification types; compact controls have larger touch targets than the reference.

Open it from the workspace header bell or the ONEchat account bell. A toolbar bell remains available on tablet/mobile and when the sidebar is collapsed. The panel uses the shared native dialog, with focus containment, Escape/outside-click dismissal, focus restoration, a 200ms slide from the right, and a 120ms exit. Keyboard opening and reduced-motion interactions are immediate. No background dimming is added, matching the mockups. Me/Admin counts show unread enabled items; the bell shows their combined count.

Assumed grouping: **Me** contains personal budget thresholds, model fallbacks, and releases; **Admin** contains content-filter alerts, users nearing budget limits, message feedback, moderation reports, and new/deprecating models. The seed data includes all eight requested types and separate new-model and deprecation examples. Selecting an item opens contextual details and marks it read. Each detail can be marked unread; “Mark all as read” applies to the current inbox. The unread filter reveals the illustrated empty state once that inbox is read. Preferences choose which types are shown in this demo and update counts immediately.

Read states and preferences persist under `n1-notifications-v1` in localStorage, with an in-memory fallback if storage is unavailable. Preferences do not change real delivery settings. The Me/Admin tabs demonstrate two scopes; they do not implement permissions or authentication. Release notifications link to the static `#/release-notes` page, which returns to ONEchat. All events, people, budgets, model availability, and release notes are explicitly fictional sample data. No real notifications, moderation actions, or provider announcements are fetched or sent.

## Mock data and limitations

Typed mock data lives in `src/data.ts`. Create and delete interactions are local and persisted in `localStorage` to make demonstrations repeatable. There is no backend, authentication, network request, real survey collection, or external data service. Starting an experiment is represented by a local success toast; it does not create a live experiment.

The interface follows the visual tokens, responsive guidance, accessibility expectations, and motion guidance in `design.md`. The product definition placeholders in the brief were resolved as documented above.

### Agent chat screen

Open `#/onechat/agent`, or choose an agent in **ONEchat → Agents**. This screen implements [Figma frame 20888:27012](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=20888-27012), reusing the Aqua sidebar, budget indicator, button, dialogs, notification center, and motion tokens. New assets are local under `src/assets/onechat/agent/`. The profile, 850px composer, 680px starter carousel, and navy sidebar follow the reference; compact controls retain 44px touch areas. The sidebar becomes a modal sheet below 1024px, and the content reflows below 768px.

Prompt starters fill and focus the editable composer; the arrow pages through suggestions. Recent/Pinned filters the nine sample agents. Agent options allow pinning the current agent; selections and pins last for the current application session across both chat routes. Guidelines open a keyboard-accessible dialog with clearly labelled sample guidance. Empty submissions show an inline error; valid messages simulate loading and completion without contacting an AI service. Attachment selection is local with a 10 MB limit. Placeholder starter copy is replaced with meaningful text. The reference does not define conversation responses or official guideline content, so those are explicitly described as local demonstrations. Existing reduced-motion behavior applies, and carousel scrolling becomes immediate when reduced motion is requested.

### Agents directory page

Open `#/onechat/agents`, or choose **Explore Agents** in any Aqua sidebar or **Browse more agents** on ONEchat. This implements [Agents Homepage, Figma frame 13716:21586](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=13716-21586). At the reference 1920×1014 size, it preserves the 280px sidebar, 32px main gutters, 36px light heading, 320×54px search, two rows of official cards, and My Agents section with Created by me/Shared with me tabs and the dashed create card. Cards use 48px avatars, 24px inset content, 12px corners, original Figma artwork, and hover/focus borders and shadows. Figma’s pink cursor annotations are represented by actual hover feedback; share/edit tooltips appear on hover and keyboard focus. Placeholder agent names and lorem ipsum are replaced with meaningful sample content. Duplicate card entries shown in the reference are retained as separate sample records.

The page reuses the sidebar, agent selection/pin state, notification center, button, native dialog, feedback, focus styles, and motion preferences. Assets live in `src/assets/onechat/directory/`; DataAnalyzer and CodeMentor use exact SVG exports of their resolved Figma instance artwork. Segoe UI follows the existing system fallback. Search placeholders use the existing readable muted text colour. Compact create and share/edit controls have larger hit areas than their visible artwork.

Search filters names and descriptions across Official Agents and the selected personal collection, with result announcements and empty states. Browse all agents clears the filter. Agent cards open the existing local chat screen; opened agents also appear in Recent and can be pinned. Sidebar conversation selection returns to ONEchat with the selected editable prompt. Created by me starts with three reference cards. Shared with me has the two sample entries implied by the mockup’s count; their names and descriptions are an implementation assumption because the selected tab’s contents were not supplied.

Create and edit dialogs validate required names/descriptions and save only in this browser under `n1-directory-agents-v1`. Invalid or unavailable storage falls back safely to local demonstration state. Invitation previews validate an email address and show the intended recipient, but send no email, create no permissions, and contact no service. These are explicitly labelled simulations. Shared cards are read-only. Card selection, pin state, and chat remain local demonstrations.

The grid reflows to three columns below 1600px, two below 1200px, and one below 640px. Below 1024px the existing mobile navigation sheet replaces the sidebar. The directory scrolls independently of desktop navigation, and forms and headings wrap on narrow screens. The implementation adds no backend or dependencies and retains hash routing and Vite’s relative asset base for GitHub Pages.

### Artifacts library

Open `#/onechat/artifacts`, or choose **Artifacts** in any Aqua sidebar. This implements [Figma frame 20427:47955](https://www.figma.com/design/Xli3DdUg0KWKd32wLXNt4a/Master---N1--Mockups?node-id=20427-47955). It preserves the 280px navigation, centered 1200px library, 24px heading, collection tabs, type filters, search, and ten cards with the supplied titles, summaries, types, and dates. At 1920×1068 the four-column grid starts at y=249, with 282×252px cards and 24px gaps. Nine complete resolved file-icon SVGs are bundled in `src/assets/onechat/artifacts/`, including the reference's Mermaid and spreadsheet icon overrides. The existing share icon, sidebar, agent navigation state, notifications, Button, Dialog, and Feedback components are reused. New typed data, cards, sharing preview, and page styles live in `artifact-data.ts`, `ArtifactsPage.tsx`, and `artifacts.css`.

Search filters titles, summaries, and types within the selected collection. Type filters combine with search; HTML/JavaScript belongs to HTML and Code, JSON belongs to Code, and the three research cards belong to Deep Research. The source has no image artifacts, so Images shows an empty state. Reset filters restores the collection. Tabs support arrow, Home, and End keys. Shared With Me reuses two sample records because the reference supplies only a count; these are read-only and do not represent real permissions. Changing collection resets the type filter and preserves the search query.

Selecting a card opens its title, metadata, and supplied summary in an accessible local preview. Original document contents were unavailable, so previews explicitly describe that limit and do not invent document bodies. Share controls appear on card hover/focus and stay visible on touch devices. Sharing validates an email address and displays an invitation preview; it sends nothing and grants no access. No backend, persistence, dependency, or Figma file changes were introduced.

The grid reflows to three columns below 1600px, two below 1200px, and one below 640px. Below 1024px the existing modal navigation sheet and compact notification toolbar replace desktop navigation. Search and filters stack on narrower screens, filter buttons wrap with 44px touch targets on mobile, and cards grow with text rather than clipping it. Segoe UI uses the existing system fallback because no distributable font was supplied. Search placeholder contrast follows `design.md`. The built page was checked at 1920×1068, 1366×900, 1024×768, 768×1024, 390×844, 320×568, and 844×390 under `/repository-name/`, including assets, navigation, filters, search, keyboard tabs, preview dialogs, invitation validation, notifications, focus restoration, and reduced-motion dismissal.
