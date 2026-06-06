---
title: "Make mutations atomic and visible"
slug: "make-mutations-atomic-and-visible"
type: "doctrine"
status: "living"
domain: "automation"
updated: "2026-06-05"
tags:
  - automation
  - mutation
  - operations
  - evidence
summary: "If a tool changes something, the result should be clear enough that the operator does not reverse-engineer reality."
---

If a tool changes something, the result should be clear.

A mutation should not leave the operator wondering what happened, what partially happened, or what needs cleanup. The tool should say what it intended to do, what it actually did, what failed, and what state remains.

This matters most when the workflow touches servers, accounts, permissions, compliance-sensitive objects, or shared infrastructure. A vague success message is not enough. A silent side effect is worse.

The standard is simple: after the tool runs, the operator should not have to reverse-engineer reality.

## Evidence I want

- input summary
- planned change set
- dry-run output when risk is meaningful
- success and failure counts
- object identifiers touched
- skipped objects with reasons
- final state summary

Good engineering reduces guessing.
