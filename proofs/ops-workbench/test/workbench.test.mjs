import test from 'node:test';
import assert from 'node:assert/strict';
import {FICTIONAL_LOCATIONS, FIXTURE_CLOCK} from '../src/fixtures.mjs';
import {deriveWorkbench, derivePortfolio, validateFictionalLocation} from '../src/workbench.mjs';
const [harbor,cedar,marsh] = FICTIONAL_LOCATIONS;
const model = x=>deriveWorkbench(x,FIXTURE_CLOCK);

test('fixture-only overview is fail-closed',()=>{
  const x=derivePortfolio(FICTIONAL_LOCATIONS,FIXTURE_CLOCK);
  assert.equal(x.fixture,true); assert.equal(x.rows.length,4); assert.equal(x.liveProviders,0); assert.equal(x.customerServicesActive,0);
  for(const row of x.rows){assert.equal(row.actionsEnabled,false);assert.equal(row.productionConnected,false);assert.equal(row.customerDeliveryAuthorized,false);}
});
test('reuse existing aggregate engine for manual source with no attribution',()=>{
  const x=model(harbor);
  assert.equal(x.report.coverage,'CURRENT_AS_OF');assert.equal(x.report.reviewCount.netDelta,2);
  assert.equal(x.report.newReviewsAttributed,null);assert.equal(x.report.source,'google_business_profile_manual');
  assert.equal(x.publicEvidence,'Fictional manual native observation');
});
test('MGR click and scheduled message never imply public review or delivery',()=>{
  const x=model(harbor);
  assert.match(x.mgrEvidence,/Not a submitted or published Google review/);
  assert.match(x.messageEvidence,/delivery not verified/);
  assert.ok(x.tasks.some(t=>t.id==='route'));assert.equal(x.actionsEnabled,false);
});
test('rating-conditional path forces hold even if service inputs are satisfied',()=>{
  const x=model(cedar);assert.equal(x.status,'HOLD');assert.ok(x.tasks.some(t=>t.title.includes('sentiment-conditioned')));
});
test('stale source never leaks aggregate numbers or timestamps into report',()=>{
  const x=model(marsh);assert.equal(x.report.coverage,'STALE');assert.equal(x.report.reviewCount.current,null);
  assert.equal(x.report.currentObservedAt,null);assert.equal(x.publicEvidence,'Not current / withheld');
});
test('rejected fields cannot become unsanitized display or personal records',()=>{
  assert.throws(()=>validateFictionalLocation({...harbor,fixture:false}),/explicit fictional fixture marker/);
  assert.throws(()=>validateFictionalLocation({...harbor,patientEmail:'fiction@example.com'}),/strict location shape/);
  assert.throws(()=>validateFictionalLocation({...harbor,name:'<script>alert(1)</script>'}),/fictional presentation text/);
  assert.throws(()=>model({...harbor,current:{...harbor.current,reviewText:'patient notes'}}),/unknown input field/);
});
test('wrong location and duplicate location fail closed',()=>{
  assert.throws(()=>model({...harbor,current:{...harbor.current,locationKey:'other-location'}}),/scope/);
  assert.throws(()=>derivePortfolio([harbor,harbor],FIXTURE_CLOCK),/duplicate location/);
});
test('no approval choices can silently grant live production scope',()=>{
  const x=model({...harbor,approvals:{service:true,operator:true,cadence:true,replyApprover:true},mgr:{route:'neutral_verified',event:'first_party_feedback_updated',delivery:'delivered'}});
  assert.equal(x.status,'REVIEW READY');assert.equal(x.actionsEnabled,false);assert.equal(x.productionConnected,false);
  assert.equal(x.customerDeliveryAuthorized,false);assert.match(x.mgrEvidence,/Not a published Google review/);
});

test('fictional fully approved scenario still cannot activate any live service',()=>{
  const x=model(FICTIONAL_LOCATIONS[3]);
  assert.equal(x.status,'REVIEW READY');assert.equal(x.report.coverage,'CURRENT_AS_OF');
  assert.equal(x.productionConnected,false);assert.equal(x.customerDeliveryAuthorized,false);
});

test('count decrease is a hold requiring human reconciliation',()=>{
  const x=model({...harbor,current:{...harbor.current,reviewCount:20}});
  assert.equal(x.report.comparison,'COUNT_DECREASED_RECONCILE');
  assert.ok(x.tasks.some(t=>t.id==='decline'&&t.severity==='hold'));
});
