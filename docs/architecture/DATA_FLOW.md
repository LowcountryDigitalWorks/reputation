# Data Flow

## Release 0.1

Release 0.1 has no production data flow. It contains public architecture documentation only and authorizes no customer, recipient, patient, provider-token, OAuth-token, or production-configuration processing.

## Intended Mode A flow

```text
Client-owned CRM/scheduler/email/POS
        |
        | neutral follow-up containing branded Reputation URL
        v
Customer browser
        |
        | request to fixed branded destination
        v
Reputation
  - resolve route/configuration
  - derive authorized tenant/location context internally
  - record bounded aggregate click evidence if enabled
  - resolve administrator-configured destination
        |
        | 3xx redirect
        v
Official configured review destination
```

Mode A does not require a recipient list.

The branded URL and QR code must not carry recipient name/email/phone, appointment ID, procedure, transaction ID, sentiment, score, or hidden customer identifier merely for analytics.

## Intended later managed-delivery flow

```text
Authorized caller
  -> authenticated integration/service authority
  -> minimal event validation + idempotency
  -> tenant-scoped use case
  -> authoritative scheduled state
  -> scheduler identifies due work
  -> dispatch queue/event transport
  -> tenant-scoped DeliveryProvider
  -> provider delivery/bounce evidence
```

The caller's supplied tenant identifier never establishes authority. Arbitrary webhook bodies are not audit logs.

## Intended later Google review flow

```text
Client-authorized Google OAuth relationship
  -> tenant/location-scoped Google adapter
  -> review observation
  -> optional alert/dashboard
  -> separately authorized owner reply
```

Observed reviews are not attributed to individual requests without a later separately reviewed lawful/reliable design.

## Healthcare gate

If any future path introduces patient-linked data, stop before production and perform the healthcare deployment gate described in [Privacy and data minimization](../security/PRIVACY_AND_DATA_MINIMIZATION.md).
