# Contributing

## Change workflow

Before making meaningful changes:

1. inspect current `main`, open/recent pull requests, workflows, authoritative documentation, and repository governance;
2. create a focused branch from current `main`;
3. make only the authorized changes;
4. update documentation and tests with the implementation;
5. run applicable validation;
6. open a pull request describing scope, impact, validation, and rollback;
7. resolve review threads before squash merge.

Do not push meaningful changes directly to protected `main`.

## Scope control

Reputation is a generic Lowcountry Digital Works product. Do not add client-specific business rules to the product core when configuration or an adapter is appropriate.

Release 0.1 is architecture-only. It does not authorize Mode A implementation, customer data, production infrastructure, managed email, SMS, Google OAuth/API integration, Activepieces, Zoho Flow, a client portal, AI, or paid services.

## Public repository data rules

Use synthetic examples only.

Never commit or reproduce:

- passwords, MFA codes, passkeys, recovery codes, private keys, API/OAuth tokens, client secrets, or provider credentials;
- PHI, patient information, real customer records, recipient contact details, review text, or customer feedback;
- payment-card data;
- private infrastructure identifiers or secret-bearing logs;
- password-vault exports or account-recovery material.

## Dependency policy

Prefer platform capabilities and small, maintained dependencies with clear purpose. Any future runtime dependency requires review for need, maintenance, security, licensing, portability, and whether a standard/platform capability can satisfy the requirement instead.

Do not introduce a large frontend framework, database, identity product, analytics/tracking system, workflow engine, or paid SaaS merely for convenience.

## Product-policy guardrails

Contributions must preserve Google review-policy invariants documented in [ADR-0005](docs/adr/0005-google-review-policy.md). In particular, do not implement rating/sentiment gates, positive-only solicitation, incentives, or separate public-review paths for happy and unhappy customers.

## Validation

The repository validation workflow intentionally remains small for the documentation-only foundation. It checks repository hygiene, internal Markdown links, and common secret patterns. Future implementation releases must expand validation to match the actual runtime and security surface rather than weakening existing checks.
