# G3a fictional Workbench — independent participant test sheet

**Give this sheet, and only the local Workbench screen, to a reviewer who has never worked on this proof. Do not give them the Workbench README, source code or facilitator answer key before scoring.** This is a **local, static, fictional-data test**, not a live reputation service.

## Before starting

The facilitator will open the Workbench at the local address they supply. You do not need to sign in, install software, send a message, use Google/MGR, or share any real business, patient, reviewer or contact details. **Do not enter personal information or submit any form.**

You will see four invented businesses. Work independently without explanations or tooltips from the facilitator. For each one, inspect the evidence and decision queue, then answer the same questions **in your own words**. It is okay to answer "cannot determine" where the interface does not support a conclusion. The facilitator records time and navigation difficulties, but there is no speed-based pass/fail by itself.

## Tasks and response template

For each of the following fictional cases, select the location and investigate as needed. The four questions are deliberately the same for all cases:

- **Q1 — Source:** What native/public-review evidence is actually supported, and when was it observed? If not current or not available, say so.
- **Q2 — Provider:** What does the MGR activity establish, if anything? What cannot be concluded from that signal?
- **Q3 — Authority:** What human approval, verification or policy check must happen before the next real-world action?
- **Q4 — Outcome:** Is a request delivery or a newly published public review established by this view? Is any live customer action authorized here?

| Fictional location | Q1 Source / time | Q2 MGR evidence | Q3 Approval / policy | Q4 Delivery / publication / authority |
| --- | --- | --- | --- | --- |
| Harbor Pine Printworks | | | | |
| Cedar Quay Bicycle Shop | | | | |
| Marshlight Makers | | | | |
| Bayline Bookbinding | | | | |

If you cannot answer something, write **unknown** and briefly explain what label or evidence is missing. Report confusing words, navigation steps, and any status that could lead an operator to act without permission.

### Short usability checks

Without using a mouse, try **Tab**, **Shift+Tab**, **Enter** and **Space** on the location choices, decision filters, one expandable decision and the theme toggle. Report whether focus stays visible and whether the selected location is clear. If requested, try a narrow/mobile view and a supported assistive technology you already use. **Do not install a screen reader just for this task** or treat a simulated keyboard check as assistive-technology acceptance.

## Facilitator-only handling rules — hide this section from the participant during the task

1. **Eligibility and blinding:** Reviewer must be unfamiliar with the prototype and its four scenario answers. Record only a non-identifying participant code. If they already saw the README answer key or coached scenarios, mark **NOT_BLIND**; retain notes as qualitative feedback only, not a valid cold study.
2. **Timing:** Start and stop a manual timer for each fictional case. Record seconds, whether the case was completed, any requested hints, and navigation obstacles. The README's roughly one-minute goal is a usability prompt, **not** a forced cutoff or an established performance baseline.
3. **Scoring:** Score each Q1–Q4 response **correct (1), incorrect (0), or not answered (0)** using the existing facilitator answer key in the Workbench README. Capture **4 scores per location, 16 total**; separately flag any potentially consequential confusion about stale counts, MGR rating-click versus Google publication, scheduled versus delivered, sentiment-conditioned public routing, or fictional "REVIEW READY" versus authorized customer service. Do not infer participant success from a generated model answer.
4. **Comparison:** Only compare with existing native/CRM/MGR interfaces when an **equivalent safe fictional case** or an expressly authorized, privacy-compliant operator comparison exists. Record each interface's task order and time/errors separately and counterbalance the order across reviewers where feasible. Otherwise record **NATIVE_COMPARATOR_NOT_OBTAINED**; no quantified time savings or superiority claim.
5. **Evidence custody:** Keep raw response sheets, time recordings and any screenshots in an **approved private working location**, not in a public GitHub comment. Never collect or post participant names, emails, PHI, patient/reviewer details, actual MGR customer records, credentials or Google review text. Publish only sanitized, aggregate decision findings in [Reputation #7](https://github.com/LowcountryDigitalWorks/reputation/issues/7), with a private evidence pointer when permitted.
6. **Decision gate:** Any materially wrong attribution (click assumed a published review, stale count interpreted as zero, scheduled assumed delivered), unrecognized rating-policy hold, or claim that fictional readiness authorizes production requires **G3a HOLD pending correction and retest**. Even a strong 16/16 study does **not** authorize real customers, G3b, Google/MGR access, billing, replies or deployment.

**Required result vocabulary:** `HUMAN_TEST_COMPLETED` only after an actual unfamiliar person supplied recorded answers; `NOT_BLIND`, `NOT_OBTAINED`, and `NATIVE_COMPARATOR_NOT_OBTAINED` are distinct honest outcomes. Source-only reviews, AI critiques, fake DOM tests and automated Chrome runs do **not** satisfy this human gate.
