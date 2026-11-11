# MGR-backed Reputation service operator playbook

Status: **OWNER KEEP / PROVIDER CONFIGURATION CANDIDATE / NO CUSTOMER LAUNCH**. MGR Plan 3 KEEP was accepted by Eddie under private #652; the current document is an operator playbook candidate, not a production approval. Governed by [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7), private business-operations #652 and [Product](../PRODUCT.md). No production/client outreach or provider routing change is authorized by this document.

## System of record

- Client owns original Google Business Profile/Facebook account, official review links, CRM/POS/scheduling, sender identities and consent records.
- MGR is an **optional replaceable provider adapter** for neutral review requests, review monitoring, draft replies, review widgets and project-scoped MCP/API.
- LDW's service contract owns setup choices, source/destination mapping, policy-safe configuration and reports; it must **never** claim MGR click or request is a published review.
- Read live provider and repo state before each material configuration/change. Do not store keys, recipients, mailbox addresses, review text, real customer records or account identifiers in this public repo.
- The project MCP is a real read/write surface. Use least privilege, preserve the project boundary, review the *exact* proposed write, and never use bulk, delete, SMS, external reply or production outreach from unreviewed automation.

## Checklist — each new client/location

1. **Qualification:** Determine whether existing CRM/POS/booking/GBP native features already solve the need. Do not ingest a new customer list or install a parallel review platform without a measured gap. Confirm client owner and acceptable service cost.
2. **Identity/tenancy:** Owner KEEP and 3-code agency entitlement are recorded in #652, with LDW and separate test projects identified; verify each **new real client** project's isolation/permissions and account-level access in its exact approval scope, not from one LDW project read. Maintain tenant-scoped identities, separate projects, explicit staff roles, export/offboarding map.
3. **Destinations:** Administrator configures official business-controlled Google/Facebook link. Validate HTTPS, legitimate location, and closed redirect destinations. A review QR must **not** encode names, emails, transaction IDs, visit dates, sentiment, score, or other per-recipient data.
4. **Neutrality:** The *same* honest-public-review opportunity is always available for every eligible recipient. Test both one-star and five-star branches and negative/private feedback paths. If any public link appears only for positives, **STOP** (Google selective solicitation rule). No rewards or star targets; no request to mention staff or revise/remove reviews.
5. **Communications:** Default no new send. One prior owner-controlled synthetic email request with all five rating choices and unsubscribe was already delivered; do **not** repeat it simply to generate proof. For a separately authorized live client, validate exact template, opt-out, reminder/cadence, dedupe and suppression. SMS requires customer consent, local law/A2P review, provider setup and variable-cost approval.
6. **Responses:** Review monitoring can produce drafts. Human approval before *every* public owner reply. MGR automatic Google/Facebook replies OFF during initial use. Never use vendor AI review-writing prompts as a way to pressure or manufacture customer reviews.
7. **Widget:** Only verified genuine authorized reviews, with rights to display, current source/attribution and no synthetic provider samples. Restrict widget allowed domains; website ORCH accepts actual CSP, performance and mobile layout before publish.
8. **Evidence:** Track eligibility/request/delivery/click separately from externally observed review/reply, with source, timestamp, location, actor, test/prod class and permitted retention. Never infer that one click caused a particular Google review.
9. **Security:** Keep credentials in approved stores; use short-lived/revocable project-scoped connection where available. Treat API/webhook events as untrusted until authenticating signatures, proving retry/idempotency and tenant mapping. Never put PHI in MGR; provider is not positioned as offering a healthcare BAA.
10. **Offboarding:** Export customers and reviews through documented CSV where authorized; separately inventory review pages, widgets, tags, sources, locations, templates, automations, domains and provider integrations because whole-project export remains unproven. Verify customer review destinations remain owned outside the provider; revoke MGR keys/connections and plan any widget swap.
11. **Commercial acceptance:** Record operator minutes per setup/month, additional location/client margin, request volume, support incidents, variable email/SMS cost, quality of reporting, agency entitlement, exact refund/renewal dates and rollback plan before any customer offer.

## Safe LDW project configuration baseline

| Field / capability | Intended configuration | Proof requirement |
| --- | --- | --- |
| Project website | Canonical LDW website | Read back via scoped MCP |
| Brand primary | Cypress Teal `#2F766F` | Provider write + readback; keep logo unchanged unless reviewed |
| Hosted-page title | `Lowcountry Digital Works | Share Feedback` | Provider write + readback; no testimonial or performance claim |
| Hosted-page description | Neutral invitation for honest feedback, including improvements | Provider write + readback |
| Default review visibility | `show` | Readback only. **Does not** establish neutral branch routing |
| Rating path / review destination | Same genuine public-review opportunity at all rating levels | **PASS for no-submit LDW project preview** at low/mid/high: same Google public-review button, independent private feedback path. **UNTESTED real post-email click/client deployment**. Do not alter passing redirects/revealer |
| Widgets/showcase | Unpublished until review provenance & website acceptance | Provider widgets readback + site approval |
| Auto public replies | Disabled for any live program | Verify exact account setting outside project-only MCP before deployment |
| Customer outreach/SMS | No new send by default | Separate explicit gated synthetic/customer authorization |

Never modify an unknown setting solely to match a guessed vendor UI default. A provider screenshot, site test or real account readback is required before declaring an unexposed setting configured.

## Provider capability and boundary inventory

MGR currently advertises: project MCP, API and webhooks; Google/Facebook review integration and replies; emails and bring-your-own SMS providers; review pages, QR codes, widgets and share templates; location and customer records; agency/client controls; optional AI content. See [MGR pricing/features](https://www.moregoodreviews.com/pricing/). Project MCP reads and reversible safe presentation settings prove the LDW project functions, and prior owner-controlled synthetic email receipt proves that narrow email delivery. Eddie separately accepted the purchased MGR Plan 3 **KEEP** under #652. These facts do **not** prove Agency MCP integration, complete export, arbitrary real-client isolation, Google OAuth/auto-reply safety, SMS consent or a production launch.

Known narrower outcomes may be accepted while other families remain `UNASSESSED`. Do not label MGR as fully production-ready from branding success.

## Contact-card composition boundary

GM01 acknowledged product ownership under [Contact Exchange #783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783) and set **PILOT BEFORE REPO**. R&I's offline fictional static card, QR/vCard and strict opt-in dry-run contract passed 25/25 tests; GM01 independently reproduced those tests and published an RFC 2426 structured-name/guard-hardening ZIP (30/30 tests) in the **same private Drive research folder**, with exact fingerprint in #783. The original R&I ZIP remains preserved. No new public card, CRM send or Reputation runtime is authorized.

A public card is a **contact/identity surface**: HTTPS canonical business URL, contact/vCard download, QR/NFC to *card URL*, booking CTA, and optional explicitly opted-in lead-submission to the existing CRM. A neutral review link is just a separate labeled destination, not a lead funnel. For printed cards choose **URL-based QR** for revisable content and separate **direct vCard QR** if offline import is required; they have different security, analytics and update properties.

Never auto-create an MGR review recipient from a card visitor, a card scan or a lead submitted for a sales inquiry. Only an independent legitimate business-completed event and independently authorized neutral outreach may produce a review request.

## Rollback and pending gates

- Brand/meta: restore prior values via the same project-scoped settings APIs after capturing a readback. Avoid client commitments based on these values.
- Routing: **preserve the passing no-submit preview configuration** for low/mid/high Google option; a real recipient click and real customer acceptance remain separate. Do not flip or "fix" a passing rating-route configuration speculatively.
- MGR provider decision: **Owner KEEP already accepted** under business-operations #652; this does not waive real-client access/consent, export/offboarding, operator labor, no-PHI, widget policy, production, SMS or auto-reply gates. No further code/plan purchase required.
- Contact product: **GM01 owns Gate 1 / PILOT BEFORE REPO** under #783; real device vCard import and one separately approved synthetic CRM adapter precede any source repository or public launch. Public website changes belong to Website ORCH #140.
