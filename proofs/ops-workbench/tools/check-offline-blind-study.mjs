/**
 * Browser-boot acceptance for the generated, double-clickable G3a fictional
 * participant copy. This is not a real screen-reader or human comprehension test.
 * Runner: installed Chrome/Chromium only; no downloads or provider network.
 */
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

assert.equal(process.argv.length, 3, 'Usage: node check-offline-blind-study.mjs /abs/path/study-workbench.html');
const path = resolve(process.argv[2]);
const html = await readFile(path, 'utf8');
assert.match(html, /connect-src 'none'/);
assert.match(html, /script-src 'sha256-/);
assert.match(html, /style-src 'sha256-/);
assert.doesNotMatch(html, /<script\b[^>]*src=|<link\b[^>]*rel="stylesheet"/i);
const chrome = [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/usr/bin/chromium-browser'].find(x => x && existsSync(x));
assert.ok(chrome, 'GitHub-hosted runner must already have Chrome/Chromium');
const profile = await mkdtemp(resolve(tmpdir(), 'ldw-study-offline-'));
// Test-only inline computed-style observer with its own CSP hash. The participant
// HTML is not modified; the probe copy lives only in the disposable test profile.
const styleProbe = String.raw`
window.addEventListener('DOMContentLoaded', () => {
  const shell = document.querySelector('.shell');
  const tiles = document.querySelector('.summary-grid');
  const okay = shell && tiles &&
    getComputedStyle(shell).display === 'grid' &&
    getComputedStyle(tiles).display === 'grid' &&
    getComputedStyle(document.body).marginTop === '0px';
  const output = document.createElement('output');
  output.id = 'ldw-offline-style-probe';
  output.textContent = okay ? 'CSS_LAYOUT_APPLIED' : 'CSS_LAYOUT_MISSING';
  document.body.append(output);
});
`;
const policy = html.match(/script-src 'sha256-[^']+';/)?.[0];
assert.ok(policy, 'Expected exactly one hashed inline script policy');
assert.equal(html.split('</body>').length, 2, 'Expected one HTML body close tag');
const probeHash = createHash('sha256').update(styleProbe, 'utf8').digest('base64');
const probePolicy = policy.replace(';', " 'sha256-" + probeHash + "';");
const probeHtml = html.replace(policy, probePolicy)
  .replace('</body>', '<script>' + styleProbe + '</script></body>');
const probePath = resolve(profile, 'test-only-offline-probe.html');
await writeFile(probePath, probeHtml, {flag:'wx'});
let child;
let timeout;
try {
  const args = ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
    '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
    '--disable-dev-shm-usage', '--user-data-dir=' + profile,
    '--window-size=1280,900', '--virtual-time-budget=12000', '--dump-dom',
    pathToFileURL(probePath).href];
  child = spawn(chrome, args, {stdio:['ignore','pipe','pipe']});
  let stdout = '', stderr = '';
  child.stdout.on('data', b => {stdout += b.toString();});
  child.stderr.on('data', b => {stderr = (stderr + b.toString()).slice(-2000);});
  timeout = setTimeout(() => child.kill('SIGKILL'), 35000);
  const exit = await new Promise((done, reject) => {
    child.once('error', reject);
    child.once('close', (status, signal) => done({status, signal}));
  });
  assert.equal(exit.status, 0, 'Chromium offline run failed: ' + JSON.stringify(exit) + stderr.slice(-500));
  for (const id of ['harbor-pine','cedar-quay','marshlight','bayline']) {
    assert.ok(stdout.includes('data-location-id="' + id + '"'),
      'Offline Workbench did not dynamically render fictional location ' + id);
  }
  assert.match(stdout, /id="task-count">[0-9]+ items<\/span>/,
    'Offline source did not derive a populated decision count');
  assert.match(stdout, /id="public-count">[0-9]+<\/strong>/,
    'Offline fixture did not render an actual synthetic public count');
  assert.match(stdout, /No provider, customer or account can be changed here/,
    'Fictional-only authority boundary missing');
  assert.match(stdout, /<output id="ldw-offline-style-probe">CSS_LAYOUT_APPLIED<\/output>/,
    'Offline Workbench CSS was not applied to the real Chromium layout');
  console.log('G3a OFFLINE participant Workbench Chromium PASS — file:// fixture UI and CSS layout initialized under hashed CSP');
} finally {
  if (timeout) clearTimeout(timeout);
  if (child?.exitCode === null) child.kill('SIGKILL');
  await rm(profile, {recursive:true, force:true});
}
