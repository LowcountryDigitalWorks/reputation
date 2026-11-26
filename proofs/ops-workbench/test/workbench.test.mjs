import test from 'node:test';
import assert from 'node:assert/strict';
import {FICTIONAL_LOCATIONS, FIXTURE_CLOCK} from '../src/fixtures.mjs';
import {deriveWorkbench, derivePortfolio, validateFictionalLocation, deriveServiceEligibility, deriveOperatorHandoff} from '../src/workbench.mjs';
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
  const x=model({...cedar,mgr:{route:'rating_conditioned_hold',event:'none',delivery:'not_requested'}});
  assert.equal(x.status,'HOLD');assert.ok(x.tasks.some(t=>t.title.includes('sentiment-conditioned')));
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
  const nativeOnly=model({...harbor,approvals,service:{...harbor.service,route:'native_only'},
    mgr:{route:'not_connected',event:'none',delivery:'not_requested'}});
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
    {assessed:true, mgrRoute:'neutral_verified',
      blockingTasks:[{id:'route',severity:'hold',title:'Verify all five rating routes',detail:'policy hold'}]});
  assert.equal(e.assessed,true);
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.equal(e.ready,false);
  assert.deepEqual(e.blockers,['op_route']);
});
test('optional MGR route cannot clear while MGR is disconnected',()=>{
  const x=model(cedar);
  const e=x.serviceEligibility;
  assert.equal(x.status,'HOLD');
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,false);
  assert.equal(e.ready,false);
  assert.equal(e.display,'OPERATIONAL HOLD');
  assert.ok(x.tasks.some(t=>t.id==='route_availability'&&t.severity==='hold'));
  assert.ok(e.blockers.includes('op_route_availability'));
  assert.ok(e.reasons.some(r=>r.title==='MGR route not available'));
  assert.equal(e.customerDeliveryAuthorized,false);
});
test('service and MGR route matrix is fail-closed with native and verified controls',()=>{
  const expected={
    'native_only:unverified':false,
    'native_only:rating_conditioned_hold':false,
    'native_only:not_connected':true,
    'native_only:neutral_verified':true,
    'mgr_optional:unverified':false,
    'mgr_optional:rating_conditioned_hold':false,
    'mgr_optional:not_connected':false,
    'mgr_optional:neutral_verified':true
  };
  for(const [key,clears] of Object.entries(expected)){
    const [serviceRoute,mgrRoute]=key.split(':');
    const x=model({...readyFixture,
      service:{...readyFixture.service,route:serviceRoute},
      mgr:{route:mgrRoute,event:'none',delivery:'not_requested'}});
    const e=x.serviceEligibility;
    assert.equal(e.evidenceEligible,true,key+' should satisfy all event facts');
    assert.equal(e.operationalCleared,clears,key+' clearance mismatch');
    assert.equal(e.ready,clears,key+' readiness mismatch');
    assert.equal(x.status,clears?'REVIEW READY':'HOLD',key+' status mismatch');
    if(mgrRoute==='not_connected'&&serviceRoute==='mgr_optional')
      assert.ok(e.blockers.includes('op_route_availability'),key+' route availability hold missing');
    if(mgrRoute==='unverified'||mgrRoute==='rating_conditioned_hold')
      assert.ok(e.blockers.includes('op_route'),key+' unsafe MGR policy hold missing');
    assert.equal(e.customerDeliveryAuthorized,false,key+' must never authorize delivery');
  }
});
test('exported deriveServiceEligibility direct calls mirror the 2x4 workbench matrix with empty blockers',()=>{
  const expected={
    'native_only:unverified':false,
    'native_only:rating_conditioned_hold':false,
    'native_only:not_connected':true,
    'native_only:neutral_verified':true,
    'mgr_optional:unverified':false,
    'mgr_optional:rating_conditioned_hold':false,
    'mgr_optional:not_connected':false,
    'mgr_optional:neutral_verified':true
  };
  for(const [key,clears] of Object.entries(expected)){
    const [serviceRoute,mgrRoute]=key.split(':');
    const raw={...readyFixture.service,route:serviceRoute};
    const context={assessed:true,blockingTasks:[],mgrRoute};
    const direct=deriveServiceEligibility(raw,context);
    const viaModel=model({...readyFixture,service:raw,
      mgr:{route:mgrRoute,event:'none',delivery:'not_requested'}}).serviceEligibility;
    assert.equal(direct.assessed,true,key+' must be assessed');
    assert.equal(direct.evidenceEligible,true,key+' must use all positive event facts');
    assert.equal(direct.operationalCleared,clears,key+' clearance mismatch');
    assert.equal(direct.ready,clears,key+' readiness mismatch');
    assert.deepEqual(direct.blockers,viaModel.blockers,key+' direct/model blocker drift');
    assert.equal(direct.ready,viaModel.ready,key+' direct/model readiness drift');
    assert.equal(direct.state,clears?'ELIGIBLE_FOR_HUMAN_REVIEW':'OPERATIONAL_HOLD',key+' state mismatch');
    if(mgrRoute==='unverified'||mgrRoute==='rating_conditioned_hold')
      assert.ok(direct.blockers.includes('op_route'),key+' unsafe route hold missing');
    if(mgrRoute==='not_connected'&&serviceRoute==='mgr_optional')
      assert.ok(direct.blockers.includes('op_route_availability'),key+' availability hold missing');
    if(mgrRoute==='not_connected'&&serviceRoute==='native_only')
      assert.deepEqual(direct.blockers,[],key+' native disconnected must stay clear');
    assert.equal(direct.customerDeliveryAuthorized,false,key+' must never authorize delivery');
  }
});
test('direct-call unsafe route deduplicates a caller-supplied op_route blocker',()=>{
  for(const [mgrRoute,title] of [['unverified','Verify all five rating routes'],['rating_conditioned_hold','Reject sentiment-conditioned routing']]){
    const e=deriveServiceEligibility(readyFixture.service,
      {assessed:true,mgrRoute,
        blockingTasks:[{id:'route',severity:'hold',title,detail:'caller-provided route hold'}]});
    assert.deepEqual(e.blockers,['op_route'],mgrRoute+' must not duplicate op_route');
    assert.equal(e.reasons.filter(r=>r.code==='op_route').length,1,mgrRoute+' duplicate reason');
    assert.equal(e.reasons.find(r=>r.code==='op_route').detail,'caller-provided route hold');
    assert.equal(e.ready,false,mgrRoute+' must remain held');
  }
});
test('direct calls never qualify from scan, intake, sentiment or click alone',()=>{
  for(const signal of ['contactCardScan','serviceIntake','sentiment','click']){
    const nonQualifying={...readyFixture.service.nonQualifying,[signal]:true};
    const signalOnly={...readyFixture.service,completedService:false,consent:false,humanApproval:false,nonQualifying};
    const e=deriveServiceEligibility(signalOnly,{assessed:true,blockingTasks:[],mgrRoute:'neutral_verified'});
    assert.equal(e.evidenceEligible,false,signal+' cannot establish evidence eligibility');
    assert.equal(e.ready,false,signal+' cannot qualify');
    assert.ok(e.nonQualifying.includes(signal),signal+' must stay reported as non-qualifying');
    assert.equal(e.customerDeliveryAuthorized,false,signal+' cannot authorize delivery');
    const withEvidence=deriveServiceEligibility({...readyFixture.service,nonQualifying},
      {assessed:true,blockingTasks:[],mgrRoute:'neutral_verified'});
    assert.equal(withEvidence.ready,true,signal+' may coexist with genuine evidence');
    assert.equal(withEvidence.customerDeliveryAuthorized,false);
  }
});
test('direct-call eligibility stays independent of public reply approval',()=>{
  const direct=deriveServiceEligibility(readyFixture.service,
    {assessed:true,blockingTasks:[],mgrRoute:'neutral_verified'});
  assert.equal(direct.ready,true);
  assert.ok(!direct.blockers.some(b=>b==='op_reply'));
  const x=model({...readyFixture,replyQueue:'approval_required',
    approvals:{...readyFixture.approvals,replyApprover:false}});
  assert.ok(x.tasks.some(t=>t.id==='reply'&&t.severity==='human'));
  assert.equal(x.serviceEligibility.ready,true);
  assert.equal(x.customerDeliveryAuthorized,false);
});
test('unassessed or malformed operations context fails closed',()=>{
  const bad=[undefined,null,{},{assessed:false,blockingTasks:[],mgrRoute:'neutral_verified'},
    {assessed:false,blockingTasks:[],mgrRoute:'unverified'},
    {assessed:true,blockingTasks:'none',mgrRoute:'neutral_verified'},
    {assessed:true,blockingTasks:[{}],mgrRoute:'neutral_verified'},
    {assessed:true,blockingTasks:[],mgrRoute:'mgr_verified'},
    {assessed:true,blockingTasks:[],mgrRoute:'rating_conditioned_hold',extra:true},
    {assessed:true,blockingTasks:[],mgrRoute:'neutral_verified',extra:true}];
  for(const context of bad){
    const e=deriveServiceEligibility(readyFixture.service,context);
    assert.equal(e.assessed,false);
    assert.equal(e.evidenceEligible,true);
    assert.equal(e.operationalCleared,false);
    assert.equal(e.ready,false);
    assert.equal(e.state,'OPERATIONS_NOT_ASSESSED');
    assert.equal(e.display,'OPERATIONS NOT ASSESSED');
    assert.equal(e.clearance,'Operations not assessed');
    assert.deepEqual(e.blockers,['unassessed_operations']);
    assert.ok(e.reasons.some(r=>r.code==='unassessed_operations'));
    assert.equal(e.customerDeliveryAuthorized,false);
  }
});
test('unrelated public reply approval stays an independent human task',()=>{
  const x=model({...readyFixture,replyQueue:'approval_required',
    approvals:{...readyFixture.approvals,replyApprover:false}});
  const e=x.serviceEligibility;
  assert.equal(e.evidenceEligible,true);
  assert.equal(e.operationalCleared,true);
  assert.equal(e.ready,true);
  assert.equal(e.display,'ELIGIBLE / HUMAN ONLY');
  assert.ok(x.tasks.some(t=>t.id==='reply'&&t.severity==='human'));
  assert.ok(!e.blockers.some(b=>b==='op_reply'));
  assert.equal(e.customerDeliveryAuthorized,false);
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

// ---- G3a+ local fictional operator decision handoff summary ----
test('operator handoff is derived only from a validated read-only row',()=>{
  const row=model(harbor);
  const h=deriveOperatorHandoff(row);
  assert.equal(h.state,row.status);
  assert.equal(h.location,row.name+' · '+row.kind+' · '+row.owner);
  assert.equal(h.source,row.report.source);
  assert.equal(h.observedAt,row.report.currentObservedAt);
  assert.equal(h.deliveryAuthorized,false);
  assert.match(h.delivery,/No customer delivery, public reply, external send or live action/);
  assert.throws(()=>deriveOperatorHandoff({...row,customerDeliveryAuthorized:true}),/derived workbench row required/);
  assert.throws(()=>deriveOperatorHandoff({id:'x'}),/derived workbench row required/);
  assert.throws(()=>deriveOperatorHandoff(null),/derived workbench row required/);
});
test('handoff preserves source, as-of, coverage, withheld counts and net-movement boundary',()=>{
  const h=deriveOperatorHandoff(model(harbor));
  assert.equal(h.coverage,'CURRENT_AS_OF');
  assert.equal(h.publicCount,'25');
  assert.match(h.countNote,/Net count movement \+2/);
  assert.match(h.countNote,/not newly attributed reviews/);
  const stale=deriveOperatorHandoff(model(marsh));
  assert.equal(stale.publicCount,'Withheld');
  assert.equal(stale.observedAt,null);
  assert.equal(stale.coverage,'STALE');
  assert.match(stale.countNote,/Withheld means no permitted current value, not zero/);
  assert.doesNotMatch(stale.countNote,/0 reviews/);
});
test('handoff never promotes MGR activity or non-qualifying signals',()=>{
  const h=deriveOperatorHandoff(model(harbor));
  assert.match(h.mgrNote,/MGR rating-link click/);
  assert.match(h.mgrNote,/never promoted to a published Google review/);
  assert.match(h.signals,/Contact-card scan/);
  assert.match(h.signals,/never qualify/);
  assert.match(deriveOperatorHandoff(model(marsh)).signals,/No scan, intake, sentiment or click recorded; none would qualify/);
});
test('handoff separates service eligibility from operational clearance with a concrete next task',()=>{
  const h=deriveOperatorHandoff(model(cedar));
  assert.match(h.readiness,/Service eligibility: evidence established/);
  assert.match(h.readiness,/OPERATIONAL HOLD/);
  assert.match(h.readiness,/Operational clearance: hold/);
  assert.equal(h.nextTask,'MGR route not available');
  assert.match(h.nextReason,/no customer action is enabled/);
  const unsafe=deriveOperatorHandoff(model({...readyFixture,
    mgr:{route:'rating_conditioned_hold',event:'none',delivery:'not_requested'}}));
  assert.equal(unsafe.nextTask,'Reject sentiment-conditioned routing');
  assert.match(unsafe.readiness,/Operational clearance: hold/);
  assert.equal(unsafe.deliveryAuthorized,false);
});
test('handoff keeps public reply authority independent and grants no delivery',()=>{
  const cedarHandoff=deriveOperatorHandoff(model(cedar));
  assert.match(cedarHandoff.replyAuthority,/Confirm reply approver/);
  assert.match(cedarHandoff.replyAuthority,/independent of service eligibility/);
  const bayline=deriveOperatorHandoff(model(FICTIONAL_LOCATIONS[3]));
  assert.match(bayline.replyAuthority,/no public reply is queued/);
  assert.equal(bayline.nextTask,'No open fictional decision');
  for(const h of [cedarHandoff,bayline]){
    assert.equal(h.deliveryAuthorized,false);
    assert.match(h.delivery,/No customer delivery/);
  }
});
