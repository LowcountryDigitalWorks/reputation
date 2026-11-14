# Lowcountry Digital Works Reputation

Lowcountry Digital Works Reputation is a privacy-first review-request foundation for neutral customer review solicitation. It is intended to remain portable across client systems, automation engines, communication providers, and deployment environments.

## Current state

**Accepted product baseline:** 0.1 — Product & Architecture Foundation — **ACCEPTED / STABLE**

**Current documentation maintenance:** 0.1.1 — Accepted-State Documentation Maintenance

**Portfolio state:** **ACTIVE DEVELOPMENT** — bounded product and service-module development is active; no functional Reputation runtime is authorized by this status.

Owner direction (2026-11-09) reactivates product development after the prior dormant portfolio state. The active next step is the Website Growth/reputation module research tracked in [issue #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7). This status change does not authorize customer data, integrations, delivery, production infrastructure, or functional runtime implementation.

- accepted product-baseline commit: `65a6c6ce5feac4aa243f0021d26aa5f40694b386`
- accepted product-baseline tree: `30d73fba4ad69d9a3952b9d1e47b70e94bd55fcf`
- accepted 0.1.1 documentation-maintenance baseline: `8e97aecfc75cf1b4c45126606a5521da31fcd565`

Release 0.1 is an architecture/documentation foundation only. Release 0.1.1 synchronized that foundation to the then-deferred state without adding runtime functionality. No functional Reputation runtime exists. The repository defines product, security, tenancy, privacy, policy, portability, provider, and deployment boundaries, but it does **not** process customer or patient data, provision production infrastructure, send email or SMS, connect to Google Business Profile APIs, or require an automation engine.

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

## G3a — unified operations UX proof (owner-directed November 13, 2026)

The owner clarified that **custom Reputation software is worth considering when a single UX creates real operator or customer value**. A local, synthetic-only [Reputation Operations Workbench](proofs/ops-workbench/README.md) is now an approved **source-only feasibility proof** within this repository. It unifies source-attributed manual observations, MGR event classification, approval/hold queue, location readiness and native vs provider provenance. It is not deployed and has no customer, provider, OAuth, backend, sender, persistence, telemetry, analytics, PHI or live actions. Review its dark-default/light-option UX, 360/390/768/1440 responsiveness and deterministic fixtures before deciding whether a real runtime is worth building.

**Differentiator hypothesis:** transparent cross-source coverage, human decisions and evidence integrity—not another commodity rating dashboard or review sender. Test whether a human operator can correctly identify a rating click versus a published review, stale/withheld coverage, the next approver, and a route-policy hold within approximately one minute on four fictional scenarios. **G3b**, any real customer/production runtime or integrations, still requires explicit Product/Portfolio, tenant, privacy, cost, security and customer approvals.

## Mode A runtime readiness

**Mode A live/runtime remains separately gated.** The owner-authorized G3a local workbench proof is not Mode A routing and does not authorize tenant APIs, customer delivery, production infrastructure or deployment. Real Mode A is still conditional on demonstrated value and separate acceptance.

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
