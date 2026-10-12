# Grove (working title)

An original virtual-pet garden game for phone and desktop browsers. Design: `CLAUDE.md`
(the standing brief) and `docs/design.md`. Session log: `PROGRESS.md`.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
npm run dev -- --host  # also serves on the LAN for phone testing
```

```bash
npm test          # Vitest
npm run lint      # ESLint
npm run build     # typecheck + production build into dist/
npm run preview   # serve dist/ locally
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`
to GitHub Pages. One-time setup in the repo: Settings → Pages → Source: **GitHub Actions**.
