# ADR-0005: Google Review Solicitation Policy Guardrails

- Status: Accepted
- Date: 2026-08-17

## Primary-source research

Research date: **2026-08-17**.

Google Business Profile explicitly supports sharing a review link or QR code with customers, including in thank-you emails and receipts:

- https://support.google.com/business/answer/16816815

Google Maps user-generated content policy requires genuine experience-based content and prohibits merchants from offering incentives, discouraging negative reviews, or selectively soliciting positive reviews:

- https://support.google.com/contributionpolicy/answer/7400114
- https://support.google.com/contributionpolicy/answer/16597280
- https://support.google.com/contributionpolicy/answer/16597558

## Product invariants

Reputation must:

- solicit only genuine customer experiences;
- use neutral request language;
- never offer discounts, free items, payments, rewards, or other benefits for posting, changing, or removing Google reviews;
- never discourage or prohibit negative reviews;
- never selectively solicit expected positive reviewers;
- never ask for a satisfaction/rating/sentiment gate before revealing the Google destination;
- never provide a different public-review path for happy vs. unhappy customers;
- ensure suppression rules concern legitimate contact/delivery/business restrictions rather than expected sentiment;
- keep any future private-feedback capability independent of public-review eligibility.

Provider documentation or competitor behavior does not override these rules.

## Future review monitoring/replies

Google Business Profile APIs currently support review retrieval and owner replies with appropriate authorization. Those capabilities are later-phase work and must preserve client ownership and explicit client authorization before LDW responds on a client's behalf.

Primary source:

- https://developers.google.com/my-business/content/review-data
