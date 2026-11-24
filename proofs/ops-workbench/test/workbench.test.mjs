import test from 'node:test';
import assert from 'node:assert/strict';
import {FICTIONAL_LOCATIONS, FIXTURE_CLOCK} from '../src/fixtures.mjs';
import {deriveWorkbench, derivePortfolio, validateFictionalLocation, deriveServiceEligibility} from '../src/workbench.mjs';
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
test('unverified MGR route is a HOLD even when all fictional approvals are present',()=>{
  const approvals={service:true,operator:true,cadence:true,replyApprover:true};
  const unverified=model({...harbor,approvals});
  assert.equal(unverified.status,'HOLD','unverified public-review route cannot appear review-ready');
  assert.ok(unverified.tasks.some(t=>t.id==='route'&&t.severity==='hold'));
  assert.equal(unverified.customerDeliveryAuthorized,false);

  // Deliberately disconnected MGR is different: authorized native-only work
  // can be reviewed without asserting that an unverified MGR funnel is safe.
  const nativeOnly=model({...harbor,approvals,mgr:{route:'not_connected',event:'none',delivery:'not_requested'}});
  assert.equal(nativeOnly.status,'REVIEW READY');
  assert.ok(nativeOnly.tasks.some(t=>t.id==='route'&&t.severity==='verify'));
  assert.equal(nativeOnly.actionsEnabled,false);
  assert.equal(nativeOnly.customerDeliveryAuthorized,false);
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

// ---- G3a+ deterministic fictional service readiness/eligibility ----
const readyFixture = FICTIONAL_LOCATIONS[3];
test('service readiness requires genuine completed service, consent and human approval',()=>{
  const ready=model(readyFixture);
  assert.equal(ready.serviceEligibility.ready,true);
  assert.equal(ready.serviceEligibility.state,'ELIGIBLE_FOR_HUMAN_REVIEW');
  assert.equal(ready.serviceEligibility.customerDeliveryAuthorized,false);
  for(const [field,code] of [['completedService','no_completed_service'],['consent','no_consent'],['humanApproval','no_human_approval']]){
    const bad=model({...readyFixture,service:{...readyFixture.service,[field]:false}});
    assert.equal(bad.serviceEligibility.ready,false,field+' must block eligibility');
    assert.ok(bad.serviceEligibility.reasons.some(r=>r.code===code),code+' reason missing');
  }
});
test('suppression blocks eligibility even with completed service and consent',()=>{
  const suppressed=model({...readyFixture,service:{...readyFixture.service,suppressed:true}});
  assert.equal(suppressed.serviceEligibility.ready,false);
  assert.ok(suppressed.serviceEligibility.reasons.some(r=>r.code==='suppressed'));
  assert.equal(suppressed.customerDeliveryAuthorized,false);
});
test('contact-card scan, intake, sentiment and click never qualify by themselves',()=>{
  const x=model(harbor);
  assert.equal(x.serviceEligibility.ready,false);
  assert.deepEqual(x.serviceEligibility.nonQualifying,['contactCardScan','serviceIntake','sentiment','click']);
  assert.deepEqual(x.serviceEligibility.nonQualifyingLabels,['Contact-card scan','Service intake','Sentiment','Click']);
  assert.ok(x.serviceEligibility.reasons.some(r=>r.code==='non_qualifying_only'));
  // A click may coexist with a genuinely qualified case, but never grants delivery.
  const withClick=model(readyFixture);
  assert.ok(withClick.serviceEligibility.nonQualifying.includes('click'));
  assert.equal(withClick.serviceEligibility.ready,true);
  assert.equal(withClick.customerDeliveryAuthorized,false);
  assert.equal(withClick.serviceEligibility.customerDeliveryAuthorized,false);
});
test('native-only and optional MGR service routes are distinguished',()=>{
  assert.equal(model(harbor).serviceEligibility.routeLabel,'Optional MGR route');
  const native=model(marsh);
  assert.equal(native.serviceEligibility.routeLabel,'Native-only');
  assert.equal(native.serviceEligibility.ready,false);
  assert.ok(native.serviceEligibility.reasons.some(r=>r.code==='suppressed'));
  assert.ok(native.serviceEligibility.reasons.some(r=>r.code==='no_completed_service'));
});
test('service readiness input shape fails closed',()=>{
  assert.throws(()=>validateFictionalLocation({...harbor,service:{...harbor.service,route:'mgr_verified'}}),/service route classification/);
  assert.throws(()=>validateFictionalLocation({...harbor,service:{...harbor.service,leadEmail:'fiction@example.com'}}),/service readiness shape/);
  assert.throws(()=>validateFictionalLocation({...harbor,service:{...harbor.service,nonQualifying:{...harbor.service.nonQualifying,cardScan:true}}}),/non-qualifying signal flags/);
  assert.throws(()=>validateFictionalLocation({...harbor,service:undefined}),/service readiness shape/);
});
test('portfolio exposes deterministic eligibility and no live authorization',()=>{
  const x=derivePortfolio(FICTIONAL_LOCATIONS,FIXTURE_CLOCK);
  assert.deepEqual(x.rows.map(r=>r.serviceEligibility.state),
    ['EVIDENCE_HOLD','OPERATIONAL_HOLD','EVIDENCE_HOLD','ELIGIBLE_FOR_HUMAN_REVIEW']);
  for(const r of x.rows){
    assert.equal(r.customerDeliveryAuthorized,false);
    assert.equal(r.serviceEligibility.customerDeliveryAuthorized,false);
  }
});

// ---- IR corrections: event evidence vs operational clearance ----
test('all service flags satisfied cannot clear an unverified MGR route',()=>{
  const x=model({...readyFixture,mgr:{route:'unverified',event:'rating_link_clicked',delivery:'scheduled'}});
  const e=x.serviceEligibility;
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.equal(e.ready,false);
  assert.equal(e.state,'OPERATIONAL_HOLD');
  assert.equal(e.display,'OPERATIONAL HOLD');
  assert.ok(e.blockers.includes('op_route'));
  assert.equal(e.customerDeliveryAuthorized,false);
});
test('rating-conditioned MGR route overrides satisfied service evidence',()=>{
  const x=model({...readyFixture,mgr:{route:'rating_conditioned_hold',event:'none',delivery:'not_requested'}});
  const e=x.serviceEligibility;
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.equal(e.ready,false);
  assert.ok(e.blockers.includes('op_route'));
  assert.ok(e.reasons.some(r=>r.title.includes('sentiment-conditioned')));
});
test('stale coverage overrides satisfied service evidence',()=>{
  const x=model({...readyFixture,current:{...readyFixture.current,observedAt:'2026-10-01T11:00:00Z'}});
  assert.equal(x.report.coverage,'STALE');
  const e=x.serviceEligibility;
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.ok(e.blockers.includes('op_coverage'));
  assert.equal(e.ready,false);
});
test('missing approval overrides satisfied service evidence',()=>{
  const x=model({...readyFixture,approvals:{...readyFixture.approvals,service:false}});
  const e=x.serviceEligibility;
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.ok(e.blockers.includes('op_service'));
  assert.equal(e.ready,false);
});
test('disconnected native-only and satisfied optional MGR paths can clear',()=>{
  const native=model({...readyFixture,service:{...readyFixture.service,route:'native_only'},
    mgr:{route:'not_connected',event:'none',delivery:'not_requested'}});
  const ne=native.serviceEligibility;
  assert.equal(ne.evidenceEligible,true);
  assert.equal(ne.operationalCleared,true);
  assert.equal(ne.ready,true);
  assert.equal(ne.routeLabel,'Native-only');
  assert.deepEqual(ne.blockers,[]);
  assert.ok(native.tasks.some(t=>t.id==='route'&&t.severity==='verify'));
  assert.equal(ne.customerDeliveryAuthorized,false);

  const optional=model({...readyFixture,service:{...readyFixture.service,route:'mgr_optional'},
    mgr:{route:'neutral_verified',event:'first_party_feedback_updated',delivery:'delivered'}});
  const oe=optional.serviceEligibility;
  assert.equal(oe.evidenceEligible,true);
  assert.equal(oe.operationalCleared,true);
  assert.equal(oe.ready,true);
  assert.equal(oe.routeLabel,'Optional MGR route');
  assert.equal(oe.customerDeliveryAuthorized,false);
});
test('explicit blocking context overrides event-only derivation',()=>{
  const e=deriveServiceEligibility(readyFixture.service,
    {blockingTasks:[{id:'route',severity:'hold',title:'Verify all five rating routes',detail:'policy hold'}]});
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.equal(e.ready,false);
  assert.deepEqual(e.blockers,['op_route']);
});
test('non-string kind is held with a controlled fixture message',()=>{
  assert.throws(()=>validateFictionalLocation({...harbor,kind:42}),
    /^TypeError: WORKBENCH_FIXTURE_HOLD: fictional subject labeling$/);
  assert.throws(()=>model({...harbor,kind:null}),/WORKBENCH_FIXTURE_HOLD: fictional subject labeling/);
});
test('rating click requires a non-qualifying click flag; other clicks may be observed',()=>{
  assert.throws(()=>model({...harbor,service:{...harbor.service,
    nonQualifying:{...harbor.service.nonQualifying,click:false}}}),
    /rating click requires non-qualifying click flag/);
  assert.doesNotThrow(()=>model(readyFixture));
  assert.equal(model(readyFixture).serviceEligibility.nonQualifying.includes('click'),true);
});
