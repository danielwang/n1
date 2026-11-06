# n1 prototype

`n1 prototype` is a frontend-only idea validation workspace for product managers, founders, and small product teams. It helps users capture product ideas, run validation experiments, review signal scores, and decide what to build next.

## Tech stack

- **Vite** — build tooling and dev server
- **React 18** + **TypeScript** — UI framework and type safety
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** conventions — dependency-free, locally adapted component API (see [src/components/ui](/Users/danielwang/Workspace/n1-prototype/src/components/ui))
- **Lucide React** — icon set
- **ESLint** — linting

The app is a static, frontend-only prototype with no backend, database, or authentication provider; all data and interactions are mocked client-side.

## Primary workflow

Create an idea → review its audience and current signal → start a validation experiment → return to the overview to monitor respondents and confidence.

## Workspace transition

The simulated workspace connection screen shows a full-page network animation and status message without skeleton placeholders. It opens OneChat automatically after five seconds; no authentication or workspace service is contacted.

On desktop, ONEchat navigation can be collapsed to an icon rail and reopened with its edge control. At tablet and mobile widths, navigation opens from the menu button. The Courses landing page follows the Projects layout; its sample courses, create/edit/archive/delete actions, and module previews are local to this browser and do not connect to a learning platform.

The BIO101 course workspace follows a material → chat → artifact study flow. Its landing state shows the two due items from the Figma frame and a centered course prompt; opening a due item reveals the full materials list and the reading workspace. Its explorer switches between materials, the current course chat, and saved artifacts. Materials open in tabs; source checkboxes stay selected independently of the open file. Chat stays beside reading and artifacts on desktop and opens as a drawer on smaller screens. Local sample answers cite course sections, and a citation reopens the file at the cited section while the artifact remains available in the explorer. Students can create guides, summaries, and practice questions from selected sources, refine them in chat, inspect earlier versions, edit content, rename, duplicate, and delete artifacts. Artifacts and panel widths are kept in this browser. Course dates, content, chat replies, and study outputs are illustrative; no AI, learning platform, file service, or voice service is connected.

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

