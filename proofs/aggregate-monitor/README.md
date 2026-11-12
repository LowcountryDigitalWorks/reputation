# Provider-independent aggregate review monitoring — source-only proof

**State:** OFFLINE TESTED CANDIDATE; not deployed, not a recurring job, not a Google API integration. Related product authority: [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7). The accepted 0.1 roadmap continues to defer a functional runtime; this proof must not be construed as release authority.

Run: `node --test proofs/aggregate-monitor/test/aggregate-monitor.test.mjs` from the repository root. No npm dependencies, network access, secrets, customer data or scheduler.

## Why this exists

An existing healthcare-practice ClientOps engagement has approved GBP **Manager** browser access, an official customer-owned Google review link, and a native review queue. MGR cannot be assumed suitable for healthcare data, and its separate project is held. The first usable service is native manual GBP observations + a verified direct review QR + clinic-approved reply handling. ClientOps already generated and verified the QR; **do not duplicate it**. Commercial promises, monitoring cadence and customer delivery remain separately gated.

**Do not put a real client name, address, account ID, reviewer, patient or DFD-specific metric in this PUBLIC repository, including test fixtures or future CI logs.** Tests use only a fictional organization.

## Exact input boundary

An observation is a strict plain JSON object with:
- `schema: "ldw.reputation.public-aggregate.v1"`
- `locationKey`: opaque kebab-case identifier (no personal data)
- `source`: `google_business_profile_manual` or `google_business_profile_official_api`
- `state`: `observed`, `unavailable` or `not_authorized`
- `observedAt`: UTC timestamp ending `Z`, whole-second resolution
- `rating`: number 1–5 with at most two decimals, or null
- `reviewCount`: nonnegative integer or null
- `unrepliedCount`: nonnegative integer or null

Every field is required. Unknown fields—including reviewer identity, review text, patient name/email, notes, tokens, requests and visits—fail closed. Unavailable/not-authorized means ALL metrics null, **not zero**. An observation is asserted input, not independent provider attestation.

`compareAggregateObservations(previousOrNull, current, {asOf, maxAgeHours=336})` produces a deterministic, aggregate-only diff with an explicit freshness state. 336 hours is a **prototype freshness parameter**, not a customer service entitlement. It holds on stale/unavailable/not-authorized/future evidence, source switching, location mismatch, conflicting duplicate timestamps and out-of-order data. Any net count decline requires reconciliation. It reports **net count movement**, never newly published reviews or attribution to an outreach request. Star-average movement may be a rounded display shift.

Every output says **OFFLINE_SOURCE_ONLY_NOT_PROVIDER_VERIFIED** with `customerDeliveryAuthorized=false`, `productionMonitoringEnabled=false` and `autoPublicReplyEnabled=false`. No data storage, polling, OAuth, account mutation, PHI, raw review content or customer reporting is implemented.

## Reuse existing LDW components; do not reinvent

| Option | Decision and evidence |
|---|---|
| GBP native review queue | **USE NOW (manual)** with customer-owned access and agreed human monitor; does not require MGR, cloud or a new service. Practice reviews and approves all reply language without confirming patient relationship/care. |
| GBP official Reviews API | **LEGAL/POLICY HOLD FOR HISTORICAL AGGREGATION.** Project access, OAuth and account-owner consent are necessary but insufficient: Google says stored API *Content* may be kept only temporarily for up to 30 days, securely, and must not be manipulated or aggregated. This proof therefore returns `API_CONTENT_POLICY_HOLD` for any `observed` API-sourced row. Do not persist/reuse API-derived review snapshots or unlock an automated multi-client report until exact scope and permitted data use receive provider/legal acceptance. [Official policies](https://developers.google.com/my-business/content/policies), [API review data](https://developers.google.com/my-business/content/review-data), [setup](https://developers.google.com/my-business/content/basic-setup). |
| Google notifications/Pub/Sub | **WATCH** until official API approval and sufficient volume; requires separate Pub/Sub topic/IAM, subscription, cost and operations. [Official notifications](https://developers.google.com/my-business/content/notification-setup). |
| Windsor.ai | Product supports Google Business Profile, but authenticated LDW connector inventory **currently exposes Clarity only**; GBP is not connected. A client-authorized connection/privacy/cost decision is needed. |
| Places API | **SKIP** for this use: rating/count uses billed Enterprise tier and review content returns at most five with higher costs; unsuitable for full owner response queue. [Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details). |
| G.A.S./GSC/Clarity/ZeroRank | Search and traffic evidence, **not** evidence of new reviews, review requests, or reply completion. |
| MGR | LDW owner KEEP for ordinary SMB use; DFD data-flow and hosted free-text form remain separate healthcare gates. |


## Human-invoked stdin comparison — no persistence

The optional tool `tools/compare-manual.mjs` wraps the **already accepted pure module**, so a permitted operator can locally compare *two separately verified native GBP aggregate observations*. It does not read a file path, write an output file, call a provider, auto-discover locations, or create a customer report. Read-only source-only proof: do not send the output externally without the separate ClientOps/reporting release gates.

Paste an input object into stdin interactively and terminate stdin, or feed a **fictional** fixture in a local shell. Example with fictional numbers (never real customer data in this public repo):

```sh
node proofs/aggregate-monitor/tools/compare-manual.mjs <<'JSON'
{"previous":{"schema":"ldw.reputation.public-aggregate.v1","locationKey":"fictional-harbor-market","source":"google_business_profile_manual","state":"observed","observedAt":"2026-11-09T12:00:00Z","rating":4.25,"reviewCount":12,"unrepliedCount":null},"current":{"schema":"ldw.reputation.public-aggregate.v1","locationKey":"fictional-harbor-market","source":"google_business_profile_manual","state":"observed","observedAt":"2026-11-12T12:00:00Z","rating":4.33,"reviewCount":16,"unrepliedCount":null},"asOf":"2026-11-12T13:00:00Z"}
JSON
```

The request has exactly `previous` (observation or `null`), `current`, and `asOf`, with optional `maxAgeHours`. All timestamps must be operator-supplied UTC seconds and every observation has a closed schema. An attempted reviewer name, clinical text, patient email, token or other field causes exit status 2 with only `AGGREGATE_INPUT_HOLD` on stderr and *no partial output or echoed input*. Input is limited to 16 KiB, and all other source guards (including Google API Content policy hold) remain enforced.

Do **not** feed PHI, Google review bodies, customer lists or credentials into this tool. For any real clinic observation, use the approved local/private execution surface and client-owned record; never commit real site names, identifiers, private URL tokens or results to this public repo, GitHub issues or shared logs. The human operator must still check native Google, observe the verified time, obtain permission for storage/reporting, and have an agreed monitoring cadence; this tool does none of those things. Test with `node --test proofs/aggregate-monitor/test/*.test.mjs`.

## Future operating and release gates

1. Verify each client's delegated native GBP role and official review destination. Never put review content/identities, patient or customer lists, tokens, business account IDs in this public repo.
2. Define an authorized person/cadence and a private approved observation record. Native Google remains the **system of record**; no scrape/HTML automation.
3. For two dated, same-source observations, run the pure comparison. If count drops, source switches, is stale or cannot be observed, send **manual exception**, never a favorable claim. Suggested reply work remains inside native GBP with human/customer approval.
4. Route only **accepted sanitized aggregate evidence** into the EXISTING REPORT-AUTO #348 Layer 1, after schema/factual contract readback. Its current narrative parity/customer-delivery gates remain open; no report publishing by this proof.
5. **Google API policy gate before connector engineering:** Google's [GBP API policy](https://developers.google.com/my-business/content/policies) currently restricts storage of API Content to up to 30 calendar days for performance purposes and expressly disallows manipulation or aggregation of stored Content. Whether a specific API-returned aggregate, derived metric or long-term historical report is permissible must be determined with provider/legal review, not assumed. The reference `google_business_profile_official_api` is structurally recognized but `observed` content is **held by code** from this comparison/report path. Even after API access and OAuth approval, this hold must not be removed without a source-backed, scope-specific policy decision. Manual native GBP observations and approved private service records must also respect client permissions and applicable terms. A future review-queue connector raises additional healthcare, consent, retention and secure storage questions.
6. No patient outreach or selective positive-review asking, fake reviews, auto public replies, public review widgets, new scheduler, MGR connector for a dental patient workflow, billable Places API, or customer-facing launch from this proof.

**Distinct acceptance states:** OFFLINE_DIFF_TEST_PASS (this candidate, subject to exact-head GitHub CI + independent review), GBP_API_CONTENT_AGGREGATION (POLICY HOLD), GBP_API_INGEST (NOT BUILT), REAL_MONITORING_CADENCE (NOT ACCEPTED), CUSTOMER_REPORT_DELIVERY (NOT AUTHORIZED).
