# Product Boundary

## Purpose

LDW Reputation is a privacy-first reputation/review-request core for **neutral** customer review solicitation. It should make a simple business outcome easy to operate without forcing a client to replace its CRM, scheduler, POS, email platform, website, or Google Business Profile ownership model.

## Core conceptual lifecycle

`approved qualifying business event -> neutral review-request eligibility -> destination/request workflow -> optional permitted delivery -> bounded click/status evidence -> optional later review monitoring`

The evidence states are deliberately distinct:

- **eligible**: a business rule says a request may be considered;
- **requested/created**: Reputation created a request or destination interaction;
- **delivered**: a future delivery provider reports delivery where meaningful;
- **clicked**: the neutral branded destination was requested;
- **review observed**: a future Google integration retrieved a review;
- **reply activity**: a future authorized actor created/updated/deleted an owner reply.

`REQUESTED != DELIVERED != CLICKED != REVIEW SUBMITTED/PUBLISHED`

Reputation must not infer an individual Google review from an individual request or click unless a later, separately reviewed design establishes a lawful and reliable relationship.

## Product invariants

- Genuine customer experiences only.
- Neutral request language.
- No incentives for Google reviews.
- No discouraging negative reviews.
- No selective positive-review solicitation.
- No satisfaction/sentiment gate before a public review destination.
- No different public-review path for happy vs. unhappy customers.
- Suppression is based on legitimate contact/delivery/business restrictions, never expected sentiment.
- Private feedback, if ever introduced, is independent of public-review eligibility.
- Client-owned domains, Google Business Profiles, sender identities, provider accounts, CRM/scheduling/POS accounts, and dedicated production cloud resources are preferred where practical.

## Non-goals

Reputation is not a:

- CRM or scheduling system;
- social-media-management suite;
- survey platform;
- email marketing or SMS platform;
- AI review-writing system;
- testimonial-harvesting system;
- review-gating mechanism;
- general workflow engine.

## Mode A — intended first functional target

Mode A keeps the client/customer relationship in the client's existing system:

`client existing system -> neutral follow-up -> branded Reputation destination -> official configured review destination`

Reputation initially needs only tenant/location configuration, an authoritative destination, a safe branded redirect, QR representation, privacy-minimized aggregate click evidence, LDW administration, and export/handoff.

Mode A does not require a recipient list. QR codes encode only the neutral branded destination and must not embed recipient, appointment, transaction, procedure, sentiment, score, or hidden customer identifiers.

## Healthcare boundary

A healthcare/dental client is an example of why Mode A exists. The preferred pattern allows the client's own system to send the follow-up while Reputation receives no patient name, patient email, phone, appointment ID, provider, treatment/procedure, or clinical context.

This data minimization is useful but is **not** a claim that a deployment is HIPAA compliant or outside HIPAA. Any later patient-linked data triggers the healthcare deployment gate in [Privacy and data minimization](security/PRIVACY_AND_DATA_MINIMIZATION.md).
