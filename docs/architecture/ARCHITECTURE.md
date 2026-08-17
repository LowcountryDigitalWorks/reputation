# Architecture

## Layers

The target architecture separates:

1. **domain rules** — review-policy invariants, eligibility concepts, destination safety, evidence semantics, suppression semantics;
2. **application/use cases** — commands and queries executed with a resolved authority context;
3. **ports** — persistence, dispatch, scheduling, runtime/configuration, delivery providers, and later Google review capabilities;
4. **adapters** — Cloudflare/D1, Node/SQLite/PostgreSQL, ZeptoMail/SES/client-native delivery, and future orchestration adapters;
5. **interfaces** — LDW administration first; client portal only if demonstrated demand justifies it.

No functional layers are implemented in Release 0.1.

## Core concepts

Minimum initial concepts for later Mode A:

- `Tenant`
- `Location`
- `ReviewDestination`
- `Identity` / `ServicePrincipal`
- `AuditEvent`

Later concepts appear only when their phase is authorized:

- `Template`
- `ProviderConnection`
- `IntegrationConfiguration`
- `ReviewRequest`
- `DeliveryAttempt`
- `Suppression`
- `ObservedReview`
- `ReviewReplyActivity`

## Evidence invariant

Never collapse evidence states:

`REQUESTED != DELIVERED != CLICKED != REVIEW SUBMITTED/PUBLISHED`

A future Google review record is an observation from Google, not proof that a specific request or click caused it.

## Safe redirect rule

A public branded destination identifies an administrator-configured `ReviewDestination`. The browser must never provide the authoritative final redirect target through query parameters, path payloads, headers, or other user-controlled data.

Patterns such as `?url=`, `?next=`, `?redirect=` or encoded equivalents must not create an arbitrary redirect capability.

## Scheduling rule

Future multi-day delayed requests/reminders use authoritative scheduled state plus a scheduler/dispatch pattern. Queue retention/delay is transport behavior, not scheduling truth.

## Portability

Cloudflare is the reference adapter family. Domain/application behavior stays independent of Cloudflare-specific types and can later be adapted to Node/container plus an approved durable store.
