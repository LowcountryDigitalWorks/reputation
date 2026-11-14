import {FICTIONAL_LOCATIONS, FIXTURE_CLOCK} from './fixtures.mjs';
import {derivePortfolio} from './workbench.mjs';

const portfolio = derivePortfolio(FICTIONAL_LOCATIONS, FIXTURE_CLOCK);
let selected = portfolio.rows[0].id;
let filter = 'all';
const root = document.documentElement;
const $ = id=>document.getElementById(id);
const set = (id, value)=>{$(id).textContent=String(value);};
const elem=(tag,className,text)=>{const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=text;return x;};
const fmtUtc = t => t ? new Date(t).toLocaleString('en-US',{timeZone:'UTC',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC' : 'Withheld';
const statusClass=s=>s==='HOLD'?'hold':s==='REVIEW READY'?'ready':'human';

function renderLocations(){
 const mount=$('locations');
 // Keep controls mounted so keyboard focus and mobile rail position survive selection.
 if(!mount.children.length){
  for(const row of portfolio.rows){
   const b=elem('button','location-option');b.type='button';b.dataset.locationId=row.id;
   const mark=elem('span','location-mark',row.name.slice(0,2).toUpperCase());mark.setAttribute('aria-hidden','true');
   const text=elem('span','location-name');text.append(elem('strong','',row.name),elem('small','',row.kind));
   b.append(mark,text);b.addEventListener('click',()=>{selected=row.id;filter='all';syncFilter();render();});mount.append(b);
  }
 }
 for(const b of mount.children){
  const active=b.dataset.locationId===selected;
  b.classList.toggle('active',active);
  b.setAttribute('aria-pressed',String(active));
 }
}
function renderTasks(row){
 const mount=$('task-list');mount.replaceChildren();
 const shown=row.tasks.filter(x=>filter==='all'||x.severity===filter);
 if(!shown.length){mount.append(elem('p','empty-state','No matching decisions in this fictional scenario. This is not a production readiness approval.'));return;}
 for(const t of shown){
  const details=elem('details','task');const summary=elem('summary','task-heading');
  summary.append(elem('span','task-indicator '+t.severity,t.severity==='hold'?'!':t.severity==='human'?'◉':'?'));
  const title=elem('span','task-name',t.title);summary.append(title,elem('span','task-arrow','⌄'));
  details.append(summary,elem('p','task-description',t.detail));mount.append(details);
 }
}
function evidenceRow(icon,title,value,description,tone){
 const item=elem('article','source-row'); const sym=elem('span','source-icon '+tone,icon);sym.setAttribute('aria-hidden','true');
 const t=elem('div','source-text');t.append(elem('strong','',title),elem('p','',description));item.append(sym,t,elem('span','source-value',value));return item;
}
function renderEvidence(row){
 const r=row.report;const mount=$('evidence-list');mount.replaceChildren();
 mount.append(evidenceRow('◈','Native Google observation',r.coverage==='CURRENT_AS_OF'?'SAMPLE ONLY':r.coverage,`${row.publicEvidence} · ${fmtUtc(r.currentObservedAt)}`,'purple'));
 mount.append(evidenceRow('≋','MGR first-party signal','NOT PUBLIC',row.mgrEvidence,'gold'));
 mount.append(evidenceRow('✉','Delivery lifecycle','NOT EVIDENCE',row.messageEvidence,'blue'));
 mount.append(evidenceRow('☑','Public reply authority',row.replyQueue==='approval_required'?'HUMAN HOLD':'UNVERIFIED','No reply text, recipient data, or publishing capability in this prototype.','grey'));
}
function render(){
 const row=portfolio.rows.find(x=>x.id===selected);
 set('location-title',row.name);set('location-kind',row.kind+' · '+row.owner);
 $('location-status').textContent=row.status;$('location-status').className='status-pill '+statusClass(row.status);
 set('task-count',row.tasks.length+' items');set('public-count',row.report.reviewCount.current===null?'Withheld':row.report.reviewCount.current);
 set('count-sub',row.report.reviewCount.netDelta===null?'Comparison held / baseline only':'Net count movement: '+(row.report.reviewCount.netDelta>=0?'+':'')+row.report.reviewCount.netDelta+' (not newly attributed reviews)');
 set('rating',row.report.rating.current===null?'Withheld':row.report.rating.current.toFixed(2)+' / 5');
 set('rating-sub',row.report.coverage==='CURRENT_AS_OF'?'Fictional displayed average':'Coverage hold: '+row.report.coverage);
 set('mgr-status',row.mgrRoute==='rating_conditioned_hold'?'Route policy hold':row.mgrRoute==='unverified'?'Routing unverified':row.mgrRoute==='not_connected'?'Not connected':'Synthetic route pass');
 set('boundary-summary',row.summary+' Everything shown is fictional. No provider, customer or account can be changed here.');
 renderTasks(row);renderEvidence(row);renderLocations();
}
function syncFilter(){for(const b of document.querySelectorAll('[data-filter]')){let active=b.dataset.filter===filter;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));}}
set('fixture-clock','FIXTURE • '+fmtUtc(FIXTURE_CLOCK));set('workspaces-count',portfolio.rows.length);set('hold-count',portfolio.holds);set('decision-count',portfolio.pending);
for(const b of document.querySelectorAll('[data-filter]'))b.addEventListener('click',()=>{filter=b.dataset.filter;syncFilter();render();});
$('theme-toggle').addEventListener('click',()=>{const light=root.dataset.theme==='dark';root.dataset.theme=light?'light':'dark';$('theme-toggle').replaceChildren(elem('span','',light?'☾':'☀'),document.createTextNode(light?' Dark mode':' Light mode'));$('theme-toggle').setAttribute('aria-pressed',String(light));$('theme-toggle').setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');});
render();
