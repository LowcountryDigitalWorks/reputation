# ADR-0006: Apache License 2.0

- Status: Accepted
- Date: 2026-08-17

## Decision

License the Reputation repository under the **Apache License, Version 2.0** (`Apache-2.0`).

## Rationale

LDW's product strategy favors public repositories, client ownership, portability, open standards, and revenue from implementation, managed operation, integration, maintenance, and support rather than preventable code lock-in.

Apache-2.0 is a widely used permissive license with explicit copyright and patent terms and can apply to software and documentation. It permits third-party use, modification, and redistribution subject to the license terms.

Primary references reviewed 2026-08-17:

- https://www.apache.org/licenses/LICENSE-2.0
- https://www.apache.org/legal/apply-license
- https://opensource.org/license/apache-2-0

## Consequences

- The repository may accurately be described as open source once the license is present.
- LDW does not receive exclusivity over downstream hosting or redistribution merely because LDW authored the project.
- LDW's service differentiation must therefore come from trustworthy operation, integration, support, client relationships, and implementation quality.
- Third-party code must still be reviewed for compatible licensing and attribution requirements before inclusion.
- Product names, logos, and trademarks are not granted merely by the software license.

No Contributor License Agreement is introduced by Release 0.1. Contributions are expected under the repository license unless a later governance decision changes that process.
