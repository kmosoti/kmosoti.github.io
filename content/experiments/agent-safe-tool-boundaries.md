---
title: "Agent-safe tool boundaries"
slug: "agent-safe-tool-boundaries"
type: "experiment"
status: "needs-harness"
domain: "agent-tooling"
updated: "2026-06-05"
tags:
  - agents
  - tools
  - validation
  - interfaces
summary: "The useful version of agents depends on explicit contracts, visible diffs, and state that can be inspected."
---

I am interested in AI agents because the useful version is not magic.

It is better context, tighter tool contracts, explicit state, and fewer vague handoffs.

For infrastructure work, an agent should not get trust because it sounds confident. It should get trust because the workflow makes unsafe behavior harder:

- schema validation before mutation
- dry-run output when risk matters
- visible diffs before acceptance
- render checks for generated artifacts
- tests and logs tied to the change
- clear recovery path when the happy path breaks

The standard is the same as any other tool.

The input should be simple enough to use without folklore, but strict enough to prevent destructive ambiguity.
