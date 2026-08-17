# Provider Boundaries

Reputation must keep product behavior independent from specific infrastructure and communication vendors.

## Conceptual ports

### PersistencePort

Stores and retrieves domain/application state using tenant-scoped business operations. D1 is the reference adapter; SQLite/PostgreSQL are reasonable future alternatives.

### DispatchPort

Carries already-authorized work/events between application components. Dispatch metadata is not tenant authority or audit truth.

### SchedulerPort

Identifies due authoritative scheduled state and dispatches eligible work. It must not rely on a queue message remaining delayed for multi-day business scheduling.

### RuntimeConfigPort

Supplies non-secret runtime configuration through the deployment environment. Secret retrieval must use an approved secret mechanism rather than Git.

### DeliveryProvider

Future provider-neutral boundary for managed delivery. Initial candidate subtype:

- `EmailProvider`

Potential adapters include ZeptoMail, Amazon SES, or a client-owned/native mail system. No provider is a Release 0.1 production dependency.

### Future GoogleBusinessProfilePort

Later-only boundary for review retrieval/observation and explicitly authorized owner replies. Google OAuth credentials must be tenant/location scoped and client-authorized.

## ZeptoMail position

ZeptoMail is the **preferred initial managed-email candidate for later Mode B evaluation**, not a selected production dependency.

A later gate must verify the exact review-request workflow is eligible under provider terms, uses one-to-one event-triggered neutral messages, prefers client-owned sender identity/domain, requires domain authentication, honors suppression, defines bounce/delivery handling, scopes credentials by tenant, keeps tokens out of Git/logs/audit, and reviews retention/configuration.

Open tracking should default **off** unless a deployment has a justified need. Reputation's neutral redirect can provide bounded click evidence without requiring a tracking pixel.

## Automation engines

Activepieces, Zoho Flow, CRM automation, GitHub/serverless automation, and client applications may call Reputation APIs or consume metadata-only lifecycle events later. They never become tenant authority, suppression truth, review-destination truth, audit truth, or required runtime infrastructure.
