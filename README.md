# Therapeutic Reading Notes

This repository currently publishes a minimalist static blog titled
**Therapeutic Reading Notes**. The site is for reading notes on Philip Rieff,
the therapeutic, and related scholars.

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

- `docs/index.html`: homepage with a short introduction and the ten most recent posts.
- `docs/post.html`: Markdown post reader.
- `docs/app.js`: loads `posts.json`, renders the homepage list, and renders posts.
- `docs/posts.json`: post manifest with title, date, slug, summary, and source Markdown path.
- `docs/posts/`: source Markdown files for reading notes.
- `docs/background.html`: placeholder for background notes.
- `docs/related-thinkers.html`: placeholder for related scholars.
- `docs/about.html`: placeholder author/project page.
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
