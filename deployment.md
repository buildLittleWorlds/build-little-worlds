# Philosophy of Deployment Deployment

This repo currently has two deployable pieces:

- The public website: a static GitHub Pages site served from `docs/`.
- The private experiment API: a Cloudflare Worker kept in the repo but not linked from the public site.

## Public Site

- Repository: `buildLittleWorlds/build-little-worlds`
- Local branch: `main`
- GitHub Pages source: `main` branch, `/docs` folder
- Public URL: `https://www.buildlittleworlds.com/`
- Custom domain file: `docs/CNAME`
- Frontend host: GitHub Pages
- Pages build type: legacy branch/folder publishing, not a repo workflow

The public site has no framework build step. The files under `docs/` are the published site:

- `docs/index.html` is the homepage.
- `docs/about.html` is the site description.
- `docs/post.html` renders the single Markdown-backed analysis post.
- `docs/styles.css` is the shared stylesheet.
- `docs/app.js` loads and renders the current analysis post.
- `docs/posts.json` is the post manifest.
- `docs/posts/*.md` are the Markdown post sources.

To preview locally:

```bash
python3 -m http.server 8000 --directory docs
```

Then open `http://localhost:8000/`.

To publish public-site changes:

```bash
git status
git add docs README.md deployment.md
git commit -m "Reorient site around Philosophy of Deployment"
git push origin main
```

GitHub Pages will rebuild automatically from `main` and `/docs`.

## DNS and Domain

- Registrar: Hostinger
- Active DNS provider: Hostinger nameservers
- Nameservers: `ns1.dns-parking.com`, `ns2.dns-parking.com`
- `www.buildlittleworlds.com` points to `buildlittleworlds.github.io`
- `buildlittleworlds.com` uses the standard GitHub Pages apex A records and redirects to `www`
- There is currently no `api.buildlittleworlds.com` DNS record

Keep `docs/CNAME` set to:

```text
www.buildlittleworlds.com
```

unless the public domain changes.

## Cloudflare Worker

The Worker is configured in `wrangler.toml`:

- Worker name: `build-little-worlds-api`
- Entrypoint: `worker/src/index.js`
- Worker URL: `https://build-little-worlds-api.profplate.workers.dev/`
- Health route: `GET /api/health`
- Private routes:
  - `POST /api/generate-unit`
  - `POST /api/combine-protocols`

Required Cloudflare secrets:

- `BLW_ACCESS_TOKEN`
- `GEMINI_API_KEY`

Set secrets with:

```bash
npx wrangler secret put BLW_ACCESS_TOKEN
npx wrangler secret put GEMINI_API_KEY
```

Run locally:

```bash
npm run worker:dev
```

Deploy:

```bash
npm run worker:deploy
```

The Worker is private-gateway infrastructure. The current public `docs/` site does not link to it or call it.

## Verification Checklist

Before calling a deploy healthy:

```bash
npm test
node --check docs/app.js
node --check worker/src/index.js
curl -I -L https://www.buildlittleworlds.com/
curl -sS https://www.buildlittleworlds.com/posts.json
curl -sS https://build-little-worlds-api.profplate.workers.dev/api/health
```

Expected state:

- `npm test` passes.
- GitHub Pages serves the current `docs/index.html`.
- `posts.json` returns the current post manifest.
- Worker health returns `ok: true`.
- Unauthenticated Worker POST calls return `unauthorized`.

## Inactive or Historical Pieces

- `_source-archive/vercel-live-2026-06-18/` is a preservation snapshot from before the move to GitHub Pages.
- There is no active Vercel, Netlify, Astro, Vite, Next, or GitHub Actions deployment config in this repo.
