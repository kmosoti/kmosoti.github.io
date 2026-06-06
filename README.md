# Systems Notebook

Static website for `https://kmosoti.github.io/`.

This site is a public working surface for systems thinking, observability, automation, engineering doctrine, project labs, and small experiments.

## Local Build

```powershell
python -m pip install -r requirements.txt
python scripts\render_markdown.py --content content --templates templates --out .
```

The same renderer can build an isolated artifact:

```powershell
python scripts\render_markdown.py --content content --templates templates --out _site
```

## Content Model

Notebook pages live under `content/` and use YAML frontmatter:

```yaml
---
title: "Do not build tools that require folklore"
slug: "do-not-build-tools-that-require-folklore"
type: "doctrine"
status: "living"
domain: "automation"
updated: "2026-06-05"
tags:
  - automation
  - interfaces
summary: "A tool that requires tribal knowledge is undocumented risk with an interface."
---
```

Allowed page types:

```text
doctrine | field-note | lab | diagram | experiment
```

Allowed statuses:

```text
living | working | experiment | local-only | web-demo-planned | needs-harness | archived
```

## Deployment

The repo supports both:

- Branch-based GitHub Pages from repository root.
- GitHub Actions deployment from generated `_site/`.

The workflow is in `.github/workflows/pages.yml`. For Actions deployment, set GitHub Pages source to **GitHub Actions** in repo settings.

## License Note

The code and templates are suitable for an MIT-licensed repository. Personal resume content, personal biography text, and generated visual assets are not automatically granted under the same license unless explicitly stated.
