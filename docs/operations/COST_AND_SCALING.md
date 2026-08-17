# Cost and Scaling

Research date: **2026-08-17**. Values below are reference limits from primary Cloudflare documentation and must be reverified before production commitments.

Release 0.1 expected recurring cost: **$0**. No Cloudflare resources or paid services are provisioned.

## Cloudflare Workers

Current primary source: https://developers.cloudflare.com/workers/platform/limits/

Workers Free currently includes:

- 100,000 requests/day;
- 10 ms CPU time per request;
- 128 MB memory;
- 50 external subrequests/request;
- 100 Workers/account;
- 5 Cron Triggers/account.

Workers Paid currently removes the daily request cap, allows up to 5 minutes CPU time, 10,000 external subrequests/request by default, 500 Workers/account, and 250 Cron Triggers/account. Current pricing documentation lists a **$5/month account minimum** for Workers Paid:

- https://developers.cloudflare.com/workers/platform/pricing/

## D1

Current primary sources:

- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/

D1 on Workers Free currently includes:

- up to 10 databases/account;
- 500 MB maximum size per database;
- 5 GB total account storage;
- 7-day Time Travel;
- 5 million rows read/day;
- 100,000 rows written/day.

D1 on Workers Paid currently allows up to 50,000 databases/account, 10 GB per database, 1 TB account storage, and 30-day Time Travel; paid usage includes substantial monthly read/write allowances before usage charges.

D1 Free is suitable as a development/pilot/low-volume reference capability, not as a permanent SLA guarantee.

## Queues

Current primary sources:

- https://developers.cloudflare.com/queues/platform/limits/
- https://developers.cloudflare.com/queues/platform/pricing/
- https://developers.cloudflare.com/changelog/post/2026-02-04-queues-free-plan/

Workers Free currently includes 10,000 Queue operations/day. Free-plan message retention is 24 hours. Queue `delaySeconds` is currently limited to 24 hours. Workers Paid currently includes 1,000,000 Queue operations/month and configurable retention up to 14 days.

Therefore Queues must not be treated as authoritative multi-day scheduling state. Future delayed requests/reminders use durable scheduled state plus scheduler/dispatch.

## When to reconsider Free/shared reference architecture

Reconsider the plan, provider, or deployment when any of these become material:

- actual Worker request/CPU/subrequest volume;
- D1 reads, writes, database count, per-database size, total storage, or concurrency;
- Queue operations, backlog, retention, or delay requirements;
- scheduler frequency/count requirements;
- recovery retention and restore testing;
- reliability/SLA commitments;
- support/on-call obligations;
- security/logging/observability requirements;
- customer isolation, ownership, regulation, or contract requirements.

Do not upgrade merely because an arbitrary client-count threshold was reached. Upgrade when actual workload or commitments justify it.
