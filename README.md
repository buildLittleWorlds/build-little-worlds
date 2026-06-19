# Build Little Worlds

Build Little Worlds is a public placeholder for a world-building project about composability: making small units that can be recombined into larger fictional, playful, and conceptual systems.

The first version is intentionally static and deploys through GitHub Pages. It introduces the site direction while leaving room for a later authenticated experience.

## Deployment

- Repository: `buildLittleWorlds/build-little-worlds`
- Pages source: `main` branch, `/docs` folder
- Custom domain: `www.buildlittleworlds.com`
- Registrar: Hostinger
- Active DNS provider: Hostinger nameservers (`ns1.dns-parking.com`, `ns2.dns-parking.com`)
- Frontend host: GitHub Pages

Vercel is no longer part of the active hosting path. The old Vercel aliases and
domain object for `buildlittleworlds.com` were removed after DNS moved to
Hostinger.

GitHub Pages can host static HTML, CSS, and JavaScript. It does not provide secure password-protected member areas by itself, so any future login or "password through me" access should be handled with an auth-capable platform or backend.

## AI Experiment Gateway

The static site in `docs/` now includes a private text-unit generator. It calls a separate API gateway instead of calling Gemini directly from browser JavaScript.

Recommended first deployment:

- Frontend: keep GitHub Pages serving `docs/`
- API: deploy the Cloudflare Worker in `worker/src/index.js`
- Current API route: `https://build-little-worlds-api.profplate.workers.dev/api/generate-unit`
- Future custom API route: `https://api.buildlittleworlds.com/api/generate-unit`

The Worker exposes:

- `POST /api/generate-unit`
- `GET /api/health`

Gemini calls use structured JSON output with a response schema, so the gateway
can reliably parse the generated unit before returning it to the browser.

Request body:

```json
{
  "kind": "spell",
  "prompt": "a lantern that remembers roads",
  "provider": "gemini",
  "model": "gemini-3.5-flash"
}
```

Response body:

```json
{
  "title": "Roadmemory Lantern",
  "summary": "A compact reusable world-building unit.",
  "components": ["brass cage", "map-smoke wick", "remembered crossroads"],
  "tags": ["spell", "travel", "memory"],
  "rawProvider": "gemini",
  "model": "gemini-3.5-flash"
}
```

### Secrets

Set these as encrypted Worker secrets:

```bash
wrangler secret put BLW_ACCESS_TOKEN
wrangler secret put GEMINI_API_KEY
```

`BLW_ACCESS_TOKEN` is the private token typed into the site UI. It protects the gateway from casual public use. It is not a Gemini API key.

### Local Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run the Worker locally:

```bash
npm run worker:dev
```

Serve the static page locally from `docs/`:

```bash
python3 -m http.server 8000 --directory docs
```

Deploy the Worker:

```bash
npm run worker:deploy
```

After deployment, use the `workers.dev` URL until the custom API hostname is
ready. The attempted direct Worker custom-domain deploy for
`api.buildlittleworlds.com` fails while `buildlittleworlds.com` is not active as
a Cloudflare-managed zone. Keep provider keys restricted/audited in the Gemini
dashboard.

### Custom API Domain

`api.buildlittleworlds.com` should not be added as a plain Hostinger CNAME to
the `workers.dev` hostname. Cloudflare Worker Custom Domains require an active
Cloudflare zone, and Worker Routes require a DNS record proxied through
Cloudflare. The clean path for the friendly API hostname is:

1. Add `buildlittleworlds.com` as a Cloudflare zone.
2. Recreate the current GitHub Pages DNS records in Cloudflare.
3. Change nameservers at Hostinger from Hostinger DNS to Cloudflare DNS.
4. Add `api.buildlittleworlds.com` as a Worker Custom Domain.

Until then, keep using:

```text
https://build-little-worlds-api.profplate.workers.dev/api/generate-unit
```

Hostinger's API page exposes MCP configuration for DNS automation. The DNS MCP
server command shown in hPanel is:

```json
{
  "command": "npx",
  "args": ["--package=hostinger-api-mcp@latest", "hostinger-dns-mcp"]
}
```

Using that automation requires generating a Hostinger API token in hPanel.

## DNS Target

Keep DNS managed at Hostinger unless intentionally moving the domain to another
DNS provider. Do not point nameservers back to Vercel unless Vercel becomes the
active host again.

For GitHub Pages:

- Apex `@` A records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www` CNAME:
  - `buildlittleworlds.github.io`

Do not add wildcard DNS records.

### Current DNS Notes

- `buildlittleworlds.com` is delegated at the `.com` registry to Hostinger.
- Hostinger serves the GitHub Pages apex A records and the `www` CNAME.
- GitHub Pages has HTTPS enabled and enforced for `www.buildlittleworlds.com`.
- Some local routers or ISP resolvers may temporarily cache the old Vercel
  nameserver path. If that happens, the site may fail locally until the cache
  expires or the machine/router uses a fresh resolver such as `1.1.1.1` or
  `8.8.8.8`.

To restore automatic DNS on macOS Wi-Fi after using temporary manual resolvers:

```bash
networksetup -setdnsservers Wi-Fi Empty
```

To temporarily use known-good public resolvers during propagation:

```bash
networksetup -setdnsservers Wi-Fi 1.1.1.1 8.8.8.8
```

## Archive

`_source-archive/vercel-live-2026-06-18/` contains a snapshot of the public Vercel-hosted page that was live before this GitHub Pages placeholder replaced it.
