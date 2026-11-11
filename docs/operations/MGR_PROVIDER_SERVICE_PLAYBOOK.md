# MGR-backed Reputation service operator playbook

Status: **CANDIDATE / SOURCE-ONLY** for existing purchased provider. Governed by [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7), private business-operations #652 and [Product](../PRODUCT.md). No production/client outreach or provider routing change is authorized by this document.

## System of record

- Client owns original Google Business Profile/Facebook account, official review links, CRM/POS/scheduling, sender identities and consent records.
- MGR is an **optional replaceable provider adapter** for neutral review requests, review monitoring, draft replies, review widgets and project-scoped MCP/API.
- LDW's service contract owns setup choices, source/destination mapping, policy-safe configuration and reports; it must **never** claim MGR click or request is a published review.
- Read live provider and repo state before each material configuration/change. Do not store keys, recipients, mailbox addresses, review text, real customer records or account identifiers in this public repo.
- The project MCP is a real read/write surface. Use least privilege, preserve the project boundary, review the *exact* proposed write, and never use bulk, delete, SMS, external reply or production outreach from unreviewed automation.

## Checklist — each new client/location

1. **Qualification:** Determine whether existing CRM/POS/booking/GBP native features already solve the need. Do not ingest a new customer list or install a parallel review platform without a measured gap. Confirm client owner and acceptable service cost.
2. **Identity/tenancy:** Verify actual MGR plan entitlements and agency/client isolation from live account UI/agency permission surface, not from one project read. Maintain tenant-scoped identities, separate projects, explicit staff roles, export/offboarding map.
3. **Destinations:** Administrator configures official business-controlled Google/Facebook link. Validate HTTPS, legitimate location, and closed redirect destinations. A review QR must **not** encode names, emails, transaction IDs, visit dates, sentiment, score, or other per-recipient data.
4. **Neutrality:** The *same* honest-public-review opportunity is always available for every eligible recipient. Test both one-star and five-star branches and negative/private feedback paths. If any public link appears only for positives, **STOP** (Google selective solicitation rule). No rewards or star targets; no request to mention staff or revise/remove reviews.
5. **Communications:** Default no send. For a separate authorized proof, use owner-controlled synthetic recipient and email-first, with exact template, opt-out, reminder/cadence, dedupe and suppression review. SMS requires customer consent, local law/A2P review, provider setup and variable-cost approval.
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
| Rating path / review destination | Same genuine public-review opportunity at all rating levels | NOT PROVEN until safe live page/route test |
| Widgets/showcase | Unpublished until review provenance & website acceptance | Provider widgets readback + site approval |
| Auto public replies | Disabled for any live program | Verify exact account setting outside project-only MCP before deployment |
| Customer outreach/SMS | No new send by default | Separate explicit gated synthetic/customer authorization |

Never modify an unknown setting solely to match a guessed vendor UI default. A provider screenshot, site test or real account readback is required before declaring an unexposed setting configured.

## Provider capability and boundary inventory

MGR currently advertises: project MCP, API and webhooks; Google/Facebook review integration and replies; emails and bring-your-own SMS providers; review pages, QR codes, widgets and share templates; location and customer records; agency/client controls; optional AI content. See [MGR pricing/features](https://www.moregoodreviews.com/pricing/). Project MCP reads and reversible safe settings prove **only** that project-scoped functions work. They do not prove Agency MCP, billing, available routes, outgoing sender identity, Google integration, email consent, phone compliance or client tenant isolation.

Known narrower outcomes may be accepted while other families remain `UNASSESSED`. Do not label MGR as fully production-ready from branding success.

## Contact-card composition boundary

A public card is a **contact/identity surface**: HTTPS canonical business URL, contact/vCard download, QR/NFC to *card URL*, booking CTA, and optional explicitly opted-in lead-submission to the existing CRM. A neutral review link is just a separate labeled destination, not a lead funnel. For printed cards choose **URL-based QR** for revisable content and separate **direct vCard QR** if offline import is required; they have different security, analytics and update properties.

Never auto-create an MGR review recipient from a card visitor, a card scan or a lead submitted for a sales inquiry. Only an independent legitimate business-completed event and independently authorized neutral outreach may produce a review request.

## Rollback and pending gates

- Brand/meta: restore prior values via the same project-scoped settings APIs after capturing a readback. Avoid client commitments based on these values.
- Routing: do not flip or "fix" review gates without independently observing exact all-rating branch behavior and reviewing the proposed change.
- MGR service KEEP: prove agency entitlement, neutral 1-star/5-star experience, permission/exports, operator cost and recipient privacy; otherwise iterate/refund decision under business-operations #652.
- Contact product SPLIT: GM decides product owner/repository only after existing website /connect and OSS capability proof expose a genuine gap.
