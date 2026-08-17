# Threat Model

## Assets and trust boundaries

Protected assets include tenant configuration, review destinations, future provider/integration credentials, future minimal recipient state, suppression state, audit/security evidence, and client-authorized Google relationships.

Primary trust boundaries are public browser -> Reputation, integration caller -> Reputation API, scheduler/dispatch -> worker/use case, LDW operator -> platform administration, tenant user -> tenant administration, provider -> Reputation callback, and shared tenant -> shared infrastructure.

Release 0.1 processes none of these production assets; the model defines requirements for later releases.

## Threats and required controls

| Threat | Required design response |
|---|---|
| Cross-tenant access | Identity-derived tenant authority; tenant-scoped repositories/use cases; negative isolation tests |
| Tenant confusion / confused deputy | Never trust supplied tenant IDs; bind service authority to tenant + capability |
| Open redirect / phishing | Redirect only to administrator-configured destination; never arbitrary browser-supplied final URL |
| Destination tampering | Privileged, audited destination changes; validation; no client-side authority |
| Malicious webhook caller | Authenticated/signed caller, replay defense, idempotency, minimal accepted schema |
| Replay / duplicate event | Idempotency key/event identity scoped to authority; deterministic duplicate handling |
| Credential leakage | Approved secret store, tenant-scoped credentials, no secret in Git/logs/audit, rotation/revocation path |
| Service-principal overreach | Least-privilege capability scopes and tenant binding |
| Provider compromise | Minimize provider scope/data; revocation; audit configuration changes; do not treat provider as authority |
| Webhook spoofing | Signature/authentication verification and timestamp/replay controls where provider supports them |
| Analytics privacy creep | Aggregate/bounded evidence; no raw IP/UA/fingerprinting as product analytics by default |
| Enumeration | Opaque public identifiers where appropriate; consistent authorization failures; rate limits |
| QR/link misuse | QR contains neutral branded destination only; destination remains server-configured |
| Suppression bypass | Central domain rule applied before future delivery; caller cannot override sentiment/contact policy |
| Review gating/policy abuse | Hard product invariants; no rating/sentiment gate configuration |
| Privileged LDW administration | Separate platform-admin role, named accounts, least privilege, metadata-only audit |
| Shared/dedicated boundary confusion | Deployment-specific ownership/configuration documented; same in-app authorization invariants |
| Backup/export/delete abuse | Authorized tenant-scoped operation, integrity checks, documented retention/disposition |
| Public repo secret leakage | Preventive guidance + secret-pattern CI; never use repository as a vault |

## Abuse cases

The system must be designed against being repurposed as:

- an arbitrary redirector/phishing domain;
- a bulk spam engine;
- a positive-review-only funnel;
- a cross-client credential hub;
- an analytics fingerprinting system;
- a means to infer patient/customer relationships from public tokens.

## Residual risk and later gates

Managed email/SMS, Google OAuth/replies, patient-linked data, richer analytics, client portals, and production SLAs each introduce new threats and require their own release-specific threat-model update before production authorization.
