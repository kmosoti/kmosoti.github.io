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
  - observability
  - black-box-design
summary: "A tool that requires tribal knowledge is just undocumented risk with an interface."
---

If a script only works because one person knows the hidden ritual, the interface is incomplete.

A tool should not require the caller to know undocumented edge cases, original design intent, or dangerous assumptions buried inside the implementation. If running it wrong can duplicate data, delete something, crash a server, or mutate state in an unexpected way, then the tool needs stronger boundaries.

The input should be simple. The output should be explicit. Dangerous operations should require confirmation, validation, dry-run behavior, or some other guardrail.

The goal is not to hide everything. A black box still needs inspection ports. The caller should not need to memorize the internals, but the operator should still have enough visibility to debug when reality breaks the happy path.

## Working standard

Before trusting a tool that mutates real systems, I want to see:

- what it accepts
- what it refuses
- what it plans to change
- what it actually changed
- how it fails
- how the operator can recover

Systems should tell on themselves.
