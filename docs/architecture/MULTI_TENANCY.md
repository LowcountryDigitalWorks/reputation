# Multi-Tenancy

## Tenant authority

A `tenant_id` is never authority by itself, regardless of whether it appears in a URL, body, header, webhook payload, queue message, database row, or frontend state.

Authority is established from validated application identity or service authority. The application resolves a tenant context from that authority, then scopes every authoritative lookup and mutation to the resolved context.

## Smallest coherent hierarchy

Initial Mode A-oriented hierarchy:

```text
Tenant / Organization
  -> Location
      -> Review Destination
  -> Identity / Role / Service Principal
  -> Audit / Security Evidence
```

Future authorized phases may add templates, provider connections, integration configuration, review-request/event state, suppression state, and delivery state.

## Provider and integration isolation

- Provider credentials are tenant-scoped.
- Integration credentials are tenant-scoped.
- A shared LDW deployment may use shared platform infrastructure, but it must not use a cross-customer credential that grants access to all client provider accounts.
- Dedicated deployments should prefer client-owned provider/cloud accounts and named/scoped LDW access.

## Mandatory negative tests for future implementation

Before accepting functional multi-tenancy, automated tests must prove at least:

1. tenant A identity cannot read tenant B location/destination by guessed ID;
2. tenant A identity cannot mutate tenant B destination by guessed ID;
3. changing a URL/body/header `tenant_id` cannot switch authority;
4. a service principal cannot exceed its tenant or capability scope;
5. queue/event metadata cannot broaden the consumer's resolved authority;
6. a webhook signed for tenant A cannot act for tenant B;
7. an LDW support role without platform-admin privilege cannot cross tenant boundaries;
8. export/delete operations cannot target another tenant;
9. cache/index shortcuts cannot bypass authoritative tenant-scoped lookup;
10. error responses do not reveal cross-tenant existence through avoidable enumeration differences.

## Shared vs. dedicated

Logical isolation is mandatory in a shared deployment. Dedicated deployment provides a stronger ownership/isolation boundary but does not remove the need for authorization inside the application.
