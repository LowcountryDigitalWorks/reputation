# Reputation and Portable Contact Cards — November 2026 market assessment

Status: **RESEARCH CANDIDATE / source-only**. Owning issue: [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7); related private MGR proof: business-operations #652. This document is **not** approval for a runtime, new repository, client deployment, production integration, purchase, public claim, or outreach.

## Recommendation

1. **Reputation is a managed Local Visibility / Website Growth service module first**: configure the customer-owned Google Business Profile and existing CRM/POS/scheduler, and use the already-owned **More Good Reviews (MGR)** capability where it demonstrably reduces operator work. Offer reputation setup/management as an optional add-on where needed. Do not reinvent MGR commodity functions.
2. **Contact Exchange is a distinct product-definition lane**, not a Reputation recipient database. The 2026-11-11 owner handoff in [business-operations #783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783) assigns definition and sequencing to Reputation GM01. The product gate is **PILOT BEFORE REPO**, not permission to create a new repo or production runtime. Existing LDW /connect is Website ORCH-owned.
3. **Shared conversion touchpoints:** a contact card may contain a clearly labeled voluntary "Leave a review" link for a genuine customer, always to the same neutral customer-owned destination regardless of expected sentiment; it can also link to booking and contact. Review asks and prospect-lead capture have distinct consent/data/retention ledgers.

## Market snapshot (public vendor prices; researched 2026-11-10)

| Provider | Public starting price | Relevant capability | LDW disposition |
| --- | --- | --- | --- |
| Google Business Profile | Native profile/review link and review replies; no third-party platform fee for those native surfaces | Review link/QR, read/reply and owner-controlled listing | CONFIGURE NATIVE first, customer-owned. API needs separate OAuth authorization |
| More Good Reviews | Business $59/location/month monthly or $49/location/month yearly; Agency $99/month incl. 5 locations, +$12/extra location (public retail pricing, **not** LDW's LTD economics) | Email/SMS asks, follow-ups, QR/review pages, widgets, GBP/Facebook, AI drafts, MCP, API/webhooks, white label | INTEGRATE EXISTING under proof #652; no new subscription |
| NiceJob | Starter $75/mo; Pro $125/mo | Review asks, widgets, social proof, referrals and NPS on Pro | REFERENCE / competitor, not immediate purchase |
| GatherUp | Local $99/mo per location billed annually; multi-location from $60/location/month billed annually; agency custom | Request/monitor/reply, feedback/NPS, widgets, 100+ source coverage | REFERENCE / potential specialist alternative |
| HighLevel | Starter $97/mo (3 subaccounts), Unlimited $297/mo, Agency Pro $497/mo, with usage-based extras | Broad CRM, workflows, reviews, social and sales suite | REFERENCE / native if client already owns; no extra LDW platform |
| Birdeye / Podium | Public quote required / no reliable single list rate | Large-suite reputation, messaging, listings, analytics | REFERENCE; do not invent quote prices |
| HiHello digital cards | Free personal; Professional $6/user/mo annual; Business $5/user/mo annual, min. team | vCards/QR, wallet, business-card scans, team card management, CRM | REFERENCE / competitive baseline |
| Blinq digital cards | Free; Premium $9.99/mo monthly; Business $6.99/user/mo monthly or $4.99/user/mo annually | QR, wallet, team templates, lead capture and CRM synchronization | REFERENCE / competitive baseline |

Sources: [Google Maps policy](https://support.google.com/contributionpolicy/answer/7400114), [Google review API](https://developers.google.com/my-business/content/review-data), [MGR pricing](https://www.moregoodreviews.com/pricing/), [NiceJob pricing](https://get.nicejob.com/pricing), [GatherUp pricing](https://gatherup.com/pricing/), [HighLevel pricing](https://www.gohighlevel.com/pricing), [Birdeye pricing](https://birdeye.com/pricing/), [HiHello pricing](https://www.hihello.com/pricing), [Blinq pricing](https://blinq.me/pricing). Prices are vendor-advertised USD and subject to plan/billing changes; no LDW selling prices are established here.

## Capability coverage and reuse matrix

| Capability / LDW job | Existing alternative | Evidence grade | Fit / decision | Next proof or gate |
| --- | --- | --- | --- | --- |
| Neutral public review link / QR | Native GBP, MGR QR page | **REAL_CONFIG_PREVIEW_TESTED** in LDW MGR: low/mid/high no-submit preview all show the same Google public-review option; actual recipient click not proven | FIT_NOW / CONFIGURE NATIVE or MGR, no custom engine | Preserve passing routing; for production separately prove live recipient journey and customer ownership |
| Review request, reminder, suppression, delivery | MGR email, client-owned CRM/POS/email | MGR existing synthetic email REAL_SCOPE_TESTED; production not accepted | CONDITIONAL_FIT / INTEGRATE EXISTING | Dedupe, consent, suppression, cost/operator-time, recipient-controlled send |
| Review monitoring / response drafts | MGR GBP/Facebook; native GBP API | SOURCE_ONLY | CONDITIONAL_FIT / human reviewed | Authorized business-profile OAuth and reply approval, no auto-public replies |
| Social proof/widget | MGR widget | SOURCE_ONLY | CONDITIONAL_FIT / genuine consented reviews only | Proven provenance/permission, domain allowlist, website ORCH approval |
| Contact QR and offline vCard | Existing /connect, R&I Contact Exchange proof #783, MIT OSS | **SYNTHETIC_TESTED**: R&I 25/25 tests, QR decoded and browser 390/768/1440; GM01 hardening 30/30 tests; phone untested | PROVE_SPECIFIC_USE / PILOT BEFORE REPO | Verify actual Android/iPhone import, QR print/NFC destination and accessibility before source ownership |
| Dynamic card URL / NFC target | Web-managed canonical URL | SOURCE_ONLY | CONDITIONAL_FIT / BUILD SMALL LDW LAYER if demand | Idempotent route/destination update with closed redirect allowlist, owner export |
| Card-to-CRM contact capture | SuiteDash/CRM native form/webhook, R&I `contact.followup.proposed.v1` | **SYNTHETIC_TESTED** offline strict dry-run; real provider write untested | CONDITIONAL_FIT / integrate only with explicit visitor consent | Signed owner-approved one-shot adapter, replay dedupe, privacy retention, receipt/readback and failure test |
| QR analytics | Aggregated server counts / existing site analytics | SOURCE_ONLY | CONDITIONAL_FIT / privacy-minimal | No tracking of individual review authors; opt-out/no cookie by default |
| Agency entitlements and portability | **Owner KEEP** purchased MGR Plan 3 LTD; project MCP live | Real scoped read + synthetic email receipt; 3-code agency term and agency/projects observed; no live accepted-client isolation or full-project export proof | ADOPT_SPECIFIC_USE / owner KEEP as provider; customer rollout separately gated | Per-client role/isolation, full export limitation, no PHI, human public-reply approval |
| PHI / regulated workflows | Client-owned compliant systems | Vendor explicitly not designed for PHI | NOT_FIT for MGR regulated data | Keep PHI out; separate deployment/BAA review if ever pursued |

No whole-product rejection follows from an untested subsystem. MGR is **owner-accepted KEEP** per [#652](https://github.com/LowcountryDigitalWorks/business-operations/issues/652); the LDW no-submit rating-preview is proven, but project-only MCP cannot alone establish whole-project portability, accepted live-client isolation, or post-email recipient behavior. Neither source nor vendor promises authorize a customer launch.

## Open-source / self-hostable shortlist

| Candidate | License (source-stated) | Useful pieces | Risk and disposition |
| --- | --- | --- | --- |
| [overtonlabs/qr-business-card](https://github.com/overtonlabs/qr-business-card) | MIT | Static, offline QR-embedded vCard, no runtime backend, restrictive CSP, unit/Playwright roundtrip tests | **PROVE / REFERENCE** a tiny local/static QR generator; test phone import, QR size, encoding and security before reuse |
| [kspkr/QrForge](https://github.com/kspkr/QrForge) | MIT | Attractive QR designer, static/dynamic destinations, API/CLI, privacy-reduced analytics | **REFERENCE / conditional reuse**. Larger Go/React server stack is excessive for v0; independently review threat model, update activity and secure redirect behavior |
| [brightcolor/cardnexus](https://github.com/brightcolor/cardnexus) | MIT | Multi-tenant card pages, QR/NFC/vCard, team permissions, lead capture and CRM-oriented architecture | **REFERENCE / bounded security assessment**. Small/new community, complex auth+billing+PII surface. README includes sample default admin credentials: never deploy unchanged, never run remote quickstart with sudo blindly |
| [kevinwielander/digital-business-cards](https://github.com/kevinwielander/digital-business-cards) (OwnCardly) | MIT | Standalone HTML export, profile designer, team templates, QR/vCard | **REFERENCE / selective reuse**; Next/Supabase persisted identity stack is unjustified before real team/CRM demand |
| [MrCrin/swiish](https://github.com/MrCrin/swiish) | AGPL-3.0 | Card templates, PWA, QR, privacy settings, self-hosted admin | **REFERENCE_ONLY** unless AGPL obligations reviewed; heavier running stack |
| [LinkStackOrg/LinkStack](https://github.com/LinkStackOrg/LinkStack) | AGPL-3.0 | Mature link-in-bio/card UX, QR/vCard, admin | **REFERENCE_ONLY** for public UX; copyleft network-use implications before code reuse |

Not every "OSS reputation management" listing is suitable or reputable. None of these replaces MGR's end-to-end review workflow without adding major identity, communications, policy and maintenance burden. License and security review must be performed on pinned exact commits before ingesting code; source claims are not independent acceptance.

## Differentiation and packaging

**Strongest hypotheses (max three):**
1. **Portable customer-owned destinations**: official GBP/location mapping, neutral review CTA and exportable destination inventory independent of MGR, with QR that survives vendor changes.
2. **One cross-tool evidence ledger**: service-completed event -> permissioned neutral ask -> delivered/clicked -> independently observed published review -> human-reviewed response -> local visibility report. Each step is separately evidenced; never claim click = review.
3. **Contact-card-to-CRM handoff**: QR/NFC/vCard + booking, opt-in two-way contact capture and scoped CRM integration for in-person local businesses. Keep inbound prospects out of review-recipient flows by default.

**Commodities to skip building now:** managed SMS/email engine, AI review writer, social marketing suite, broad CRM, Google OAuth connector from scratch, multi-source review scraper, general-purpose link-tree platform, proprietary NFC hardware, automatic public review replies.

**Packaging proposal for GM commercial review:** reputation baseline included as an operational option in a managed Website Growth / Local Visibility tier; one-time setup and managed monitoring as priced add-ons only after cost/labor evidence. Contact cards are a separate optional lead-capture/identity module with cross-sell links. These are positioning hypotheses, **not approved client offers or price commitments**.

## Smallest no-spend validation (2026-11-11 reconciliation)

1. **Completed, bounded:** MGR Plan-3 provider is owner-accepted KEEP under #652; existing synthetic email receipt/opt-out confirmed, and the **no-submit preview** of low/mid/high review paths showed the same public Google option. Do not repeat sends or disturb the passing routing config. Real post-email navigation/client isolation are still separate gates.
2. **Completed, bounded:** R&I's fictional static card + QR/vCard + `contact.followup.proposed.v1` local dry-run tested 25/25, with responsive browser QA. GM01 obtained and checked the owner-private source, found RFC 2426's required `N` vCard 3.0 property missing, and published an **offline corrected v2 proof (30/30)** to the *same private research folder*; canonical record is [Contact Exchange #783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783). No production source or new repo created.
3. **Next proof:** real Android/iPhone scanning and vCard import with fictional profile, under Website ORCH #140 (preserve `/contact/` vs `/connect/` owning decision), followed by ONE independently approved synthetic SuiteDash/CRM adapter with sender authentication, consent, tenant mapping, dedupe, receipt and rollback. No real lead write or review request from a scan.
4. **Product decision:** Reputation GM01 explicitly adopted `PILOT BEFORE REPO` for Contact Exchange under #783. A dedicated `contact-exchange` repository remains owner/GM product-line gated until physical-device value and CRM requirement justify it.

**STOP / HOLD:** no customer sends, public replies, widget publishing, OAuth, SMS, commercial launch, live lead capture, PHI, new account, spend or production code. Exact review/policy and owner approval remain required. Retest public prices and licenses before procurement/implementation.
