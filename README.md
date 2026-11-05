# n1 prototype

`n1 prototype` is a frontend-only idea validation workspace for product managers, founders, and small product teams. It helps users capture product ideas, run validation experiments, review signal scores, and decide what to build next.

## Primary workflow

Create an idea → review its audience and current signal → start a validation experiment → return to the overview to monitor respondents and confidence.

## Workspace transition

The simulated workspace connection screen shows a full-page network animation and status message without skeleton placeholders. It opens OneChat automatically after five seconds; no authentication or workspace service is contacted.

On desktop, ONEchat navigation can be collapsed to an icon rail and reopened with its edge control. At tablet and mobile widths, navigation opens from the menu button. The Courses landing page follows the Projects layout; its sample courses, create/edit/archive/delete actions, and module previews are local to this browser and do not connect to a learning platform.

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

