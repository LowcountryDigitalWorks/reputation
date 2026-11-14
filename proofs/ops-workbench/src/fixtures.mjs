/** All names, metrics, timestamps and locations are synthetic. No provider access. */
export const FIXTURE_CLOCK = '2026-11-13T18:00:00Z';
export const FIXTURE_SCHEMA = 'ldw.reputation.public-aggregate.v1';
const observation = (locationKey, observedAt, rating, reviewCount, state='observed') => ({
  schema: FIXTURE_SCHEMA, locationKey, source: 'google_business_profile_manual', state,
  observedAt, rating, reviewCount, unrepliedCount: null
});
export const FICTIONAL_LOCATIONS = Object.freeze([
  {
    fixture: true, id: 'harbor-pine', name: 'Harbor Pine Printworks', kind: 'Fictional neighborhood retail',
    owner: 'LDW operator — fictional',
    approvals: {service: false, operator: true, cadence: false, replyApprover: false},
    previous: observation('harbor-pine', '2026-11-10T16:00:00Z', 4.58, 23),
    current: observation('harbor-pine', '2026-11-13T16:00:00Z', 4.62, 25),
    mgr: {route: 'unverified', event: 'rating_link_clicked', delivery: 'scheduled'},
    replyQueue: 'approval_required'
  },
  {
    fixture: true, id: 'cedar-quay', name: 'Cedar Quay Bicycle Shop', kind: 'Fictional independent service',
    owner: 'Owner review — fictional',
    approvals: {service: true, operator: true, cadence: true, replyApprover: false},
    previous: observation('cedar-quay', '2026-11-10T13:00:00Z', 4.31, 12),
    current: observation('cedar-quay', '2026-11-13T15:00:00Z', 4.31, 12),
    mgr: {route: 'rating_conditioned_hold', event: 'none', delivery: 'not_requested'},
    replyQueue: 'approval_required'
  },
  {
    fixture: true, id: 'marshlight', name: 'Marshlight Makers', kind: 'Fictional creative workshop',
    owner: 'Coverage reviewer — fictional',
    approvals: {service: false, operator: false, cadence: false, replyApprover: false},
    previous: null,
    current: observation('marshlight', '2026-10-01T11:00:00Z', 4.9, 7),
    mgr: {route: 'not_connected', event: 'none', delivery: 'not_requested'},
    replyQueue: 'unknown'
  },
  {
    fixture: true, id: 'bayline', name: 'Bayline Bookbinding', kind: 'Fictional independent maker',
    owner: 'Fictional owner-approved operator',
    approvals: {service: true, operator: true, cadence: true, replyApprover: true},
    previous: observation('bayline', '2026-11-09T12:00:00Z', 4.33, 8),
    current: observation('bayline', '2026-11-13T16:00:00Z', 4.44, 9),
    mgr: {route: 'neutral_verified', event: 'first_party_feedback_updated', delivery: 'delivered'},
    replyQueue: 'none'
  }
]);
