# Client-facing UI acceptance — Reputation and future adjacent products

**State:** conditional acceptance checklist only, no client-facing runtime or design release authorized.
**Product authority:** [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7) and the [MVP roadmap](../MVP_AND_ROADMAP.md).
**Design source:** current approved [LDW Website design system](https://github.com/LowcountryDigitalWorks/lowcountrydigitalworks.com/blob/main/design/design-system.md), [application UX](https://github.com/LowcountryDigitalWorks/lowcountrydigitalworks.com/blob/main/design/application-ux.md), [accessibility](https://github.com/LowcountryDigitalWorks/lowcountrydigitalworks.com/blob/main/design/accessibility.md), and [production logo rules](https://github.com/LowcountryDigitalWorks/lowcountrydigitalworks.com/blob/main/brand/brand-guidelines.md). Re-read their *live* state at any future implementation gate.

## Product identity and visual behavior

- Future client/operator-facing LDW products must be visually related to LDW **without all being the same navy/teal clone**. Select a **distinct semantic product palette** per independently authorized app; maintain recognizable LDW quality, Manrope-led typography, credible provenance and approved brand identification. This design contract **does not select final colors** or authorize a rebrand.
- Use **dark mode by default** for a future standalone application and provide an **explicit optional light-mode switch** with a clear active state. Both themes must have independently designed semantic tokens for background, surfaces, text, focus, actions, borders, success/warning/error, and empty/loading states; never implement light mode as a blind CSS inversion. Theme preference persistence, if wanted, requires normal privacy/source review.
- Premium **liquid-glass-ish** style is a restrained interaction language: rounded, layered/elevated surfaces, contextual depth and occasional translucent panels **only when readable**. Backdrop blur/refraction/animation are optional enhancements and must have opaque, low-motion and low-capability fallbacks. No frosted treatment behind dense metrics, form inputs, audit evidence, or sensitive text if it reduces legibility.
- Do **not** recolor, stretch, fade, redraw, or put effects into the canonical Tidal Framework mark simply to match the new app palette. Use an approved original/reversed/monochrome/icon logo asset on a suitable solid field, or route any new mark adaptation through the brand owner. Product accent colors may differ around it.
- Design the **workflow first**: task-focused information hierarchy and data density, clear provenance, obvious next action, responsive 360/390/768/1440 widths; no fake testimonials, default stock dashboards, huge empty hero blocks or decorative glass effects with no purpose.
- Keep the existing Website **/connect/** contact card intact unless the owning Website ORCH accepts a verified defect or new design. The newer Contact Exchange source-only V4.5 proof under [business-operations #783](https://github.com/LowcountryDigitalWorks/business-operations/issues/783) is **not** a Website visual replacement, production deployment, authorized CRM integration or reason to establish a second contact master.

## Accessible by construction

- Target **WCAG 2.2 AA**, with keyboard-only journeys, visible focus, semantic labels and headings, no hover-only or color-only status, readable controls and validation errors, 400% reflow, sufficient contrast in **both** themes, practical touch targets (prefer 44×44 CSS px), and reduced-motion/reduced-transparency-safe rendering.
- Test real workflows on desktop and narrow mobile; use restrained animation and progressive enhancement. If CSS blur is unavailable, contrast and content hierarchy must survive. A theme toggle must be labeled, keyboard-operable, visible in both modes and not cause loss of form state.
- Avoid leaking statuses through styling alone. Explicit labels such as **Not connected**, **Unavailable**, **Observation stale**, **Needs human review**, **Source-only evidence** and **Not yet verified** must remain visible and cannot be replaced by ambiguous colored dots.

## Reputation-specific trust / review-policy guardrails

- Any future review-monitoring view must keep **requested / delivered / clicked / observed / published / replied** states independent and source-attributed. A count increase is **net count movement**, not identified new reviews or proof of campaign causality. Present as-of time, coverage/freshness, source and missing/not-authorized states without invented zeros.
- **No review gating**, selective positive-only solicitation, incentives, fake testimonials, or automated public replies. Human-authorized reply workflows must keep approval state explicit and never reveal customer or healthcare facts in public content.
- Client-owned review destinations and location boundaries take precedence over visual convenience. If authorized later, an operator should be able to distinguish a live first-party native observation from an offline fixture, historical manual entry, third-party claim, or blocked API source.
- Do not add PHI, patients, reviewer text/identity, CRM contacts, consent records or recipient data to a public proof, screenshot or GitHub artifact. Real customer integrations/credentials, outbound messages, scheduling, analytics, data collection, report publishing and production still require the separate owning approvals.
- **Contact Exchange is distinct**: visitor-introductions/opt-in CRM exchange are not Reputation review-recipient data; do not blend these populations or use card scanning to launch review requests.

## Future acceptance evidence (when an implementation is explicitly authorized)

1. Confirm scope and separate client/owner/Portfolio authority, data classification, cost ceiling, approved host and product/workstream owner. **No functional runtime is authorized by this document.**
2. Produce side-by-side **dark default + optional light** route/screen proofs, semantic token inventory, and a distinct palette rationale; show on-card/inline interactions rather than merely a static screenshot.
3. Validate keyboard, screen reader, touch, 400% reflow, 360/390/768/1440, contrast, reduced motion, blur fallback, empty/error/stale states, and no fabricated customer metrics or misleading source badges.
4. Inspect CSP, browser/network calls, dependency and privacy surfaces; preserve first-party/static or accepted hosting rules and product boundary. Do not weaken permissions or introduce tracking merely for visual telemetry.
5. Freeze candidate/changed files and require normal deterministic QA, hosted CI, author-excluded exact-head independent review, owning product acceptance, and separately approved customer/production release.

**Stop rule:** Without demonstrated service demand and explicit functional authorization, **configure existing/native GBP/CRM/MGR capability and stop**. This checklist should keep any later UI polished and safe, not create an app simply because a design system exists.
