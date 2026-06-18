# Build Little Worlds

Build Little Worlds is a public placeholder for a world-building project about composability: making small units that can be recombined into larger fictional, playful, and conceptual systems.

The first version is intentionally static and deploys through GitHub Pages. It introduces the site direction while leaving room for a later authenticated experience.

## Deployment

- Repository: `buildLittleWorlds/build-little-worlds`
- Pages source: `main` branch, `/docs` folder
- Custom domain: `www.buildlittleworlds.com`
- Registrar: Hostinger
- Active DNS provider: Vercel nameservers

GitHub Pages can host static HTML, CSS, and JavaScript. It does not provide secure password-protected member areas by itself, so any future login or "password through me" access should be handled with an auth-capable platform or backend.

## DNS Target

Keep DNS managed at Vercel unless intentionally moving nameservers back to Hostinger.

For GitHub Pages:

- Apex `@` A records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www` CNAME:
  - `buildlittleworlds.github.io`

Do not add wildcard DNS records.

## Archive

`_source-archive/vercel-live-2026-06-18/` contains a snapshot of the public Vercel-hosted page that was live before this GitHub Pages placeholder replaced it.
