---
title: "Keep config as intent, not hidden business logic"
slug: "keep-config-as-intent"
type: "doctrine"
status: "living"
domain: "configuration"
updated: "2026-06-05"
tags:
  - config
  - logging
  - standards
  - maintainability
summary: "Config should expose operational intent, not become a second programming language with worse tooling."
---

Config is useful when it makes shared references and operational choices inspectable.

It becomes a mess when it turns into a second programming language with worse tooling. Logging standards are a good example. If every team litters free-form logs and custom exceptions through code, behavior becomes inconsistent and hard to reason about. But if the logging structure is defined clearly, reused consistently, and kept separate from business logic, the system becomes easier to operate.

Config should describe knobs, references, thresholds, destinations, formats, and environment-specific values. It should not become the place where real behavior hides.

## The boundary

Good config says:

- this environment points here
- this threshold means warning
- these fields belong in every log
- this destination receives this signal
- this setting is intentionally different in production

Bad config hides:

- branching behavior nobody can test
- half a business workflow
- security choices without ownership
- operational rules that should be code

The goal is inspectable intent.
