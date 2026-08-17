# ADR-0003: One Product, Multiple Deployment Models

- Status: Accepted
- Date: 2026-08-17

## Decision

Maintain one product/codebase that can support:

1. an LDW-managed shared multi-tenant deployment for ordinary low-sensitivity clients;
2. a dedicated client-owned deployment when isolation, ownership, contractual obligations, regulation, preference, or risk justify it;
3. a future self-hosted/on-prem deployment only when demonstrated demand exists.

Do not create separate products for these models.

## Ownership principle

Prefer client ownership where practical for domains, Google Business Profiles, sender identities, communication-provider accounts, CRM/scheduling/POS accounts, and production cloud resources in dedicated deployments. LDW uses named/scoped access.

Configuration and data must have an export/handoff path. The value of LDW management should come from setup, integration, operation, maintenance, security, support, and convenience rather than preventable lock-in.
