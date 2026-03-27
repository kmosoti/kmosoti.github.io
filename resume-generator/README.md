# Resume Generator

A source-first, agent-friendly resume workflow.

## Goal
Build your resume from structured data rather than editing PDFs or ad hoc documents.

## Stack
- `resumed` for render and PDF export
- `@jsonresume/schema` for JSON Resume schema validation
- `jsonresume-theme-developer-mono` as the initial render target
- `jsonresume/jsonresume.org` used as a reference for how the registry wires theme packages

## Why this setup
This is a cleaner foundation for iterating with agents because the content source stays separate from presentation.

## Layout
- `src/resume.json` is the canonical resume source
- `docs/notes.md` explains design and extension direction
- `dist/` is where rendered output should go

## Commands
- `npm install`
- `npm run validate`
- `npm run render`
- `npm run export:pdf`

## Notes
Phone number is intentionally omitted from the current source. If you later want a custom domain email, update the `basics.email` field in `src/resume.json` and keep personal contact info minimal in public renders.
