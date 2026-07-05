# Philosophy of Deployment

This repository publishes **Philosophy of Deployment**, a small site about what
happens when a made thing becomes public through technical infrastructure.

The working thesis is that deployment is publication plus environment: the
passage from private artifact to public, addressable, technically maintained
work. The public site currently keeps a deliberately small shape: a homepage, an
About page, and one analysis post.

The public site deploys through GitHub Pages from `docs/`.

## Deployment

- Repository: `buildLittleWorlds/build-little-worlds`
- Pages source: `main` branch, `/docs` folder
- Custom domain: `www.buildlittleworlds.com`
- Registrar: Hostinger
- Active DNS provider: Hostinger nameservers (`ns1.dns-parking.com`, `ns2.dns-parking.com`)
- Frontend host: GitHub Pages

Keep `docs/CNAME` unchanged unless the public domain changes.

## Site Structure

- `docs/index.html`: homepage and thesis for Philosophy of Deployment.
- `docs/about.html`: short site description and guiding questions.
- `docs/post.html`: Markdown post reader.
- `docs/app.js`: loads the post manifest and renders the current analysis.
- `docs/posts.json`: manifest for the current analysis post.
- `docs/posts/001-whats-in-a-cname.md`: first concrete deployment analysis.
- `docs/CNAME`: GitHub Pages custom-domain configuration.

## Local Development

Serve the static site locally:

```bash
python3 -m http.server 8000 --directory docs
```

Run JavaScript and Worker tests:

```bash
npm test
```

The Cloudflare Worker remains in the repository for possible future private
experiments, but it is not linked from the public site.
