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

**Blind study handout:** For any cold human evaluation, give the reviewer **only** [OPERATOR_STUDY.md](OPERATOR_STUDY.md) and the running local Workbench. **Do not share this README with them**: the fictional-case table below is the facilitator answer key, and pre-exposure invalidates a cold study.

### Repeatable visual and operator evaluation — human testing still pending

1. Serve **repository root** on `127.0.0.1` as above. Use a real supported browser, no live account. Capture both themes at **360, 390, 768 and 1440 CSS px**, plus a 400% zoom/reflow check. Check clipped text, horizontal scrolling, status labels, contrast, focus visibility and practical touch targets. Do not count source/HTTP smoke tests as browser or accessibility acceptance.
2. Keyboard-only: Tab and Shift+Tab through location controls, activate each with Enter/Space, use decision filters, open/close a decision with the keyboard, toggle dark/light, and verify that **focus stays on the same location button after selection**. Check reduced-motion behavior and screen-reader announcements separately. A synthetic DOM test protects button identity but does **not** establish real focus or assistive-technology behavior.
3. Give an unfamiliar reviewer the four **fictional-only** cases below, without the explanation/answer key, and ask the same four questions for each: What is known and observed when? What did MGR actually signal? Who must approve or investigate? Is any delivery or public review established? Record elapsed time, wrong classifications, unresolved questions and navigation obstacles. Aim for approximately one minute per case, but do not substitute that target for recorded human evidence.

| Fictional case | Required distinguishing finding (facilitator answer key) |
| --- | --- |
| Harbor Pine Printworks | Current manual aggregate and net movement are **not** attributable new reviews; MGR link click and scheduled message do not establish public review or delivery; service/cadence/route still need decisions. |
| Cedar Quay Bicycle Shop | Rating-conditioned public routing is an explicit **policy HOLD**, even with some approvals; reply authority is human-held. |
| Marshlight Makers | Native observation is stale, so current count/rating are **withheld**, not zero; service/operator/cadence remain unapproved. |
| Bayline Bookbinding | Fictional approval inputs are **review ready**, but real customer delivery and live services remain disabled; MGR first-party feedback is not public Google publication. |

Compare the same decision tasks with existing native/CRM/MGR views **only when a safe fictional or separately authorized source is available**. Otherwise mark native-comparison evidence `NOT_OBTAINED`; never import client/reviewer/patient data to make a comparison. Record findings in the owning #7 gate or link appropriately placed raw screenshots/notes without creating a second product backlog. If a critical source-attribution mistake, rating-gating ambiguity, keyboard blocker, or missing human approval remains, mark G3a `HOLD` pending correction. Even a good evaluation does not authorize G3b.

### Facilitator-only scoring and evidence record

The evaluator-facing [OPERATOR_STUDY.md](OPERATOR_STUDY.md) intentionally contains **no answer key**. Keep this README hidden until all four cases have been answered. The reviewer must be unfamiliar with the prototype; otherwise classify the session `NOT_BLIND` and use feedback qualitatively, without counting it as a cold-comprehension pass.

- Give each of the four fictional locations exactly the same **Q1 source/as-of, Q2 MGR meaning, Q3 required approvals/policy, Q4 actual delivery/publication/action authority** questions. Start and stop a manual timer per case; record seconds, hints, obstacles, and unanswered questions. The roughly one-minute target is not a forced deadline or benchmark.
- Use the answer key above to score **each Q1–Q4 as 1 correct or 0 incorrect/not answered**, giving **4 per location / 16 total**. Also mark critical false inferences (stale count=0; net count change=new attributed review; MGR click=published Google review; scheduled=delivered; sentiment-conditioned public route accepted; fictional REVIEW READY=production approval) separately even if an aggregate score is high. A material error means **G3a HOLD pending correction and human retest**.
- If comparable native Google/CRM/MGR views cannot be presented using **equivalent fictional or separately authorized privacy-safe** cases, record `NATIVE_COMPARATOR_NOT_OBTAINED`. Otherwise record both experiences' time/errors and which interface was tested first; counterbalance order across reviewers where feasible. **Do not invent time savings from different data or AI-only guesses.**
- Raw score sheets and any screenshots belong in an **approved private working location**, not GitHub. Record only anonymous participant codes; no contact details, patient/PHI/reviewer information, credentials, or actual public review text. Publish a sanitized, evidence-backed disposition in [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7), with a private pointer where appropriate. State `HUMAN_TEST_COMPLETED` **only** when an actual unfamiliar person has performed the test.
- Keep actual screen-reader behavior, literal zoom, human comprehension, rendered cross-browser QA and future G3b approval as separate gates. This packet is an **evaluation instrument**, not a test result, client approval, runtime, or deployment.

**Next gate:** complete an **actual unfamiliar-human** four-fictional-case test using the blind handout, plus separate real screen-reader and literal 400% zoom acceptance. The source-only code/privacy/a11y reviews and initial Chrome viewport/keyboard checks already have accepted evidence in Reputation #7; do not misstate them as actual human acceptance. Only then take the Product/Portfolio evidence-based **BUILD SMALL / COMPOSE / HOLD / STOP** decision. No customer, multi-tenant runtime, SaaS release, API integration, dashboard hosting, live portal, or outgoing service is authorized by this proof. Google Business Profile [API Content policies](https://developers.google.com/my-business/content/policies) must be re-reviewed before any later API-backed evidence. Future approved live operator workflows need actual tenant-specific permissions, client consent, signed/commercial scope, secure storage and explicit release acceptance.
