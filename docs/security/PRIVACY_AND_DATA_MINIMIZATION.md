# Privacy and Data Minimization

## Default principle

Collect the minimum data needed for the authorized mode and purpose. Do not collect additional telemetry merely because a platform/provider exposes it.

## Mode A

Mode A should not require recipient identity.

QR codes and branded review URLs must not embed recipient ID, email, phone, appointment ID, provider, procedure, transaction ID, sentiment, score, or hidden customer identifier merely for analytics.

Product analytics should be bounded aggregate evidence. Raw IP addresses, full user-agent strings, fingerprinting identifiers, and third-party tracking should not be retained as product analytics unless a later explicit privacy/security requirement justifies them.

Short-lived security/rate-limiting processing, if later necessary, is distinct from analytics retention and must be documented when implemented.

## Future managed delivery

Before Mode B production, separately define:

- minimum necessary recipient fields;
- encryption/secret handling;
- provider data disclosure;
- suppression/opt-out behavior;
- bounce/delivery evidence;
- retention and deletion;
- channel/jurisdiction/client consent requirements;
- logging and support access.

Open/email-client tracking defaults off unless justified. A tracking pixel is not required to establish bounded click evidence.

## Audit data

Audit/security evidence should exclude review text, customer feedback, recipient contact details unless later operationally required and explicitly approved, provider/OAuth tokens, email bodies, PHI, and arbitrary webhook payloads.

Keep eligibility, request creation, delivery, bounce, suppression, click, review observation, and reply activity as separate event classes.

## Healthcare deployment gate

The preferred healthcare architecture is Mode A with the client sending its own neutral follow-up. Reputation should not require patient name/email/phone, appointment ID, provider, treatment/procedure, or clinical context.

Do not claim this makes a deployment HIPAA compliant or outside HIPAA.

If Reputation later receives patient-linked data, or deployment/logging/provider behavior materially changes the data relationship, stop before production and perform a separate:

- HIPAA role analysis;
- BAA/subprocessor analysis;
- data-flow review;
- retention review;
- logging review;
- security architecture review.

No PHI is authorized in Release 0.1.
