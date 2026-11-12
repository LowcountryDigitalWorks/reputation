import test from 'node:test';
import assert from 'node:assert/strict';
import {OBSERVATION_SCHEMA, validateObservation, compareAggregateObservations} from '../src/aggregate-monitor.mjs';

const old = Object.freeze({schema:OBSERVATION_SCHEMA,locationKey:'fictional-harbor-office',source:'google_business_profile_manual',state:'observed',observedAt:'2026-11-10T12:00:00Z',rating:4.8,reviewCount:51,unrepliedCount:null});
const now = Object.freeze({...old,observedAt:'2026-11-12T12:00:00Z',rating:4.8,reviewCount:54});
const time = {asOf:'2026-11-12T13:00:00Z'};
function bad(patch){return {...now,...patch};}
function run(x=now,p=old,o=time){return compareAggregateObservations(p,x,o);}

test('valid frozen immutable observation',()=>{const o=validateObservation(now);assert.ok(Object.isFrozen(o));assert.deepEqual(o,now);});
test('net count positive is not new review count',()=>{const x=run();assert.equal(x.comparison,'NET_COUNT_INCREASED');assert.equal(x.reviewCount.netDelta,3);assert.equal(x.newReviewsAttributed,null);assert.equal(x.customerDeliveryAuthorized,false);});
test('accepts valid 2-decimal rating despite floating-point precision',()=>assert.equal(validateObservation(bad({rating:4.27})).rating,4.27));
test('same-timestamp canonical duplicate ignores object property order',()=>assert.equal(run(Object.fromEntries(Object.entries(old).reverse()),old).comparison,'IDENTICAL_OBSERVATION'));
test('no net movement',()=>assert.equal(run({...now,reviewCount:51}).comparison,'NO_NET_COUNT_CHANGE'));
test('count decreasing holds for reconciliation',()=>assert.equal(run({...now,reviewCount:50}).comparison,'COUNT_DECREASED_RECONCILE'));
test('rating change does not imply causation',()=>{const x=run({...now,rating:4.7});assert.equal(x.rating.displayedDelta,-0.1);assert.match(x.explanation,/rounding/);});
test('identical timestamp and data gives idempotent observation',()=>assert.equal(run(old,old).comparison,'IDENTICAL_OBSERVATION'));
test('conflicting same timestamp holds',()=>assert.equal(run({...old,reviewCount:52},old).comparison,'CONFLICTING_SAME_TIMESTAMP_HOLD'));
test('old timestamp holds',()=>assert.equal(run(old,now).comparison,'OUT_OF_ORDER_HOLD'));
test('cross-location comparison rejected',()=>assert.throws(()=>run({...now,locationKey:'other-site'}),/cross-location/));
test('source changes hold without cross-provider metric comparison',()=>assert.equal(run({...now,source:'google_business_profile_official_api'}).comparison,'SOURCE_CHANGED_HOLD'));
test('missing prior snapshot is baseline only',()=>assert.equal(run(now,null).comparison,'BASELINE_ONLY'));
test('data stale relative to fixed clock',()=>assert.equal(run(now,old,{asOf:'2026-12-10T13:00:00Z'}).comparison,'COVERAGE_HOLD'));
test('future observation not allowed to appear current',()=>assert.equal(run(now,old,{asOf:'2026-11-11T13:00:00Z'}).coverage,'FUTURE_OBSERVATION_HOLD'));
test('unavailable metrics must be null',()=>assert.throws(()=>validateObservation(bad({state:'unavailable'})),/unavailable/));
test('unavailable row is not zero',()=>{const x=run(bad({state:'unavailable',rating:null,reviewCount:null,unrepliedCount:null}));assert.equal(x.comparison,'COVERAGE_HOLD');assert.equal(x.reviewCount.current,null)});
test('unapproved observation is not zero',()=>assert.equal(run(bad({state:'not_authorized',rating:null,reviewCount:null,unrepliedCount:null})).coverage,'NOT_AUTHORIZED'));
test('rejects unknown fields including reviewer identifiers',()=>assert.throws(()=>validateObservation({...now,email:'patient@example.com'}),/unknown input field/));
test('rejects nested review text',()=>assert.throws(()=>validateObservation({...now,reviews:[{text:'test'}]}),/unknown input field/));
test('rejects bearer tokens as extra fields',()=>assert.throws(()=>validateObservation({...now,access_token:'abc'}),/unknown input field/));
test('rejects illegal source and scraping',()=>assert.throws(()=>validateObservation(bad({source:'google_maps_scraper'})),/only authorized/));
test('rejects invalid timestamps',()=>assert.throws(()=>validateObservation(bad({observedAt:'2026-02-30T13:00:00Z'})),/timestamp/));
test('rejects malformed timezone',()=>assert.throws(()=>validateObservation(bad({observedAt:'2026-11-12T12:00:00-05:00'})),/timestamp/));
test('rejects rating outside bounds',()=>assert.throws(()=>validateObservation(bad({rating:5.1})),/rating/));
test('rejects invalid review counts',()=>assert.throws(()=>validateObservation(bad({reviewCount:-1})),/reviewCount/));
test('rejects unreplied exceeding count',()=>assert.throws(()=>validateObservation(bad({unrepliedCount:1000})),/unreplied/));
test('rejects unknown observer source',()=>assert.throws(()=>validateObservation(bad({source:'places_api'})),/authorized first-party/));
test('rejects invalid location key',()=>assert.throws(()=>validateObservation(bad({locationKey:'Eddie@home'})),/location key/));
test('rejects invalid maxAgeHours',()=>assert.throws(()=>run(now,old,{...time,maxAgeHours:0}),/maxAgeHours/));
test('rejects missing asOf for deterministic comparison',()=>assert.throws(()=>run(now,old,{}),/timestamp/));
test('output does not include reviews or contacts',()=>{const s=JSON.stringify(run());assert.ok(!s.includes('patient@example.com'));assert.ok(!s.includes('reviewer'));assert.ok(!s.includes('reviewText'));});
test('deterministic output repeated input is byte-identical',()=>assert.equal(JSON.stringify(run()),JSON.stringify(run())));
