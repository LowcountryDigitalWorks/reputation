# ADR-0001: Cloudflare as the Initial Reference Runtime

- Status: Accepted for architecture reference
- Date: 2026-08-17

## Decision

Use Cloudflare Workers as the initial reference runtime, with D1 as the reference durable store and Queues/Cron Triggers as optional later dispatch/scheduler capabilities when functional releases justify them.

No Cloudflare resource is provisioned by Release 0.1.

## Why

The reference runtime supports a low-cost pilot path, remote management, serverless operation, and small deployments without requiring an always-on server. Current limits are documented in [Cost and scaling](../operations/COST_AND_SCALING.md).

## Boundaries

Cloudflare is an adapter/runtime choice, not product semantics.

Domain and application rules must not depend on Cloudflare request objects, D1 row types, Queue message types, Cron event shapes, or Cloudflare-specific identifiers. Conceptual ports are defined for persistence, dispatch, scheduling, runtime/configuration, and delivery providers.

Cloudflare Queues must not become the authoritative long-term scheduler. Queue message delay is currently limited to 24 hours, and Workers Free queue retention is currently 24 hours. Multi-day reminders should use authoritative scheduled state plus a scheduler/dispatch pattern.

## Reconsider when

Reconsider the reference runtime when actual request volume, D1 read/write/storage usage, queue volume/retention, scheduler needs, recovery requirements, SLA/reliability commitments, support obligations, security/logging requirements, client ownership, regulation, or deployment preference justify another model or a paid plan.
