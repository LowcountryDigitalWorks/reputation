# ADR-0004: Persistence and Portability Boundary

- Status: Accepted
- Date: 2026-08-17

## Decision

D1 is the reference persistence adapter for the initial Cloudflare architecture, but product-domain rules and application use cases must remain independent of D1 semantics.

Define a persistence port around business operations rather than exporting raw SQL/database behavior into the domain.

## Portability target

The architecture should permit later deployment on a reasonable Node/container runtime with SQLite, PostgreSQL, or another approved durable store without rewriting product-domain rules.

This is **domain and use-case portability**, not a promise of drop-in database interchangeability. Migrations, indexes, transaction strategies, concurrency behavior, backups, and operational procedures may differ by adapter.

## Exportability

Client handoff requires a documented logical export format for configuration and applicable client-owned data. Exportability is distinct from restoring a provider-specific database backup.
