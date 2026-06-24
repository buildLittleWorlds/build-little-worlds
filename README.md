# Theology of LLMs

This repository publishes **Theology of LLMs: A Little World for Large Language
Models**. The site is a Christian exploration of large language models,
mathematics, language, AI, and the Logos.

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

- `docs/index.html`: homepage for Theology of LLMs and the latest posts.
- `docs/start-here.html`: orientation page for new readers.
- `docs/blog.html`: full post listing.
- `docs/beauty-of-the-language-machine.html`: first series landing page.
- `docs/glossary.html`: short, linkable definitions for core LLM terms.
- `docs/reading-path.html`: annotated reading path for the project.
- `docs/post.html`: Markdown post reader.
- `docs/app.js`: loads `posts.json`, renders homepage/blog lists, and renders posts.
- `docs/posts.json`: post manifest with title, date, slug, summary, and source Markdown path.
- `docs/posts/`: source Markdown files for public Theology of LLMs posts.
- `docs/archive/therapeutic-reading-notes/`: archived first experiment from the earlier Rieff notebook.
- `docs/about.html`: project page.
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
