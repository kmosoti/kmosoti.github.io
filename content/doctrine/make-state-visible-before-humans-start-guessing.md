---
title: "Make state visible before humans start guessing"
slug: "make-state-visible-before-humans-start-guessing"
type: "doctrine"
status: "living"
domain: "observability"
updated: "2026-06-05"
tags:
  - observability
  - splunk
  - state
  - operations
summary: "A system that cannot describe its own state makes operators hallucinate one."
---

The hardest operational problems often start with hidden state.

Splunk cluster performance is a good example. If indexers and Logstash are colocated, users are storming the cluster, memory and swap are maxed out, and throttling is not allowed, the hard part is not only fixing the system. The hard part is knowing what state the system is actually in.

The same applies to automated user provisioning, functional account inventory, compliance workflows, and maintenance automation. If the system cannot report success, health, ownership, and failure state, humans are forced to infer too much.

A system that cannot describe its own state makes operators hallucinate one.

## Signals before stories

When a system is under pressure, I want signals before narratives:

- what changed
- what is saturated
- what is degraded
- what is backlogged
- what is failing
- who owns the affected object
- which assumptions are currently unsafe

Observability is not vanity telemetry. It is the difference between reasoning and guessing.
