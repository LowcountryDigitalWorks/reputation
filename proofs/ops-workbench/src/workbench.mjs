/** Read-only, deterministic projection of explicitly fictional evidence. No IO. */
import {compareAggregateObservations} from '../../aggregate-monitor/src/aggregate-monitor.mjs';

const APPROVALS = ['service', 'operator', 'cadence', 'replyApprover'];
const ROUTES = new Set(['unverified', 'rating_conditioned_hold', 'not_connected', 'neutral_verified']);
const EVENTS = new Set(['rating_link_clicked', 'first_party_feedback_updated', 'none']);
const DELIVERY = new Set(['scheduled', 'not_requested', 'delivered']);
const REPLIES = new Set(['approval_required', 'unknown', 'none']);
const KEYS = new Set(['fixture', 'id', 'name', 'kind', 'owner', 'approvals', 'previous', 'current', 'mgr', 'replyQueue', 'service']);
const MGR_KEYS = new Set(['route', 'event', 'delivery']);
const SERVICE_KEYS = new Set(['route', 'completedService', 'consent', 'suppressed', 'humanApproval', 'nonQualifying']);
const SERVICE_ROUTES = new Set(['native_only', 'mgr_optional']);
const TASK_KEYS = new Set(['id', 'severity', 'title', 'detail']);
const CONTEXT_KEYS = new Set(['assessed', 'blockingTasks', 'mgrRoute']);
const NON_QUALIFYING_KEYS = ['contactCardScan', 'serviceIntake', 'sentiment', 'click'];
const NON_QUALIFYING = new Set(NON_QUALIFYING_KEYS);
const NON_QUALIFYING_LABELS = {
  contactCardScan: 'Contact-card scan',
  serviceIntake: 'Service intake',
  sentiment: 'Sentiment',
  click: 'Click'
};
const SAFE_ID = /^[a-z]+(?:-[a-z]+)*$/;
function guard(condition, reason) {if (!condition) throw new TypeError('WORKBENCH_FIXTURE_HOLD: ' + reason);}
function plain(o) {return o !== null && typeof o === 'object' && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;}
function exactKeys(o, keys) {return Object.keys(o).length === keys.size && [...keys].every(k => Object.hasOwn(o, k));}

export function validateFictionalLocation(x) {
  guard(plain(x) && exactKeys(x, KEYS), 'strict location shape');
  guard(x.fixture === true, 'explicit fictional fixture marker');
  guard(SAFE_ID.test(x.id) && x.id.length <= 40, 'opaque location key');
  guard(typeof x.kind === 'string' && typeof x.owner === 'string', 'fictional subject labeling');
  guard(x.kind.startsWith('Fictional ') && /fictional/i.test(x.owner), 'fictional subject labeling');
  for (const key of ['name','kind','owner']) guard(typeof x[key] === 'string' && x[key].length > 0 && x[key].length < 90 && !/[<>@]/.test(x[key]), 'fictional presentation text');
  guard(plain(x.approvals) && exactKeys(x.approvals, new Set(APPROVALS)) && APPROVALS.every(k => typeof x.approvals[k] === 'boolean'), 'approval state');
  guard(plain(x.mgr) && exactKeys(x.mgr, MGR_KEYS) && ROUTES.has(x.mgr.route) && EVENTS.has(x.mgr.event) && DELIVERY.has(x.mgr.delivery), 'MGR evidence classification');
  guard(REPLIES.has(x.replyQueue), 'human response state');
  guard(plain(x.current) && x.current.locationKey === x.id, 'native source observation scope');
  guard(x.previous === null || (plain(x.previous) && x.previous.locationKey === x.id), 'previous observation scope');
  validateServiceReadiness(x.service);
  // An actual rating-link click must be represented as a non-qualifying click.
  // Clicks observed in other scenarios may be recorded independently.
  if (x.mgr.event === 'rating_link_clicked')
    guard(x.service.nonQualifying.click === true, 'rating click requires non-qualifying click flag');
  return x;
}

const explanation = {
  rating_link_clicked: 'MGR rating-link click / first-party rating capture only. Not a submitted or published Google review.',
  first_party_feedback_updated: 'MGR first-party feedback record updated. Not a published Google review.',
  none: 'No MGR event in this fictional scenario. This is not evidence of no real reviews.'
};
const delivery = {
  scheduled: 'Request scheduled in MGR; delivery not verified.',
  delivered: 'MGR claims delivery in this scenario; reading or review publication not established.',
  not_requested: 'No review request is represented in this fictional sample.'
};

function validateServiceReadiness(s) {
  guard(plain(s) && exactKeys(s, SERVICE_KEYS), 'service readiness shape');
  guard(SERVICE_ROUTES.has(s.route), 'service route classification');
  for (const key of ['completedService','consent','suppressed','humanApproval'])
    guard(typeof s[key] === 'boolean', 'service readiness boolean state');
  guard(plain(s.nonQualifying) && exactKeys(s.nonQualifying, NON_QUALIFYING) &&
    NON_QUALIFYING_KEYS.every(k => typeof s.nonQualifying[k] === 'boolean'), 'non-qualifying signal flags');
  return s;
}
const reason = (code, severity, title, detail) => Object.freeze({code, severity, title, detail});
const ROUTE_POLICY_HOLDS = Object.freeze({
  unverified: Object.freeze({id:'route', severity:'hold', title:'Verify all five rating routes', detail:'Do not treat unverified MGR public-review routing as ready. Inspect the exact authorized project; MGR visibility is not routing proof.'}),
  rating_conditioned_hold: Object.freeze({id:'route', severity:'hold', title:'Reject sentiment-conditioned routing', detail:'A public Google option cannot depend on a favorable rating.'})
});
const routePolicyHold = mgrRoute => ROUTE_POLICY_HOLDS[mgrRoute] || null;

/**
 * A service-only call cannot assess operational holds. Accept only a complete,
 * internally derived context; otherwise fail closed rather than inferring
 * clearance from missing data. Never throws for a malformed context.
 */
function assessedOperations(context) {
  if (!plain(context) || !exactKeys(context, CONTEXT_KEYS) || context.assessed !== true ||
      !ROUTES.has(context.mgrRoute) || !Array.isArray(context.blockingTasks)) return false;
  return context.blockingTasks.every(t => plain(t) && exactKeys(t, TASK_KEYS) &&
    typeof t.id === 'string' && t.id.length > 0 && t.severity === 'hold' &&
    typeof t.title === 'string' && t.title.length > 0 &&
    typeof t.detail === 'string' && t.detail.length > 0);
}

/**
 * Deterministic, fictional-only service readiness. No action is enabled.
 * Evidence eligibility (event facts) and operational clearance (location,
 * route-policy, coverage and approval holds) are reported separately; a
 * location-level hold always overrides otherwise satisfied event flags.
 * An optional MGR route also requires MGR to be connected. An unassessed or
 * malformed context never clears. Unsafe MGR route policy is an independent
 * hold even when a direct caller supplies no blocking tasks. Public reply
 * approval stays an independent human task and is not an operational hold.
 */
export function deriveServiceEligibility(raw, context = null) {
  const s = validateServiceReadiness(raw);
  const reasons = [];
  if (!s.completedService) reasons.push(reason('no_completed_service','hold','No genuine completed service','Only a documented, genuinely completed service can support eligibility. A scan, intake form, sentiment value or click is not a completed service.'));
  if (!s.consent) reasons.push(reason('no_consent','hold','Consent not recorded','Explicit, current fictional consent is required. Silence or contact activity is not consent.'));
  if (s.suppressed) reasons.push(reason('suppressed','hold','Suppression active','A suppression or do-not-contact state blocks eligibility regardless of the other fictional inputs.'));
  if (!s.humanApproval) reasons.push(reason('no_human_approval','human','Human approval required','An authorized human must approve the fictional readiness decision. No automated qualification is performed.'));
  const nonQualifying = NON_QUALIFYING_KEYS.filter(k => s.nonQualifying[k]);
  if (nonQualifying.length) reasons.push(reason('non_qualifying_only','verify','Non-qualifying signals present','Observed only: ' + nonQualifying.map(k => NON_QUALIFYING_LABELS[k]).join(', ') + '. None establishes eligibility, consent, suppression state or a completed service.'));
  const evidenceEligible = s.completedService && s.consent && !s.suppressed && s.humanApproval;
  const assessed = assessedOperations(context);
  const blockers = [];
  if (!assessed) {
    blockers.push(reason('unassessed_operations','hold','Operations not assessed',
      'Operational holds and route availability were not supplied. This fictional case stays on hold until they are assessed.'));
  } else {
    for (const t of context.blockingTasks) blockers.push(reason('op_' + t.id, 'hold', t.title, t.detail));
    const policyHold = routePolicyHold(context.mgrRoute);
    if (policyHold && !blockers.some(b => b.code === 'op_' + policyHold.id)) {
      blockers.push(reason('op_' + policyHold.id, policyHold.severity, policyHold.title, policyHold.detail));
    }
    if (s.route === 'mgr_optional' && context.mgrRoute === 'not_connected' &&
        !blockers.some(b => b.code === 'op_route_availability')) {
      blockers.push(reason('op_route_availability','hold','MGR route not available',
        'This fictional case selects an optional MGR route, but MGR is not connected. Use a connected, verified MGR route or switch to native-only; no customer action is enabled.'));
    }
  }
  for (const blocker of blockers) reasons.push(blocker);
  const operationalCleared = assessed && blockers.length === 0;
  const ready = evidenceEligible && operationalCleared;
  return Object.freeze({
    route:s.route,
    routeLabel:s.route === 'native_only' ? 'Native-only' : 'Optional MGR route',
    assessed, evidenceEligible, operationalCleared, ready,
    state:!assessed ? 'OPERATIONS_NOT_ASSESSED' : ready ? 'ELIGIBLE_FOR_HUMAN_REVIEW' : evidenceEligible ? 'OPERATIONAL_HOLD' : 'EVIDENCE_HOLD',
    display:!assessed ? 'OPERATIONS NOT ASSESSED' : ready ? 'ELIGIBLE / HUMAN ONLY' : evidenceEligible ? 'OPERATIONAL HOLD' : 'ELIGIBILITY HOLD',
    basis:evidenceEligible ? 'Genuine completed service + consent + human approval' : 'Not established',
    clearance:!assessed ? 'Operations not assessed' : operationalCleared ? 'Operations clear' : 'Operations hold',
    blockers:Object.freeze(blockers.map(b => b.code)),
    reasons:Object.freeze(reasons),
    nonQualifying:Object.freeze(nonQualifying),
    nonQualifyingLabels:Object.freeze(nonQualifying.map(k => NON_QUALIFYING_LABELS[k])),
    completedService:s.completedService, consent:s.consent, suppressed:s.suppressed, humanApproval:s.humanApproval,
    customerDeliveryAuthorized:false
  });
}

export function deriveWorkbench(raw, asOf) {
  const x = validateFictionalLocation(raw);
  const report = compareAggregateObservations(x.previous, x.current, {asOf, maxAgeHours: 336});
  const tasks = [];
  if (!x.approvals.service) tasks.push({id:'service', severity:'hold', title:'Accept service scope', detail:'Client Operations must approve scope before any real monitoring starts.'});
  if (!x.approvals.operator) tasks.push({id:'operator', severity:'hold', title:'Assign human operator', detail:'A named, authorized operator must own native queue checks.'});
  if (!x.approvals.cadence) tasks.push({id:'cadence', severity:'hold', title:'Approve observation cadence', detail:'A proposed frequency is not a service entitlement or monitoring SLA.'});
  if (!x.approvals.replyApprover && x.replyQueue === 'approval_required') tasks.push({id:'reply', severity:'human', title:'Confirm reply approver', detail:'Any public owner response requires explicit human authorization. No review text is present.'});
  if (report.comparison === 'COUNT_DECREASED_RECONCILE') tasks.push({id:'decline', severity:'hold', title:'Reconcile count decrease', detail:'A net decrease requires a human source check before any business interpretation.'});
  if (report.coverage !== 'CURRENT_AS_OF') tasks.push({id:'coverage', severity:'hold', title:'Restore native observation coverage', detail:'Source is unavailable, stale, held or not authorized. Missing data must never display as zero.'});
  const policyHold = routePolicyHold(x.mgr.route);
  if (policyHold) tasks.push(policyHold);
  if (x.mgr.route === 'not_connected' && x.service.route === 'mgr_optional')
    tasks.push({id:'route_availability', severity:'hold', title:'MGR route not available', detail:'This fictional case selects an optional MGR route, but MGR is not connected. Use a connected, verified MGR route or switch to native-only; no customer action is enabled.'});
  else if (x.mgr.route === 'not_connected')
    tasks.push({id:'route', severity:'verify', title:'Keep MGR disconnected', detail:'Native work can continue after authorization; no second provider is required.'});
  const allApproved = APPROVALS.every(k => x.approvals[k]);
  const blockingTasks = tasks.filter(t => t.severity === 'hold');
  const blocking = blockingTasks.length > 0;
  const serviceEligibility = deriveServiceEligibility(x.service,
    {assessed:true, blockingTasks, mgrRoute:x.mgr.route});
  return Object.freeze({
    id:x.id, name:x.name, kind:x.kind, owner:x.owner, status:blocking?'HOLD':allApproved?'REVIEW READY':'HUMAN REVIEW',
    summary: allApproved && !blocking ? 'Fictional workflow has approval inputs; production is still disabled.' : 'No service activation or customer delivery is authorized by this proof.',
    tasks:Object.freeze(tasks.map(t=>Object.freeze(t))), report, serviceEligibility,
    publicEvidence:report.coverage === 'CURRENT_AS_OF' ? 'Fictional manual native observation' : 'Not current / withheld',
    mgrEvidence:explanation[x.mgr.event], messageEvidence:delivery[x.mgr.delivery],
    mgrRoute:x.mgr.route, replyQueue:x.replyQueue,
    actionsEnabled:false, productionConnected:false, customerDeliveryAuthorized:false, fixture:true
  });
}

/** Compact operator-facing handoff text derived only from an already validated row. */
export function deriveOperatorHandoff(row) {
  guard(plain(row) && typeof row.id === 'string' && plain(row.report) &&
    plain(row.serviceEligibility) && Array.isArray(row.tasks) &&
    row.customerDeliveryAuthorized === false, 'derived workbench row required');
  const r = row.report;
  const s = row.serviceEligibility;
  const next = row.tasks.find(t => t.severity === 'hold') ||
    row.tasks.find(t => t.severity === 'human') ||
    row.tasks.find(t => t.severity === 'verify') || null;
  const withheld = r.reviewCount.current === null;
  const countNote = withheld
    ? 'Withheld means no permitted current value, not zero; no net movement is claimed.'
    : r.reviewCount.netDelta === null
      ? 'Baseline only; no net movement or newly published review is claimed.'
      : 'Net count movement ' + (r.reviewCount.netDelta >= 0 ? '+' : '') + r.reviewCount.netDelta +
        ' is a count change, not newly attributed reviews.';
  const replyTask = row.tasks.find(t => t.id === 'reply');
  const replyAuthority = replyTask
    ? 'Public reply authority: ' + replyTask.title + ' — independent of service eligibility. ' + replyTask.detail
    : 'Public reply authority: no public reply is queued in this fictional case; the handoff grants none.';
  return Object.freeze({
    state: row.status,
    location: row.name + ' · ' + row.kind + ' · ' + row.owner,
    source: r.source,
    observedAt: r.currentObservedAt,
    coverage: r.coverage,
    publicCount: withheld ? 'Withheld' : String(r.reviewCount.current),
    countNote,
    signals: s.nonQualifyingLabels.length
      ? s.nonQualifyingLabels.join(' · ') + ' — observed only; never qualify'
      : 'No scan, intake, sentiment or click recorded; none would qualify',
    mgrNote: row.mgrEvidence + ' A MGR click, first-party update or message is never promoted to a published Google review by this handoff.',
    readiness: 'Service eligibility: ' + (s.evidenceEligible ? 'evidence established' : 'evidence not established') +
      ' (' + s.state + ' / ' + s.display + '). Operational clearance: ' +
      (s.operationalCleared ? 'clear' : 'hold') + ' (' + s.clearance + ').',
    nextTask: next ? next.title : 'No open fictional decision',
    nextReason: next ? next.detail : 'No operational hold, human task or verification is open in this fictional case.',
    replyAuthority,
    delivery: 'No customer delivery, public reply, external send or live action is authorized by this handoff.',
    deliveryAuthorized: false
  });
}

export function derivePortfolio(locations, asOf) {
  guard(Array.isArray(locations) && locations.length > 0, 'fixture list required');
  const ids = new Set();
  const rows = locations.map(x => {
    guard(!ids.has(x.id), 'duplicate location'); ids.add(x.id);
    return deriveWorkbench(x, asOf);
  });
  return Object.freeze({rows:Object.freeze(rows), holds:rows.filter(x=>x.status==='HOLD').length,
    pending:rows.reduce((sum,x)=>sum+x.tasks.length,0), liveProviders:0, customerServicesActive:0, fixture:true});
}
