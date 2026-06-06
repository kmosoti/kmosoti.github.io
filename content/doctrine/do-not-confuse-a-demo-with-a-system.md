---
title: "Do not confuse a demo with a system"
slug: "do-not-confuse-a-demo-with-a-system"
type: "doctrine"
status: "living"
domain: "reliability"
updated: "2026-06-05"
tags:
  - reliability
  - testing
  - operations
  - evidence
summary: "A demo proves movement. A system proves endurance."
---

A thing working once does not mean it is ready to trust.

Automated maintenance, provisioning, compliance checks, and operational scripts all break eventually. The question is whether they break visibly, safely, and recoverably.

A demo proves movement. A system proves endurance.

Before trusting something under pressure, I want evidence: tests, logs, ADRs, health metrics, failure handling, clear ownership, and enough runtime history to show that the thing survives longer than the first successful run.

## Demo evidence is not useless

A demo can show:

- the idea has shape
- the interface might be workable
- the path is technically plausible
- the next experiment is worth doing

But a demo should still be labeled honestly. Calling it a system too early creates fake confidence, and fake confidence is expensive under pressure.
