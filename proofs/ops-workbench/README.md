# Reputation Operations Workbench — source-only UX feasibility proof

**State: FICTIONAL / LOCAL ONLY / NOT DEPLOYED / NOT CUSTOMER AUTHORIZED.** This is one bounded product-UX experiment, not a functioning reputation service, provider integration, or a licensed customer portal. Its only purpose is to assess whether one independent operator screen makes the differences among *native observation*, *MGR first-party activity*, *delivery lifecycle*, *policy holds*, and *human authority* easier to understand across multiple locations.

## Run locally (without dependencies)

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory .
```

Visit `http://127.0.0.1:8765/proofs/ops-workbench/` **locally**. The HTTP root must be the **repository root** because the source-only workbench imports the accepted sibling `proofs/aggregate-monitor/src/aggregate-monitor.mjs`; serving only the `proofs/ops-workbench/` subdirectory would make that module return 404. Do not expose this development server publicly. Close it after review. Tests: `node --test proofs/ops-workbench/test/*.test.mjs` from the repository root.

## Source and authorization contract

- Fixed fake names, fixed UTC clock (`2026-11-13T18:00:00Z`) and hardcoded fictional observations only. **No user upload/input**, customer/patient names, reviewer identity/text, phone/email, CRM contacts, API keys, or provider credentials.
- Browser **no network calls**, no storage/cookies/service worker, no analytics, no provider/Google/MGR account connection, no data persistence, no background polling, no request sender or public reply mechanism. Theme/location/filter selections are in-memory presentation state only. CSP includes `connect-src 'none'` and `form-action 'none'`; no external fonts, images or libraries.
- Reuses the existing `compareAggregateObservations` policy/freshness gate directly; a stale observation shows **Withheld**, never invented zero. Net count movement is **not** newly published reviews. A first-party MGR rating-link click is **not** a completed Google review; scheduled request is **not** delivery.
- Service readiness **does not** enable production even if every fictional approval value is true. All simulated actions are informational and read-only. No real action/link is available.
- The four fictional locations represent intentionally different states: current aggregate with MGR route unverified; a forbidden rating-conditioned route; an observation that is stale/withheld; and an all-approved fictional fixture that still cannot activate production. **None of these facts describe DFD, LDW's actual MGR project, or any client.**
- Distinct prototype palette: charcoal with aubergine/iris and warm amber evidence accents; dark default, designed light alternative. Manrope if installed locally, native accessible fallbacks otherwise. This proof is not a new LDW logo or a Website `/connect` contact-card change.

## Decision question and feedback criterion

**Test:** A reviewer selects each fictional location, opens a decision, reads source provenance, toggles light/dark and uses keyboard/mobile layout. Within about a minute, can they correctly answer: *What is actually known? What is only an MGR click? Who must approve the next step? Why is a count withheld?* The design succeeds only if these distinctions are obvious **without a tooltip or documentation tour**. Record reviewer findings in owning Reputation #7; do not store real client or reviewer details in this proof.

**Next gate:** independent code/privacy/a11y and visual review of local source-only proof, then Product/Portfolio user-feedback decision **BUILD SMALL / COMPOSE / STOP**. No customer, multi-tenant runtime, SaaS release, API integration, dashboard hosting, live portal, or outgoing service is authorized by this proof. Google Business Profile [API Content policies](https://developers.google.com/my-business/content/policies) must be re-reviewed before any later API-backed evidence. Future approved live operator workflows need actual tenant-specific permissions, client consent, signed/commercial scope, secure storage and explicit release acceptance.
