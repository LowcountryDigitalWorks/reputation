# MVP and Roadmap

**Current decision (November 2026): SERVICE-FIRST + G3a SOURCE-ONLY UNIFIED OPERATIONS UX PROOF / G3b LIVE RUNTIME SEPARATELY GATED / NO CUSTOMER LAUNCH.** The accepted product baseline is Release 0.1. Portfolio research is active under [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7) and [Portfolio roadmap #454](https://github.com/LowcountryDigitalWorks/business-operations/issues/454), but that is **not** authorization for a new app, integration, outreach, production infrastructure or customer delivery. The source-only, fictional-data offline aggregate comparison and stdin CLI have been merged through [PRs #12–#16](https://github.com/LowcountryDigitalWorks/reputation/pull/16), with held-input redaction and 59 Node tests at the accepted PR #16/17 baseline; [PR #17](https://github.com/LowcountryDigitalWorks/reputation/pull/17) documents the MGR positive-rating redirect policy hazard. Those are **internal tools and governance, not an active monitoring service**.

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
| **G2 — Existing MGR for nonregulated SMBs** — Reputation owns policy-safe provider proof; each real client through ClientOps. **LDW 1–5 Google access OWNER-OBSERVED / per-client launch HOLD** | Preserve Eddie's direct [Nov 16, 2026 owner witness](https://github.com/LowcountryDigitalWorks/reputation/issues/7#issuecomment-6933606654): on **LDW's own nonregulated MGR page 14302**, all five ratings (1–5) reached the genuine public Google review destination; he also reported the previously questioned reveal/timing/button controls were fine. This **resolves the repeated LDW user-action request to reprove routing**; do not schedule or solicit the same test while Eddie is away from LDW01. The witness is not an independent browser transcript, precise settings-value readback, actual email-recipient/post-submit trial, or evidence about another project. For any *new real client*, first check whether its own CRM/GBP suffices, then separately verify exact tenant/page, client-owned public destination and all-rating neutrality, consent/channel/opt-out/suppression, human public-reply gate, export/offboarding, operator minutes and cost, using only separately authorized no-real-review tests if needed. | **LDW baseline:** `LDW_G2_ALL_FIVE_OWNER_WITNESS_ACCEPTED`, not a vendor-wide compliance certificate or client go-live. Preserve historic Oct 25 no-submit 1/3/5 preview and Nov 15 LDW UI page identity (1 link, 0 redirects); these are separate evidence sources, not fabricated independent all-five retests. **Per-client decision:** accept only with client-specific page/destination/consent/policy/support gates and named ClientOps release authorization. MGR Plan 3 **KEEP**; no new purchase. | **STOP** for positive-only public solicitation, low-rating suppression, wrong tenant/recipient, regulated/PHI data, missing client permission, unsanctioned sends/SMS, auto public replies, or cost/retention gaps. Do not use the DFD clinic project as an LDW proof or claim that owner observation authorizes production. |
| **G3 — Unified UX proof / real application go-no-go** — Reputation Product ORCH with Portfolio/owner acceptance. **G3a source-only proof authorized; G3b production not authorized** | Build and evaluate a **single local, static, fictional-data [Operations Workbench](../proofs/ops-workbench/README.md)** that distinguishes native manual aggregate observations, MGR click/form/message signals, route-policy holds, reply approval and cross-location source freshness. Test keyboard, dark/light, responsive widths and a short operator comprehension task. Compare with native/MGR workflows before deciding whether a single UX reduces work or mistakes. | **G3a** accepted only after exact-source CI, independent author-excluded security/UX review, honest visual QA and operator feedback. Then explicit **BUILD SMALL / COMPOSE / HOLD / STOP** for **G3b** with named sponsor, measurable work saved/errors prevented, lawful provider data rights, consent, storage/tenant/cost plan and owner acceptance. | **No** real tenant/customer data, Google API Content storage, MGR webhook feed, OAuth, sender, review text, public reply, backend, scheduled task, customer portal, deployment, paid services or Website contact-card change from G3a. G1/G2 stay independently held. |

### G3a / G3b split — unified Reputation Operations Workbench

**Owner correction (Nov 13, 2026):** Custom software should not be blanket-deferred if it makes a demonstrably better **unified operator UX** across existing first-party and vendor functions. A generic ratings dashboard has little differentiation: Google, MGR, HighLevel and GatherUp already offer substantial native interfaces. The testable value is a **trustworthy cross-provider operations desk** with one decision queue, explicit authorization, location ownership, source/as-of coverage, separately classified provider events, and an export/hand-off path. Existing native/vendor services remain the systems of record and may be opened from a future approved UI rather than reimplemented.

**G3a (SOURCE-ONLY UX FEASIBILITY, authorized):** `proofs/ops-workbench/` is a static local web experience with hardcoded *fictional* locations, a fixed fixture clock and no server APIs or persistent state. It reuses the accepted provider-neutral aggregate comparison source; a stale record shows **WITHHELD** rather than zero; a rating click cannot be promoted to a posted Google review; rating-conditioned public-routing remains a hold; even a fully approved fictional location has `customerDeliveryAuthorized=false`. Dark by default with independent light tokens, responsive 360/390/768/1440 and keyboard-native controls. The proof is a **human-comprehension experiment**, not a dashboard launch, monitoring service or product UI release. [UI acceptance contract](operations/CLIENT_FACING_UI_ACCEPTANCE.md) remains authoritative.

**Go/no-go experiment:** On four fictional cases, a reviewer must be able to find (1) source and observed-at, (2) what an MGR `review-created`-style click really means, (3) who must approve a reply/service, and (4) why a policy/stale state is held. Record time/confusions against the native/CRM/MGR alternative; do not retain real reviewer/patient/customer content in this public proof. Continue only if cross-source task completion is materially clearer and implementation/support cost beats composing existing tools. Visual/a11y/contrast/mobile regression and independent exact-head review must precede G3a acceptance.

**G3a live evidence checkpoint (November 19, 2026):** The owner observed a normal Windows checkout export render unstyled/uninitialized in Opera and Chrome, then verified that a separate LF-preserving checkout rendered the intended four-location dashboard. A real attended **NVDA 2026.2 Speech Viewer** session captured Workbench-specific location/pressed state, decision filters, disclosures, theme state and source/authority announcements; classify as `AT_REAL_SPEECH_VIEWER_INTERACTION_OBTAINED / PARTIAL_ACCEPT`, not full accessibility certification. The bounded [PR #39](https://github.com/LowcountryDigitalWorks/reputation/pull/39) CRLF/CSP exporter fix was independently reviewed, protected-merged to `main=7fe88be09997105eecc9401340c1aaa3c82f3f6f`, and passed [post-merge Validate #44675137755](https://github.com/LowcountryDigitalWorks/reputation/actions/runs/44675137755), including synthetic Windows CRLF-equivalent bytes and real headless Chromium computed-CSS layout. **Not yet obtained:** fresh normal-Windows-checkout *after* the fix, genuine unfamiliar-human 16-answer study, native/provider comparable tasks, and full AT task success. Preserve exact distinctions; see [owning #7 evidence](https://github.com/LowcountryDigitalWorks/reputation/issues/7#issuecomment-7030504370). New functional features and G3b live scope remain held pending a measured business/operator need, complete safety/cost/tenant gates and explicit Product/Portfolio decision; the owner has separately deferred the cold-human study, as recorded below.

**G3a owner disposition — November 20, 2026 (supersedes routine participant-study scheduling):** Eddie personally inspected the working fictional Workbench on LDW01 and explicitly accepted its current appearance and UX; **no additional unfamiliar-person review is requested at this time**. [Owner directive and narrowed evidence boundary](https://github.com/LowcountryDigitalWorks/reputation/issues/7#issuecomment-7031046502). Record status as `OWNER_VISUAL_UX_ACCEPTED_FOR_CURRENT_PROTOTYPE / COLD_HUMAN_STUDY_DEFERRED_BY_OWNER`. The earlier 4 × 4 cold-test design remains an optional future instrument—not a task to assign or an implied requirement for further source-only exploration. An independent comprehension study and native/MGR matched comparison were **not performed**; do not claim they passed. This direction **does not authorize G3b production**. Next practical work is **G1/G2 native-first service packaging**: use the customer's own official GBP review destination and existing CRM/POS/scheduler, keep the service unactivated until ClientOps/client approval and named operator/cadence/reply authority, and adopt already-owned MGR only for a demonstrated nonregulated need with per-client neutrality/consent/isolation checks. Require measurable recurring operator benefit, permitted data rights, privacy/cost/tenant design and a separate owner/Portfolio decision before proposing live custom software. No further Workbench feature sprint or study recruitment without new need.

**G3b (LIVE APPLICATION, NOT AUTHORIZED):** After G3a feedback and a measured workflow gap, decide narrow authenticated **operator-first read-only** capability before any client-facing portal. Define tenants/RBAC, allowed metadata, compliant native/provider source contracts (including [Google API Content restrictions](https://developers.google.com/my-business/content/policies)), encryption/retention, secret/auth boundaries, manual observations and approvals, billing/hosting/support, deletion/export and independent security review. Real DFD/native monitoring still requires ClientOps G1 consent; the **LDW-only G2 owner-witnessed route** does not waive each new MGR client's separate route, policy, data/consent and ClientOps release gates. Neither is bypassed by a polished UI. Owner/Portfolio product release approval is separate from merged source code.

### Acceptance, measurements and packaging

- **Packaged service hypothesis:** Reputation Essentials belongs with LDW Website Growth / Managed Visibility as **native configuration + human-verified evidence**, rather than a separate SaaS subscription. The optional extended offering may add **human-approved response coordination / exception handling** under a separately approved service agreement. No listed tier, cadence, price, outcome claim or client entitlement is invented here.
- **Measure real value:** approved operator time per location and check, unresolved response work needing client decisions, missing/late source coverage, legitimate location-destination errors, support burden and existing-platform capability. **Do not** present net count change as newly received reviews, attribute ratings to outreach, claim an alert-receipt SLA, or convert an unobserved count to zero.
- **Reuse sources:** Google's [review link/QR](https://support.google.com/business/answer/16816815), [native notifications](https://support.google.com/business/answer/7198436) and [review queue](https://support.google.com/business/answer/3474050) before software; existing client CRM/communications before a new message sender; current MGR only for eligible nonregulated clients; existing [REPORT-AUTO #348](https://github.com/LowcountryDigitalWorks/business-operations/issues/348) for future sanitized evidence integration **only after its own factual/parity/customer-delivery gates**. [Google's GBP API policy](https://developers.google.com/my-business/content/policies) continues to hold stored API Content aggregation; the merged comparator enforces `API_CONTENT_POLICY_HOLD`.
- **User-facing design (only when separately authorized):** the product's [conditional visual/accessibility contract](operations/CLIENT_FACING_UI_ACCEPTANCE.md) requires distinct product identity, premium restrained glass, dark default and optional accessible light theme. The Website-owned accepted **/connect contact card is unchanged**; Contact Exchange [#783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783) remains a separate pilot.
- **Review this roadmap again only when** one of G1/G2 receives provider-positive acceptance, actual customer need changes the G3 economics, policy changes materially, or the owner directs a new release. Avoid creating synthetic functionality just to fill a release sequence.

## Mode A live routing — separate G3b gate

Mode A live redirect routing, customer tenancy, provider integration and deployment remain **not authorized** pending a separate G3b decision. This does not block the already authorized local, fictional, non-deployed G3a operator-UX proof.

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

## Conditional client-facing UI acceptance (local G3a allowed; customer runtime gated)

Any **future separately authorized** Reputation application, customer workspace, approval queue or reporting UI must meet the product-local [Client-facing UI acceptance contract](operations/CLIENT_FACING_UI_ACCEPTANCE.md). The contract carries the owner's premium, liquid-glass-inspired, **distinct product palette**, **dark-by-default with optional light mode** direction while inheriting LDW identity, accessibility and product-trust boundaries. This is a design/review gate for future proposals; it does **not** authorize a new app, customer portal, runtime, report delivery or website change.
