---
title: "Structured input, rendered output"
slug: "structured-input-rendered-output"
type: "diagram"
status: "experiment"
domain: "documents"
updated: "2026-06-05"
tags:
  - diagrams
  - resume-builder
  - documents
  - validation
summary: "A small diagram for treating personal documents like source-controlled artifacts."
---

This is the core shape behind resume-builder.

```text
structured resume data
        |
        v
schema validation
        |
        v
renderer
        |
        v
HTML / PDF artifact
        |
        v
preview, export, diff
```

The useful boundary is simple:

```text
structured input goes in
inspectable output comes out
```

The agent version only becomes safe when the harness exists:

```text
instruction -> edit -> validate -> render -> screenshot -> diff -> accept
```

Without that harness, "let the agent edit it" is just another hidden-risk workflow with nicer branding.
