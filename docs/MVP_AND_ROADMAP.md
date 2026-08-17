# MVP and Roadmap

Only Release 0.1 is currently authorized. Later phases require separate authorization.

## 0.1 — Product & Architecture Foundation

Status: **authorized architecture release**.

Deliverables:

- product scope and non-goals;
- Google review-policy guardrails;
- multi-tenant and tenant-authority model;
- shared vs. dedicated deployment design;
- Cloudflare reference architecture and current limits;
- portability boundaries;
- Mode A target and safe redirect rule;
- evidence-state invariants;
- healthcare deployment gate;
- Activepieces/automation boundary;
- provider-neutral delivery boundary and ZeptoMail position;
- suppression boundary;
- identity/role model;
- threat model and test strategy;
- licensing decision;
- backup/recovery/export model;
- cost/scaling triggers.

No production application or infrastructure is part of 0.1.

## Later — Mode A core

Separately authorize before implementation:

- tenants and locations;
- administrator-configured review destinations;
- safe branded redirects;
- QR representation;
- bounded aggregate click evidence;
- LDW administration;
- export/handoff.

Mode A does not need recipient records.

## Later — Mode B managed email

Separately authorize before implementation:

- event API and idempotency;
- authoritative scheduled state;
- provider-neutral `EmailProvider`;
- ZeptoMail candidate evaluation;
- neutral templates;
- permitted reminder rules;
- suppression;
- delivery/bounce state;
- minimal recipient retention;
- metadata-only audit evidence.

Before production managed delivery, perform the applicable channel, consent, jurisdiction, client, provider, retention, and security review.

## Later — automation integrations

Activepieces, Zoho Flow, CRM automation, GitHub/serverless automation, or client applications may become callers. None becomes tenant authority, suppression truth, destination truth, audit truth, or required runtime infrastructure.

## Later only if demonstrated

- client portal/RBAC;
- Google Business Profile review retrieval, monitoring, alerts, and owner replies;
- SMS after demand, cost, consent, and legal/policy review;
- widgets/testimonials;
- sentiment/reputation trends;
- AI-assisted owner-response drafting;
- advanced reports.

None of these is pre-authorized by this roadmap.
