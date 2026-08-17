# Backup, Recovery, and Export

Release 0.1 provisions no datastore and therefore has no production backup procedure. This document defines the boundary future adapters must satisfy.

## Separate concepts

- **backup** preserves provider-specific recoverability;
- **recovery** restores service/state after failure or error;
- **export** produces a logical portable representation for customer handoff or migration;
- **deletion/disposition** removes data according to approved retention and offboarding policy.

A D1 Time Travel restore is not a customer export. A JSON/CSV export is not necessarily a disaster-recovery backup.

## Reference Cloudflare recovery

As researched 2026-08-17, D1 Time Travel is currently 7 days on Workers Free and 30 days on Workers Paid. These limits can change and must be reverified before a production recovery commitment.

Primary source:

- https://developers.cloudflare.com/d1/platform/limits/

## Future requirements

A functional persistence adapter must document:

- backup/recovery mechanism and retention;
- restore test procedure;
- recovery objectives if any are contractually promised;
- export schema/versioning;
- tenant-scoped authorization for export/delete;
- deletion/disposition behavior;
- provider-specific limitations;
- shared vs. dedicated responsibility boundaries.

Do not promise an SLA, RPO, or RTO until the production deployment and support model can actually meet it.
