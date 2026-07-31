# Build Little Worlds — Deployment

This repo has **one deployable piece**: a static website served by GitHub Pages
from `docs/`.

## Public Site

- Repository: `buildLittleWorlds/build-little-worlds`
- Local branch: `main`
- GitHub Pages source: `main` branch, `/docs` folder
- Public URL: `https://www.buildlittleworlds.com/`
- Custom domain file: `docs/CNAME`
- Frontend host: GitHub Pages
- Pages build type: legacy branch/folder publishing, not a repo workflow
- HTTPS: enforced; certificate issued automatically for both apex and `www`

The site has **no framework and no build step**. The files under `docs/` are the
published site:

- `docs/index.html` is the homepage.
- `docs/about.html` is the site description.
- `docs/post.html` renders a Markdown-backed post.
- `docs/styles.css` is the shared stylesheet.
- `docs/app.js` loads and renders posts from the manifest.
- `docs/posts.json` is the post manifest.
- `docs/posts/*.md` are the Markdown post sources.
- `docs/CNAME` is the GitHub Pages custom-domain binding.

To preview locally:

```bash
python3 -m http.server 8000 --directory docs
```

Then open `http://localhost:8000/`.

To publish:

```bash
git add docs README.md deployment.md
git commit -m "Describe the change"
git push origin main
```

GitHub Pages rebuilds automatically from `main` and `/docs`, usually within a
minute.

## DNS and Domain

- Registrar: Hostinger
- Active DNS provider: Hostinger nameservers (`ns1.dns-parking.com`,
  `ns2.dns-parking.com`)
- `www.buildlittleworlds.com` → CNAME → `buildlittleworlds.github.io`
- `buildlittleworlds.com` (apex) → GitHub Pages A records
  (`185.199.108–111.153`), which 301-redirect to `www`
- There is no `api.buildlittleworlds.com` record

Keep `docs/CNAME` set to:

```text
www.buildlittleworlds.com
```

Do not change it unless the public domain changes — it is what binds the domain
to Pages.

## Verification Checklist

Before calling a deploy healthy:

```bash
node --check docs/app.js
curl -I -L https://www.buildlittleworlds.com/
curl -sS https://www.buildlittleworlds.com/posts.json
```

Expected state:

- `docs/app.js` parses without errors.
- GitHub Pages serves the current `docs/index.html` over HTTPS.
- `posts.json` returns the current post manifest.

## Removed Infrastructure

Recorded so the history stays legible, and so nothing below is mistaken for a
missing dependency:

- **Cloudflare Worker `build-little-worlds-api` — deleted 2026-07-31.** It
  previously served private experiment routes at
  `build-little-worlds-api.profplate.workers.dev`, using a `GEMINI_API_KEY` and
  a `BLW_ACCESS_TOKEN`. Its source (`worker/`, `wrangler.toml`) had already been
  removed from this repo, leaving the deployed Worker running with a live API
  key and no source of record. The Worker and the key were deleted on
  2026-07-31. The public site never called it.
- **Vercel deployment** — superseded by the move to GitHub Pages. No archive
  snapshot remains in this repo.

There is no active Vercel, Netlify, Astro, Vite, Next, npm, or GitHub Actions
configuration here, and no `package.json`. The only build system is GitHub
Pages' own static file serving.
