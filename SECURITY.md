# Security Policy

Reputation is security- and privacy-sensitive software. This repository is public and must never contain real customer, regulated, or secret material.

## Report vulnerabilities privately

Report suspected vulnerabilities to **eddie@lowcountrydigitalworks.com**. Do not open a public issue containing exploit details, credentials, customer data, PHI, or other sensitive material.

## Never commit or reproduce

- passwords, MFA codes, passkeys, recovery codes, private keys, API/OAuth tokens, client secrets, or provider credentials;
- PHI, patient information, real customer records, recipient contact details, review text, customer feedback, or arbitrary webhook payloads from production;
- payment-card data;
- private production configuration, sensitive logs, exports, or password-vault material.

Use synthetic examples only.

## Security design authority

The Release 0.1 baseline is defined by:

- [Threat model](docs/security/THREAT_MODEL.md)
- [Authorization model](docs/security/AUTHORIZATION.md)
- [Privacy and data minimization](docs/security/PRIVACY_AND_DATA_MINIMIZATION.md)
- [Test and security strategy](docs/security/TEST_AND_SECURITY_STRATEGY.md)
- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Data flow](docs/architecture/DATA_FLOW.md)
- [Multi-tenancy](docs/architecture/MULTI_TENANCY.md)

A tenant identifier present in a URL, body, header, webhook, queue message, or database row is never tenant authority. Tenant authority derives from validated application identity/service authority and scopes every authoritative lookup and mutation.

## Regulated deployments

No reference architecture, encryption choice, or Mode A data-minimization choice establishes HIPAA or other regulatory compliance.

If Reputation later receives patient-linked data, or deployment/logging/provider behavior materially changes a healthcare data relationship, implementation must stop for a separate HIPAA role, BAA/subprocessor, data-flow, retention, logging, and security-architecture review.

No PHI is authorized in Release 0.1.
