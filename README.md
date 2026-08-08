# mosoti.dev

Kennedy Mosoti's portfolio, live at [mosoti.dev](https://mosoti.dev).

This repo is a **deploy target, not a source tree**. The pages here are the
built output of ui-servo's site crate — an axum + maud + htmx site whose
export binary renders every route from a shared manifest, copies assets,
and refuses to emit a build that fails its link gate or changes a byte of
the resume PDF. Design changes go through ui-servo's gauntlet loop
(deterministic gates, a blind critic panel, and a human pick recorded as an
exemplar), never by editing files here.

The Pages workflow uploads the repo as-is; there is no build step on CI by
design — everything that can fail has already been checked where the source
lives.

Layout:

- `index.html`, `about/` — the site
- `writing/`, `projects/` — meta-refresh stubs for retired routes
- `assets/` — styles, tokens, the resume PDF, and the WASM islands
- `404.html`, `CNAME`, `.nojekyll` — Pages plumbing

The previous incarnation of this site (the Python/Jinja2 "systems notebook"
and its markdown pieces) lives in this repo's history before the
`ui-servo-redo` branch landed.
