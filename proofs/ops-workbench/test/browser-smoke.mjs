import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

// Isolated real-Chromium DOM regression for the fictional Workbench.
// Not a real screen-reader test, cold-human study, or rendered visual QA.
const root = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const probeName = '/__ldw_workbench_probe__.mjs';
const probe = String.raw`
const finish = (result, message) => {
  const output = document.createElement('output');
  output.id = 'ldw-browser-regression';
  output.dataset.result = result;
  output.textContent = message;
  document.body.append(output);
};
const check = (condition, message) => {if (!condition) throw new Error(message);};
async function waitForApp() {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (document.querySelectorAll('#locations button[data-location-id]').length === 4 &&
        document.getElementById('task-count')?.textContent.includes('items')) return;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw new Error('Workbench module did not initialize');
}
try {
  await waitForApp();
  const location = id => document.querySelector('#locations button[data-location-id="' + id + '"]');
  const text = id => document.getElementById(id).textContent.trim();
  const titles = () => Array.from(document.querySelectorAll('#task-list .task-name'), e => e.textContent);
  const reasons = () => Array.from(document.querySelectorAll('#readiness-list .task-name'), e => e.textContent);
  const filter = id => document.querySelector('[data-filter="' + id + '"]').click();
  const [harbor, cedar, marsh, bayline] =
    ['harbor-pine', 'cedar-quay', 'marshlight', 'bayline'].map(location);
  check([harbor,cedar,marsh,bayline].every(Boolean), 'Four fictional locations missing');
  check(harbor.getAttribute('aria-pressed') === 'true', 'Initial location selection incorrect');
  const handoff = document.getElementById('handoff');
  check(handoff?.tagName === 'DETAILS' && handoff.querySelector('summary'),
    'Operator handoff must be a native disclosure');
  check(getComputedStyle(document.querySelector('.handoff-body')).userSelect !== 'none',
    'Handoff text must remain selectable');
  check(text('handoff-state') === 'HOLD', 'Handoff state must mirror selected location');
  check(text('handoff-count').includes('+2') && text('handoff-count').includes('not newly attributed reviews'),
    'Handoff net-movement boundary missing');
  check(text('handoff-mgr').includes('never promoted to a published Google review'),
    'Handoff MGR click boundary missing');
  check(text('handoff-readiness').includes('Service eligibility') &&
    text('handoff-readiness').includes('Operational clearance: hold') &&
    text('handoff-readiness').includes('No customer delivery'),
    'Handoff eligibility/clearance/no-delivery boundary missing');
  const statusEl = document.getElementById('readiness-count');
  check(statusEl.getAttribute('aria-live') === 'polite' && statusEl.getAttribute('aria-atomic') === 'true',
    'Readiness status must be one polite atomic live region');
  check(document.getElementById('readiness-list').getAttribute('aria-live') === 'off',
    'Reason list must not duplicate readiness announcements');
  filter('hold');
  check(text('task-count') === '3 of 4 items', 'Unverified MGR route absent from Holds');
  check(titles().includes('Verify all five rating routes'), 'Routing task missing from Holds');
  check(text('location-status') === 'HOLD', 'Unverified route incorrectly marked ready');
  check(text('readiness-count') === 'ELIGIBILITY HOLD', 'Scan/intake/sentiment/click case incorrectly eligible');
  check(text('readiness-route') === 'Optional MGR route', 'Optional MGR service route not shown');
  check(text('readiness-signals').includes('Contact-card scan') && text('readiness-signals').includes('never qualify'),
    'Never-qualify contact-card guard missing');
  check(reasons().includes('No genuine completed service'), 'Completed-service hold reason missing');
  check(reasons().includes('Non-qualifying signals present'), 'Non-qualifying signal reason missing');
  cedar.focus(); cedar.click();
  check(document.activeElement === cedar, 'Selection displaced keyboard focus');
  check(cedar.getAttribute('aria-pressed') === 'true', 'Selected button pressed state absent');
  check(text('location-status') === 'HOLD', 'Optional MGR route without MGR connection was not held');
  check(text('readiness-count') === 'OPERATIONAL HOLD', 'Satisfied service flags wrongly cleared an unavailable MGR route');
  check(titles().includes('MGR route not available'), 'Route-availability hold missing from decision list');
  check(reasons().includes('MGR route not available'), 'Route-availability blocker missing from readiness reasons');
  check(text('readiness-basis').includes('Genuine completed service + consent + human approval') &&
    text('readiness-basis').includes('Operations hold'), 'Evidence eligibility not distinguished from operational hold');
  check(text('handoff-reply').includes('Confirm reply approver') &&
    text('handoff-reply').includes('independent of service eligibility'),
    'Handoff public reply authority not independent');
  marsh.click(); filter('verify');
  check(text('task-count') === '1 of 5 items', 'Disconnected native-only Verify count wrong');
  check(titles().includes('Keep MGR disconnected'), 'Native-only state not distinguished');
  check(text('public-count') === 'Withheld', 'Stale aggregate exposed as a value');
  check(text('readiness-route') === 'Native-only', 'Native-only service route not distinguished from MGR');
  check(reasons().includes('Suppression active'), 'Suppression hold reason missing');
  check(text('handoff-count').includes('Withheld means no permitted current value, not zero'),
    'Handoff withheld count boundary missing');
  check(text('handoff-signals').includes('none would qualify'),
    'Handoff no-qualifying-events boundary missing');
  bayline.click();
  check(text('location-status') === 'REVIEW READY', 'Fictional approved case not review-ready');
  check(text('task-count') === '0 items', 'Approved fictional case has unexpected tasks');
  check(text('readiness-count') === 'ELIGIBLE / HUMAN ONLY', 'Genuine completed-service eligibility not shown');
  check(text('readiness-basis').includes('Genuine completed service + consent + human approval'),
    'Qualifying basis not shown');
  check(text('readiness-signals').includes('Click') && text('readiness-signals').includes('never qualify'),
    'Click never-qualify guard missing even in qualified case');
  check(text('handoff-next').includes('No open fictional decision') &&
    text('handoff-reply').includes('no public reply is queued'),
    'Handoff no-open-decision / no-reply-authority boundary lost');
  check(text('boundary-summary').includes('No provider, customer or account can be changed here'),
    'Fictional-only no-action boundary lost');
  check(document.querySelector('.summary-card.accent .summary-value').textContent.trim() === '0',
    'Fictional Workbench falsely shows active services');
  document.getElementById('theme-toggle').click();
  check(document.documentElement.dataset.theme === 'light', 'Theme switch failed');
  check(document.getElementById('theme-toggle').getAttribute('aria-pressed') === 'true',
    'Theme toggle pressed state failed');
  finish('PASS', 'Real Chromium DOM: route HOLD, MGR route-availability hold, native-only Verify, service eligibility/never-qualify, selectable operator handoff with withheld/net-movement/reply boundaries, focus, theme');
} catch (error) {
  finish('FAIL', String(error?.message || error));
}
`;

const mime = {'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === probeName) {
      res.writeHead(200, {'content-type':mime['.mjs'], 'cache-control':'no-store'});
      res.end(probe);
      return;
    }
    const file = resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + sep)) throw new Error('path outside repository');
    let body = await readFile(file);
    if (pathname === '/proofs/ops-workbench/') {
      const html = body.toString('utf8');
      assert.ok(html.includes('</body>'), 'Workbench HTML missing body boundary');
      // A test-only same-origin observer; app, CSP and other source assets unchanged.
      body = Buffer.from(html.replace('</body>',
        '<script type="module" src="' + probeName + '"></script></body>'));
    }
    res.writeHead(200, {'content-type':mime[extname(file)] || 'application/octet-stream',
      'cache-control':'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

const browser = [process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/chromium',
  '/usr/bin/chromium-browser'].find(path => path && existsSync(path));
assert.ok(browser, 'Chrome/Chromium required on runner; do not download packages');
const profile = await mkdtemp(resolve(tmpdir(), 'ldw-rep-chrome-'));
try {
  await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
  const url = 'http://127.0.0.1:' + server.address().port + '/proofs/ops-workbench/';
  const args = ['--headless=new','--no-sandbox','--disable-gpu','--disable-extensions',
    '--disable-background-networking','--no-first-run','--no-default-browser-check',
    '--disable-dev-shm-usage','--user-data-dir=' + profile,
    '--window-size=1280,900','--virtual-time-budget=12000','--dump-dom',url];
  const child = spawn(browser, args, {stdio:['ignore','pipe','pipe']});
  let stdout = '', stderr = '';
  child.stdout.on('data', chunk => {stdout += chunk.toString();});
  child.stderr.on('data', chunk => {stderr += chunk.toString().slice(0,1000);});
  const timeout = setTimeout(() => child.kill('SIGKILL'), 35000);
  const exit = await new Promise((resolveExit, reject) => {
    child.once('error', reject);
    child.once('close', (status, signal) => resolveExit({status, signal}));
  });
  clearTimeout(timeout);
  assert.equal(exit.status, 0, 'Chromium exited abnormally: ' + JSON.stringify(exit) + stderr.slice(-800));
  const match = stdout.match(/<output id="ldw-browser-regression" data-result="(PASS|FAIL)">([^<]*)<\/output>/);
  assert.ok(match, 'Probe incomplete: ' + stderr.slice(-900) + '; DOM tail: ' + stdout.slice(-900));
  assert.equal(match[1], 'PASS', 'Chromium DOM assertions: ' + match[2]);
  console.log('G3a Chromium DOM regression PASS: ' + match[2]);
} finally {
  await new Promise(resolveClose => server.close(resolveClose));
  await rm(profile, {recursive:true, force:true});
}
