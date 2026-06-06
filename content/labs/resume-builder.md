---
title: "resume-builder"
slug: "resume-builder"
type: "lab"
status: "web-demo-planned"
domain: "documents"
updated: "2026-06-05"
tags:
  - resume-builder
  - documents
  - structured-data
  - validation
summary: "A Python-first resume generator built around structured resume data instead of fragile visual editing."
---

resume-builder is a tool I made because I wanted resumes that looked better than the usual white-page, serif-font template without fighting a formatter every time I changed one line.

Normal resume editing is weirdly fragile. The content is structured: name, contact info, experience, projects, skills, education, dates, bullets. But most people edit it like it is only a visual document. Then the formatting starts drifting, sections move strangely, spacing breaks, and suddenly the work becomes less about the resume and more about arguing with the editor.

I would rather bicker with an agent than babysit a document formatter.

The idea behind resume-builder is simple: the resume should be structured data first and rendered output second. The source of truth should be portable, inspectable, and easy to update. A PDF or HTML resume should be an artifact generated from that source, not the place where the truth actually lives.

Right now, the project is a local tool for generating styled resume output from structured resume content. The useful part is not only the final visual design. The useful part is the boundary: structured input goes in, rendered output comes out.

Where I want to take it next is a serviceable web version. Someone should be able to open the site, edit or upload resume data, render a resume, and export the result. Longer term, I also want an agent skill that can work with the project locally, make changes, validate the result, and show the diff before anything is trusted.

The agent side is the interesting part. In theory, an agent should be able to edit the resume and supporting code based on user instruction. In practice, that only becomes safe when the harness is validated. There needs to be schema validation, render checks, test output, preview output, and a visible diff.

Without that, "let the agent edit it" is just another hidden-risk workflow with nicer branding.

## Current state

- Local structured resume rendering works as a concept.
- Web demo is intentionally small.
- PDF export is not in the first web slice.
- Agent editing is not trusted until the harness exists.

## Next smallest honest improvement

A web demo with sample resume data on the left, rendered preview on the right, validation status visible, and an export path that does not require manually touching the final document.

Open the sandbox: [resume-builder demo](/labs/resume-builder/sandbox.html)
