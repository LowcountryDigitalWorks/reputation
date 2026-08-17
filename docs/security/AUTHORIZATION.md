# Authorization

## Identity classes

Release 0.1 defines roles conceptually without selecting an identity provider.

- **LDW platform administrator** — exceptional cross-tenant platform operations required to operate the shared service.
- **Tenant administrator** — manages authorized tenant configuration and tenant users/integrations.
- **Tenant user** — performs only tenant-scoped allowed operations.
- **Service principal / integration identity** — non-human identity bound to one tenant and explicit capabilities.

No shared administrator credentials are permitted.

## Authority resolution

1. Authenticate the actor using the deployment's approved identity mechanism.
2. Resolve application authority from server-side identity/service-principal configuration.
3. Derive tenant context from that authority.
4. Authorize the requested capability.
5. Execute tenant-scoped persistence/provider operations.
6. Emit bounded metadata-only audit/security evidence when appropriate.

A user-supplied tenant ID never replaces steps 1-4.

## Privileged LDW administration

Platform administration should be smaller than “superuser can do anything.” Future implementation should separate support/observability tasks from customer-data/configuration mutation where practical and record privileged configuration changes.

## Service principals

A service principal should be bound to:

- one tenant;
- a narrow integration purpose;
- explicit capabilities;
- revocable credentials;
- rotation metadata where applicable.

Do not create one master integration credential spanning all customers.

## Identity provider decision

No production identity provider or client portal is selected in Release 0.1. Identity technology should be chosen only when a functional administration/client-access release requires it, using the invariants above as acceptance criteria.
