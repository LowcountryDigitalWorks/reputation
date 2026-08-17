# Test and Security Strategy

## Release 0.1 validation

Because 0.1 is documentation/architecture, validation should match what exists:

- repository structure and required authoritative documents;
- internal Markdown links;
- whitespace/basic repository hygiene;
- common secret-pattern scanning;
- no committed credentials/tokens/private material;
- no real customer/PHI examples;
- manual reconciliation of Google policy invariants across product/ADR/security docs;
- manual reconciliation of tenant authority across architecture/data-flow/authorization docs;
- manual reconciliation of deployment/ownership, provider, healthcare, roadmap, and evidence-state boundaries;
- current Cloudflare limits cited from primary documentation with research date.

Do not manufacture runtime tests for code that does not exist.

## Future mandatory security testing

Functional releases must add tests proportionate to their surface. At minimum, future multi-tenant implementation requires the negative tests in [Multi-tenancy](../architecture/MULTI_TENANCY.md).

Mode A must test:

- arbitrary redirect parameters cannot influence the final destination;
- unknown/disabled routes fail safely;
- destination changes require authorized administration;
- public identifiers resist practical enumeration where applicable;
- analytics collection remains within the approved minimized schema;
- QR output contains only the approved branded destination.

Future integration/delivery releases must add authentication/signature, replay, idempotency, suppression, credential isolation, provider-callback validation, and retention tests.

## CI permissions

Repository workflows should default to `contents: read` and checkout with persistent credentials disabled. Additional permissions require explicit justification.
