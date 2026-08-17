# Deployment Models

One product/codebase supports multiple operating models.

## A. LDW-managed shared multi-tenant

Default candidate for ordinary low-sensitivity clients when shared operation creates real management value.

Characteristics:

- shared application/runtime;
- logical tenant isolation enforced by application authorization;
- tenant-scoped provider/integration credentials;
- documented export/offboarding;
- low-cost reference deployment.

Shared hosting is not appropriate merely because it is cheaper. Customer risk, contract, regulation, isolation requirements, and support commitments can justify dedicated deployment.

## B. Dedicated client-owned cloud

Preferred when ownership, isolation, regulation, contract, customer preference, or risk warrants it.

Characteristics:

- client-owned cloud account/resources where practical;
- client-owned domain/GBP/sender/provider/CRM assets;
- LDW named/scoped administrative access;
- same application/domain rules as shared deployment;
- client-specific backup/recovery and operational responsibility matrix.

## C. Future self-hosted/on-prem

Only after demonstrated demand. The architecture should not prevent a Node/container + approved durable-store deployment, but Release 0.1 does not promise appliance packaging, offline operation, or support for arbitrary environments.

## Ownership and handoff

Client-owned assets remain client-owned. A managed-service agreement should define which resources LDW operates, which provider costs are client-owned/pass-through, and how configuration/data are exported or transferred at offboarding.

See [Ownership and handoff](../operations/OWNERSHIP_AND_HANDOFF.md).
