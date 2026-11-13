/**
 * Source-only aggregate reputation observation reconciliation.
 * No network, storage, clients, requests, review text, or provider credentials.
 * An observation is a claim from an operator/provider, NOT proof of receipt.
 */
export const OBSERVATION_SCHEMA = 'ldw.reputation.public-aggregate.v1';
export const REPORT_SCHEMA = 'ldw.reputation.aggregate-comparison.v1';
const SOURCES = new Set(['google_business_profile_manual', 'google_business_profile_official_api']);
const STATES = new Set(['observed', 'unavailable', 'not_authorized']);
const KEYS = new Set(['schema', 'locationKey', 'source', 'state', 'observedAt', 'rating', 'reviewCount', 'unrepliedCount']);
const HOUR_MS = 60 * 60 * 1000;

function reject(message) { throw new TypeError('AGGREGATE_HOLD: ' + message); }
function plainObject(value) { return !!value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; }
function isoUtc(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)) reject('timestamp must be exact UTC seconds');
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString() !== value.replace('Z', '.000Z')) reject('timestamp does not represent a real UTC instant');
  return parsed.valueOf();
}
function integerOrNull(v, label) {
  if (v === null) return;
  if (!Number.isSafeInteger(v) || v < 0 || v > 1_000_000_000) reject(label + ' must be nonnegative integer or null');
}
function ratingOrNull(v) {
  if (v === null) return;
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 1 || v > 5 || Math.abs(Math.round(v * 100) - v * 100) > 1e-9) reject('rating must be a finite 1–5 value with at most 2 decimal places, or null');
}

export function validateObservation(input) {
  if (!plainObject(input)) reject('observation must be a plain object');
  for (const key of Object.keys(input)) if (!KEYS.has(key)) reject('unknown input field: ' + key);
  for (const key of KEYS) if (!Object.hasOwn(input, key)) reject('missing field: ' + key);
  if (input.schema !== OBSERVATION_SCHEMA) reject('unsupported schema');
  if (typeof input.locationKey !== 'string' || input.locationKey.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.locationKey)) reject('invalid non-PII opaque location key');
  if (!SOURCES.has(input.source)) reject('only authorized first-party GBP observation sources supported');
  if (!STATES.has(input.state)) reject('invalid evidence state');
  isoUtc(input.observedAt);
  ratingOrNull(input.rating);
  integerOrNull(input.reviewCount, 'reviewCount');
  integerOrNull(input.unrepliedCount, 'unrepliedCount');
  if (input.state !== 'observed' && (input.rating !== null || input.reviewCount !== null || input.unrepliedCount !== null)) reject('unavailable/not-authorized input must not manufacture metrics');
  if (input.state === 'observed' && (input.rating === null || input.reviewCount === null)) reject('observed requires rating and count');
  if (input.unrepliedCount !== null && (input.reviewCount === null || input.unrepliedCount > input.reviewCount)) reject('unreplied count cannot exceed review count');
  return Object.freeze({...input});
}
function quality(snapshot, asOf, maxAgeHours) {
  const age = (asOf - isoUtc(snapshot.observedAt)) / HOUR_MS;
  if (age < 0) return 'FUTURE_OBSERVATION_HOLD';
  if (snapshot.state === 'not_authorized') return 'NOT_AUTHORIZED';
  if (snapshot.state === 'unavailable') return 'UNAVAILABLE';
  // GBP API Content storage/aggregation terms require separate policy approval.
  // Do not promote an API-derived observation into a historical report merely
  // because OAuth and quota were granted. Manual native observations are distinct.
  if (snapshot.source === 'google_business_profile_official_api') return 'API_CONTENT_POLICY_HOLD';
  return age > maxAgeHours ? 'STALE' : 'CURRENT_AS_OF';
}

// Freeze every nested DTO after all comparisons/mutations have completed.
// Object.freeze(report) alone would permit changing reviewCount.netDelta.
function finalizeReport(report) {
  // A held report is diagnostic evidence only. Do not pass through metric or
  // observation-time fields when current coverage or the comparison is held:
  // this includes Google API Content, a revoked authorization, stale evidence
  // and incompatible prior snapshots. A hold reason remains visible.
  if (report.coverage !== 'CURRENT_AS_OF' || report.comparison.endsWith('_HOLD')) {
    report.currentObservedAt = null;
    report.previousObservedAt = null;
    report.rating.previous = null;
    report.rating.current = null;
    report.rating.displayedDelta = null;
    report.reviewCount.previous = null;
    report.reviewCount.current = null;
    report.reviewCount.netDelta = null;
    report.unrepliedCount.current = null;
    report.unrepliedCount.state = 'WITHHELD';
  }
  Object.freeze(report.rating);
  Object.freeze(report.reviewCount);
  Object.freeze(report.unrepliedCount);
  return Object.freeze(report);
}

/** All times are caller-supplied UTC, making the comparison deterministic. */
export function compareAggregateObservations(previousInput, currentInput, {asOf, maxAgeHours = 336} = {}) {
  const previous = previousInput === null ? null : validateObservation(previousInput);
  const current = validateObservation(currentInput);
  const asOfMs = isoUtc(asOf);
  if (!Number.isInteger(maxAgeHours) || maxAgeHours < 1 || maxAgeHours > 24 * 90) reject('maxAgeHours must be an integer within 1–2160');
  const coverage = quality(current, asOfMs, maxAgeHours);
  const output = {
    schema: REPORT_SCHEMA,
    status: 'OFFLINE_SOURCE_ONLY_NOT_PROVIDER_VERIFIED',
    locationKey: current.locationKey,
    source: current.source,
    currentObservedAt: current.observedAt,
    previousObservedAt: previous?.observedAt ?? null,
    asOf,
    coverage,
    comparison: 'BASELINE_ONLY',
    rating: {previous: previous?.rating ?? null, current: current.rating, displayedDelta: null},
    reviewCount: {previous: previous?.reviewCount ?? null, current: current.reviewCount, netDelta: null},
    unrepliedCount: {current: current.unrepliedCount, state: current.unrepliedCount === null ? 'UNKNOWN' : 'OBSERVED_AGGREGATE'},
    newReviewsAttributed: null,
    customerDeliveryAuthorized: false,
    productionMonitoringEnabled: false,
    autoPublicReplyEnabled: false,
    explanation: 'Net review count movement is not a count of newly published reviews. Rating changes may reflect rounding. No individual review can be attributed to an outreach event.'
  };
  if (coverage !== 'CURRENT_AS_OF') {
    output.comparison = 'COVERAGE_HOLD';
    return finalizeReport(output);
  }
  if (!previous) return finalizeReport(output);
  if (previous.locationKey !== current.locationKey) reject('cross-location comparison prohibited');
  if (previous.source !== current.source) { output.comparison = 'SOURCE_CHANGED_HOLD'; return finalizeReport(output); }
  const previousTime = isoUtc(previous.observedAt);
  const currentTime = isoUtc(current.observedAt);
  if (previousTime > currentTime) { output.comparison = 'OUT_OF_ORDER_HOLD'; return finalizeReport(output); }
  if (previousTime === currentTime) {
    if ([...KEYS].some(key => previous[key] !== current[key])) { output.comparison = 'CONFLICTING_SAME_TIMESTAMP_HOLD'; return finalizeReport(output); }
    output.comparison = 'IDENTICAL_OBSERVATION';
    return finalizeReport(output);
  }
  if (previous.state !== 'observed') { output.comparison = 'PREVIOUS_COVERAGE_HOLD'; return finalizeReport(output); }
  output.rating.displayedDelta = Number((current.rating - previous.rating).toFixed(2));
  output.reviewCount.netDelta = current.reviewCount - previous.reviewCount;
  output.comparison = output.reviewCount.netDelta < 0 ? 'COUNT_DECREASED_RECONCILE' : output.reviewCount.netDelta > 0 ? 'NET_COUNT_INCREASED' : 'NO_NET_COUNT_CHANGE';
  return finalizeReport(output);
}
