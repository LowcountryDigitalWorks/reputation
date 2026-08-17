# ADR-0002: Multi-Tenancy and Tenant Authority

- Status: Accepted
- Date: 2026-08-17

## Decision

Design multi-tenancy from the first functional schema and use case. A supplied `tenant_id` is data, not authority.

Tenant authority derives from validated application identity or service authority. The resolved tenant context then scopes every authoritative lookup and mutation.

## Minimum coherent model

Initial concepts:

- tenant/organization;
- location;
- administrator-configured review destination;
- identity and service principal;
- audit/security event.

Future concepts, added only when needed:

- templates;
- provider connections;
- integration configuration;
- request/event state;
- suppression state;
- delivery state.

## Required authorization properties

- No tenant context is accepted solely from URL, body, header, webhook payload, queue message, or stored row.
- Provider and integration credentials are tenant-scoped.
- No cross-customer master credential is permitted.
- LDW platform administration is separate from tenant administration.
- Cross-tenant failure tests are mandatory before functional multi-tenant behavior is accepted.

See [Multi-tenancy](../architecture/MULTI_TENANCY.md) and [Authorization](../security/AUTHORIZATION.md).
