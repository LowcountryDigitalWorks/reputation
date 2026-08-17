# Lowcountry Digital Works Reputation

Lowcountry Digital Works Reputation is a privacy-first review-request foundation for neutral customer review solicitation. It is intended to remain portable across client systems, automation engines, communication providers, and deployment environments.

## Current state

**Accepted product baseline:** 0.1 — Product & Architecture Foundation — **ACCEPTED / STABLE**

- accepted baseline commit: `65a6c6ce5feac4aa243f0021d26aa5f40694b386`
- accepted baseline tree: `30d73fba4ad69d9a3952b9d1e47b70e94bd55fcf`

Release 0.1 is an architecture/documentation foundation only. No functional Reputation runtime exists. It defines product, security, tenancy, privacy, policy, portability, provider, and deployment boundaries, but it does **not** process customer or patient data, provision production infrastructure, send email or SMS, connect to Google Business Profile APIs, or require an automation engine.

## Product position

Reputation is not a CRM, scheduling system, social-media suite, survey platform, email-marketing platform, SMS platform, AI review-writing system, testimonial-harvesting system, or review-gating mechanism.

The long-term conceptual lifecycle is:

`approved qualifying business event -> neutral review-request eligibility -> destination/request workflow -> optional permitted delivery -> bounded click/status evidence -> optional later review monitoring`

The evidence model preserves this invariant:

`REQUESTED != DELIVERED != CLICKED != REVIEW SUBMITTED/PUBLISHED`

A click is never treated as proof that a review was submitted or published.

## Current service-first model

Reputation product code is not the default answer to a client's review-request need. LDW should first:

1. inspect the client's existing CRM, scheduling, POS, review, and email capabilities;
2. configure or integrate the least-cost adequate native capability;
3. use official customer-controlled review destinations;
4. add Reputation product code only when a demonstrated recurring gap remains.

Activepieces or another workflow engine is not required for this model.

## Mode A readiness

**Final disposition: C — DEFER MODE A.** Mode A is **not authorized for implementation** and remains deferred pending demonstrated customer need.

Its accepted conceptual boundary remains:

`client system -> neutral customer follow-up -> LDW Reputation branded destination -> administrator-configured official review destination`

If reconsidered, Mode A is designed so Reputation does not need a recipient list. The branded destination must resolve only to an administrator-configured destination; arbitrary browser-supplied redirect targets are prohibited.

Reconsideration may be justified by demonstrated needs such as:

- multi-location authoritative review-destination management;
- portable branded review URLs or QR codes;
- required aggregate click evidence unavailable from native tooling;
- customers without equivalent native review-request automation;
- another recurring cross-platform gap where a narrow Reputation core creates material customer value.

## Architecture

Start with:

- [Product boundary](docs/PRODUCT.md)
- [MVP and roadmap](docs/MVP_AND_ROADMAP.md)
- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Data flow](docs/architecture/DATA_FLOW.md)
- [Multi-tenancy](docs/architecture/MULTI_TENANCY.md)
- [Provider boundaries](docs/architecture/PROVIDER_BOUNDARIES.md)
- [Deployment models](docs/architecture/DEPLOYMENT_MODELS.md)
- [Threat model](docs/security/THREAT_MODEL.md)
- [Authorization](docs/security/AUTHORIZATION.md)
- [Privacy and data minimization](docs/security/PRIVACY_AND_DATA_MINIMIZATION.md)

## Reference runtime

Cloudflare Workers, D1, Queues, and Cron Triggers are the initial **reference architecture**, not product semantics. Release 0.1 provisioned no Cloudflare resources. Domain and application behavior must remain portable to reasonable alternatives such as a Node/container runtime with SQLite or PostgreSQL.

Current Cloudflare Free/Paid limits and reconsideration thresholds are recorded in [Cost and scaling](docs/operations/COST_AND_SCALING.md) with a research date and primary-source links.

## Security and data handling

This repository is public. Never commit secrets, credentials, tokens, private keys, customer records, patient information, PHI, payment-card data, private account-recovery material, or secret-bearing logs. Use synthetic examples only.

See [SECURITY.md](SECURITY.md).

## License

This repository is licensed under the [Apache License 2.0](LICENSE). The rationale is recorded in [ADR-0006](docs/adr/0006-license.md).

## Release process

Meaningful work uses focused branches and pull requests. `main` follows the LDW organization governance baseline: no deletion or force-push, linear history, PR-only changes, resolved review threads, squash-only merge, and the required repository validation check.

Future functional releases require separate authorization and demonstrated customer value.
