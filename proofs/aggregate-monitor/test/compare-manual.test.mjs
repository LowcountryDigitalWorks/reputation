import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const cliPath = fileURLToPath(new URL('../tools/compare-manual.mjs', import.meta.url));
const schema = 'ldw.reputation.public-aggregate.v1';
const previous = Object.freeze({
  schema, locationKey:'fictional-harbor-market',source:'google_business_profile_manual',
  state:'observed',observedAt:'2026-11-09T12:00:00Z',
  rating:4.25,reviewCount:12,unrepliedCount:null
});
const current = Object.freeze({
  ...previous, observedAt:'2026-11-12T12:00:00Z',
  rating:4.33,reviewCount:16
});
const request = Object.freeze({previous,current,asOf:'2026-11-12T13:00:00Z'});

function invoke(payload) {
  const input = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return spawnSync(process.execPath,[cliPath],{
    input,encoding:'utf8',timeout:4000,maxBuffer:64*1024,
    env:{PATH:process.env.PATH}
  });
}
function reject(payload) {
  const result=invoke(payload);
  assert.equal(result.status,2,'expected fail-closed exit status 2');
  assert.equal(result.stdout,'');
  assert.equal(result.stderr,'AGGREGATE_INPUT_HOLD\n');
}

test('source-only manual aggregate result through stdout',()=>{
  const r=invoke(request);
  assert.equal(r.status,0,r.stderr);
  assert.equal(r.stderr,'');
  const o=JSON.parse(r.stdout);
  assert.equal(o.status,'OFFLINE_SOURCE_ONLY_NOT_PROVIDER_VERIFIED');
  assert.equal(o.coverage,'CURRENT_AS_OF');
  assert.equal(o.reviewCount.netDelta,4);
  assert.equal(o.rating.displayedDelta,0.08);
  assert.equal(o.customerDeliveryAuthorized,false);
  assert.equal(o.productionMonitoringEnabled,false);
  assert.equal(o.newReviewsAttributed,null);
});
test('identical input produces byte-identical stdout',()=>{
  const a=invoke(request),b=invoke(request);
  assert.equal(a.status,0);
  assert.equal(a.stdout,b.stdout);
});
test('an unavailable observation holds and does not manufacture zeros',()=>{
  const unavailable={...current,state:'unavailable',rating:null,reviewCount:null,unrepliedCount:null};
  const r=invoke({...request,current:unavailable});
  assert.equal(r.status,0);
  const o=JSON.parse(r.stdout);
  assert.equal(o.coverage,'UNAVAILABLE');
  assert.equal(o.reviewCount.netDelta,null);
  assert.equal(o.reviewCount.current,null);
});
test('policy-held API-sourced inputs are never compared',()=>{
  const api={...current,source:'google_business_profile_official_api'};
  const r=invoke({...request,current:api});
  assert.equal(r.status,0);
  const o=JSON.parse(r.stdout);
  assert.equal(o.coverage,'API_CONTENT_POLICY_HOLD');
  assert.equal(o.comparison,'COVERAGE_HOLD');
  assert.equal(o.reviewCount.netDelta,null);
});
test('invalid and unknown request keys reject without data echo',()=>{
  reject({...request,patientName:'Fictional Patient'});
  reject({...request,email:'someone@example.com'});
  reject({...request,accessToken:'TOPSECRET'});
});
test('nested personal/reviewer fields reject without echo',()=>{
  reject({...request,current:{...current,reviewerEmail:'someone@example.com'}});
  reject({...request,current:{...current,reviewText:'sensitive narrative'}});
});
test('malformed and missing required input reject',()=>{
  reject('garbage string');
  reject('null');
  reject('[]');
  reject({});
  reject({current,asOf:request.asOf});
});
test('empty stdin rejects safely',()=>reject(''));
test('excessively large input rejects silently',()=>reject('X'.repeat(16*1024+1)));
test('inconsistent location and bad timestamp reject without leaking input',()=>{
  reject({...request,current:{...current,locationKey:'other-location'}});
  reject({...request,asOf:'2026-13-34'});
});
test('future or stale observation remains a held output, not zero',()=>{
  const stale=invoke({...request,asOf:'2027-01-01T13:00:00Z'});
  assert.equal(stale.status,0);
  const o=JSON.parse(stale.stdout);
  assert.equal(o.coverage,'STALE');
  assert.equal(o.reviewCount.netDelta,null);
});
test('invalid max age rejects without escaping to stdout',()=>{
  reject({...request,maxAgeHours:0});
  reject({...request,maxAgeHours:'24'});
});

test('previous null emits baseline only without attributed review or inferred deltas',()=>{
  const r=invoke({...request,previous:null});
  assert.equal(r.status,0,r.stderr);
  const o=JSON.parse(r.stdout);
  assert.equal(o.coverage,'CURRENT_AS_OF');
  assert.equal(o.comparison,'BASELINE_ONLY');
  assert.equal(o.rating.previous,null);
  assert.equal(o.rating.displayedDelta,null);
  assert.equal(o.reviewCount.previous,null);
  assert.equal(o.reviewCount.netDelta,null);
  assert.equal(o.newReviewsAttributed,null);
  assert.equal(o.customerDeliveryAuthorized,false);
});
test('valid narrow freshness window includes boundary and holds one second beyond',()=>{
  const boundary=invoke({...request,maxAgeHours:1});
  assert.equal(boundary.status,0,boundary.stderr);
  const accepted=JSON.parse(boundary.stdout);
  assert.equal(accepted.coverage,'CURRENT_AS_OF');
  assert.equal(accepted.reviewCount.netDelta,4);
  const later=invoke({...request,maxAgeHours:1,asOf:'2026-11-12T13:00:01Z'});
  assert.equal(later.status,0,later.stderr);
  const stale=JSON.parse(later.stdout);
  assert.equal(stale.coverage,'STALE');
  assert.equal(stale.comparison,'COVERAGE_HOLD');
  assert.equal(stale.reviewCount.netDelta,null);
  assert.equal(stale.customerDeliveryAuthorized,false);
});
