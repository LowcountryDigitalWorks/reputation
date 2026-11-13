/** Read-only, deterministic projection of explicitly fictional evidence. No IO. */
import {compareAggregateObservations} from '../../aggregate-monitor/src/aggregate-monitor.mjs';

const APPROVALS = ['service', 'operator', 'cadence', 'replyApprover'];
const ROUTES = new Set(['unverified', 'rating_conditioned_hold', 'not_connected', 'neutral_verified']);
const EVENTS = new Set(['rating_link_clicked', 'first_party_feedback_updated', 'none']);
const DELIVERY = new Set(['scheduled', 'not_requested', 'delivered']);
const REPLIES = new Set(['approval_required', 'unknown', 'none']);
const KEYS = new Set(['fixture', 'id', 'name', 'kind', 'owner', 'approvals', 'previous', 'current', 'mgr', 'replyQueue']);
const MGR_KEYS = new Set(['route', 'event', 'delivery']);
const SAFE_ID = /^[a-z]+(?:-[a-z]+)*$/;
function guard(condition, reason) {if (!condition) throw new TypeError('WORKBENCH_FIXTURE_HOLD: ' + reason);}
function plain(o) {return o !== null && typeof o === 'object' && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;}
function exactKeys(o, keys) {return Object.keys(o).length === keys.size && [...keys].every(k => Object.hasOwn(o, k));}

export function validateFictionalLocation(x) {
  guard(plain(x) && exactKeys(x, KEYS), 'strict location shape');
  guard(x.fixture === true, 'explicit fictional fixture marker');
  guard(SAFE_ID.test(x.id) && x.id.length <= 40, 'opaque location key');
  guard(x.kind.startsWith('Fictional ') && /fictional/i.test(x.owner), 'fictional subject labeling');
  for (const key of ['name','kind','owner']) guard(typeof x[key] === 'string' && x[key].length > 0 && x[key].length < 90 && !/[<>@]/.test(x[key]), 'fictional presentation text');
  guard(plain(x.approvals) && exactKeys(x.approvals, new Set(APPROVALS)) && APPROVALS.every(k => typeof x.approvals[k] === 'boolean'), 'approval state');
  guard(plain(x.mgr) && exactKeys(x.mgr, MGR_KEYS) && ROUTES.has(x.mgr.route) && EVENTS.has(x.mgr.event) && DELIVERY.has(x.mgr.delivery), 'MGR evidence classification');
  guard(REPLIES.has(x.replyQueue), 'human response state');
  guard(plain(x.current) && x.current.locationKey === x.id, 'native source observation scope');
  guard(x.previous === null || (plain(x.previous) && x.previous.locationKey === x.id), 'previous observation scope');
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
  if (x.mgr.route === 'unverified') tasks.push({id:'route', severity:'verify', title:'Verify all five rating routes', detail:'Inspect the exact authorized project; MGR visibility is not routing proof.'});
  if (x.mgr.route === 'rating_conditioned_hold') tasks.push({id:'route', severity:'hold', title:'Reject sentiment-conditioned routing', detail:'A public Google option cannot depend on a favorable rating.'});
  if (x.mgr.route === 'not_connected') tasks.push({id:'route', severity:'verify', title:'Keep MGR disconnected', detail:'Native work can continue after authorization; no second provider is required.'});
  const allApproved = APPROVALS.every(k => x.approvals[k]);
  const blocking = tasks.some(t => t.severity === 'hold');
  return Object.freeze({
    id:x.id, name:x.name, kind:x.kind, owner:x.owner, status:blocking?'HOLD':allApproved?'REVIEW READY':'HUMAN REVIEW',
    summary: allApproved && !blocking ? 'Fictional workflow has approval inputs; production is still disabled.' : 'No service activation or customer delivery is authorized by this proof.',
    tasks:Object.freeze(tasks.map(t=>Object.freeze(t))), report,
    publicEvidence:report.coverage === 'CURRENT_AS_OF' ? 'Fictional manual native observation' : 'Not current / withheld',
    mgrEvidence:explanation[x.mgr.event], messageEvidence:delivery[x.mgr.delivery],
    mgrRoute:x.mgr.route, replyQueue:x.replyQueue,
    actionsEnabled:false, productionConnected:false, customerDeliveryAuthorized:false, fixture:true
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
