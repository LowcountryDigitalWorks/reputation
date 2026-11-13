# MVP and Roadmap

**Current decision (November 2026): SERVICE-FIRST / CONDITIONAL ROADMAP / NO CUSTOMER LAUNCH / NO FUNCTIONAL RUNTIME.** The accepted product baseline is Release 0.1. Portfolio research is active under [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7) and [Portfolio roadmap #454](https://github.com/LowcountryDigitalWorks/business-operations/issues/454), but that is **not** authorization for a new app, integration, outreach, production infrastructure or customer delivery. The source-only, fictional-data offline aggregate comparison and stdin CLI have been merged through [PRs #12–#16](https://github.com/LowcountryDigitalWorks/reputation/pull/16), with held-input redaction and 59 Node tests at the accepted PR #16/17 baseline; [PR #17](https://github.com/LowcountryDigitalWorks/reputation/pull/17) documents the MGR positive-rating redirect policy hazard. Those are **internal tools and governance, not an active monitoring service**.

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

## Execution roadmap — three evidence gates, no speculative release dates

These are **decision/acceptance gates**, not three new releases. Carry them in the **existing** [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7), private [ClientOps #175](https://github.com/LowcountryDigitalWorks/business-operations/issues/175), and existing [MGR owner decision #652](https://github.com/LowcountryDigitalWorks/business-operations/issues/652); no duplicate product ticket, scheduling service, CRM workflow or repo is needed.

| Order / owner | Job and smallest next proof | Exit evidence / decision | Stop / cost boundary |
| --- | --- | --- | --- |
| **G1 — Native Reputation Essentials** — ClientOps #175 owns client agreement/clinic execution; Reputation owns reusable neutral/source contracts. **BLOCKED: client authority and real operating cadence** | Confirm a practice-approved human operator, native GBP access and direct business-owned review link/QR, review-queue cadence, public-reply approver, private permitted aggregate record, escalation and commercial scope. An authorized operator may read the Search **More → Notifications → Customer activity** switch manually, but an unverified switch **does not require Orca or a new API** and cannot itself prove monitoring. Then execute **one authorized native queue check**, and a second dated same-source check only when cadence permits. Use existing [private Reputation Essentials SOP](https://app.gitbook.com/s/TJYWvAvxCyquoBTc5kVY/products-and-services/reputation-essentials-native-review-link-and-manual-monitoring) and source-only comparator as optional operator aid; do not duplicate existing DFD Google review link/QR. | Private ClientOps approval and named operator/cadence/reply decision, recorded actual source/as-of and observed coverage, two compatible authorized aggregate observations **only if trend is claimed**, human time spent and clear status **SERVICE ACCEPTED / HOLD / NO SERVICE**. No inferred new-review attribution; no report send merely from this gate. | **Stop** if clinic authority, human coverage, private permitted record or healthcare safeguards are absent. No PHI/reviewer names/text, automated replies, MGR patient-form capture, review gating, new provider/credential, API or promise of a new subscription. $0 incremental tooling. |
| **G2 — Existing MGR for nonregulated SMBs** — Reputation owns provider-safe proof; each real client through ClientOps. **CONDITIONAL / provider owner KEEP, not customer-ready** | First ask whether the client's own CRM/GBP already suffices. On the **existing LDW-controlled, nonregulated** project, reuse current no-submit low/mid/high preview evidence. When separately approved, prove one all-**1–5** rating-path, link/revealer, after-click and after-submit **synthetic-only** journey, exact destination and tenant, account auto-reply and suppression, consent, export/offboarding and operator minutes. Re-read [MGR playbook](operations/MGR_PROVIDER_SERVICE_PLAYBOOK.md) and [vendor Links](https://docs.moregoodreviews.com/platform/review-pages/links) / [Redirects](https://docs.moregoodreviews.com/platform/review-pages/redirects) because different ratings can reveal different public options. | Document a precise **NEUTRAL_ROUTE_PASS** or **RATING_ROUTE_POLICY_HOLD** with five paths and actual state evidence, plus a client-specific data/cost/support/release approval **before** any real send. Retain owner-approved Plan 3 KEEP; no purchase needed. | **Stop** if Google review link is withheld or less readily available based on favorable sentiment, routing/permissions cannot be verified, provider would capture regulated data, or client-specific authorization is missing. An accessible revealer in a static preview alone is insufficient to prove the full journey. Do not use the DFD clinic project as an LDW synthetic test. |
| **G3 — Custom Mode A go/no-go** — Reputation Product ORCH with Portfolio/owner acceptance. **DEFERRED / no present product-code trigger** | Demand-first discovery: identify a **documented recurring gap** across actual approved client/workflows that native GBP, client CRM/scheduler, current MGR, and provider-neutral composition cannot cover. Compare portability, multi-location authoritative links, bounded *non-attributive* click evidence, export/offboarding, implementation/support burden and buyer value. Smallest $0 proof is a written decision and one fictional workflow sample, **not** a new production app. | Explicit **BUILD SMALL / COMPOSE / HOLD / STOP** decision, exact paying/internal sponsor and measurable operator burden or portability requirement, platform-policy/security review, $0 cost envelope, owner approval and narrow source/UX acceptance **before** a functional PR. Otherwise record **NO NEW FEATURE WORK**. | **Stop** if the need is commodity, one-off, compliance uncertain, vendor-native cheaper, or no owner/customer authorization. Mode A, Mode B, portal, review API, webhook monitoring, UI and customer deliveries remain **not authorized**. |

### Acceptance, measurements and packaging

- **Packaged service hypothesis:** Reputation Essentials belongs with LDW Website Growth / Managed Visibility as **native configuration + human-verified evidence**, rather than a separate SaaS subscription. The optional extended offering may add **human-approved response coordination / exception handling** under a separately approved service agreement. No listed tier, cadence, price, outcome claim or client entitlement is invented here.
- **Measure real value:** approved operator time per location and check, unresolved response work needing client decisions, missing/late source coverage, legitimate location-destination errors, support burden and existing-platform capability. **Do not** present net count change as newly received reviews, attribute ratings to outreach, claim an alert-receipt SLA, or convert an unobserved count to zero.
- **Reuse sources:** Google's [review link/QR](https://support.google.com/business/answer/16816815), [native notifications](https://support.google.com/business/answer/7198436) and [review queue](https://support.google.com/business/answer/3474050) before software; existing client CRM/communications before a new message sender; current MGR only for eligible nonregulated clients; existing [REPORT-AUTO #348](https://github.com/LowcountryDigitalWorks/business-operations/issues/348) for future sanitized evidence integration **only after its own factual/parity/customer-delivery gates**. [Google's GBP API policy](https://developers.google.com/my-business/content/policies) continues to hold stored API Content aggregation; the merged comparator enforces `API_CONTENT_POLICY_HOLD`.
- **User-facing design (only when separately authorized):** the product's [conditional visual/accessibility contract](operations/CLIENT_FACING_UI_ACCEPTANCE.md) requires distinct product identity, premium restrained glass, dark default and optional accessible light theme. The Website-owned accepted **/connect contact card is unchanged**; Contact Exchange [#783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783) remains a separate pilot.
- **Review this roadmap again only when** one of G1/G2 receives provider-positive acceptance, actual customer need changes the G3 economics, policy changes materially, or the owner directs a new release. Avoid creating synthetic functionality just to fill a release sequence.

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
