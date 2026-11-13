# MVP and Roadmap

The accepted product baseline is Release 0.1. Portfolio development is **ACTIVE** as of 2026-11-09 under owner direction, with the bounded Website Growth/reputation module research tracked in [issue #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7). Reactivating product research does not authorize functional implementation, customer data, integrations, delivery, or production infrastructure. No functional Reputation runtime exists.

## 0.1 — Product & Architecture Foundation

Status: **ACCEPTED / STABLE**.

Accepted baseline:

- commit: `65a6c6ce5feac4aa243f0021d26aa5f40694b386`
- tree: `30d73fba4ad69d9a3952b9d1e47b70e94bd55fcf`

Deliverables:

- product scope and non-goals;
- Google review-policy guardrails;
- multi-tenant and tenant-authority model;
- shared vs. dedicated deployment design;
- Cloudflare reference architecture and current limits;
- portability boundaries;
- Mode A target and safe redirect rule;
- evidence-state invariants;
- healthcare deployment gate;
- Activepieces/automation boundary;
- provider-neutral delivery boundary and ZeptoMail position;
- suppression boundary;
- identity/role model;
- threat model and test strategy;
- licensing decision;
- backup/recovery/export model;
- cost/scaling triggers.

Release 0.1 is architecture/documentation only. No functional Reputation runtime or production infrastructure exists.

## Current service-first disposition

For an actual client review-request need, LDW should currently:

1. inspect the client's existing CRM, scheduling, POS, review, and email capabilities;
2. configure or integrate the least-cost adequate native capability;
3. use official customer-controlled review destinations;
4. add Reputation product code only when a demonstrated recurring gap remains.

Activepieces or another workflow engine is not required.

## Mode A core — C — DEFER MODE A

Mode A is **not authorized for implementation**. It is deferred pending demonstrated customer need; this is a deferral, not a cancellation.

The accepted conceptual capability remains:

- tenants and locations;
- administrator-configured review destinations;
- safe branded redirects;
- QR representation;
- bounded aggregate click evidence;
- LDW administration;
- export/handoff.

Mode A does not need recipient records.

Reconsider Mode A only when demonstrated demand creates a recurring gap such as:

- multi-location authoritative review-destination management;
- portable branded review URLs or QR codes;
- required aggregate click evidence unavailable from native tooling;
- customers without equivalent native review-request automation;
- another recurring cross-platform gap where a narrow Reputation core creates material customer value.

Any future implementation requires separate authorization.

## Later — Mode B managed email

Not authorized. If later justified by demonstrated need, separately review and authorize before implementing:

- event API and idempotency;
- authoritative scheduled state;
- provider-neutral `EmailProvider`;
- ZeptoMail candidate evaluation;
- neutral templates;
- permitted reminder rules;
- suppression;
- delivery/bounce state;
- minimal recipient retention;
- metadata-only audit evidence.

Before production managed delivery, perform the applicable channel, consent, jurisdiction, client, provider, retention, and security review.

## Later — automation integrations

Not authorized. Activepieces, Zoho Flow, CRM automation, GitHub/serverless automation, or client applications may become callers if a later approved implementation needs them. None becomes tenant authority, suppression truth, destination truth, audit truth, or required runtime infrastructure.

## Later only if demonstrated

- client portal/RBAC;
- Google Business Profile review retrieval, monitoring, alerts, and owner replies;
- SMS after demand, cost, consent, and legal/policy review;
- widgets/testimonials;
- sentiment/reputation trends;
- AI-assisted owner-response drafting;
- advanced reports.

None of these is pre-authorized by this roadmap.

## Conditional client-facing UI acceptance (no implementation authority)

Any **future separately authorized** Reputation application, customer workspace, approval queue or reporting UI must meet the product-local [Client-facing UI acceptance contract](operations/CLIENT_FACING_UI_ACCEPTANCE.md). The contract carries the owner's premium, liquid-glass-inspired, **distinct product palette**, **dark-by-default with optional light mode** direction while inheriting LDW identity, accessibility and product-trust boundaries. This is a design/review gate for future proposals; it does **not** authorize a new app, customer portal, runtime, report delivery or website change.
