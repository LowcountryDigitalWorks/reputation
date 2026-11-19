/**
 * G3a fictional participant-only offline export. No bundler dependency, no network,
 * no credentials, no local storage, no telemetry, no customer/provider connections.
 *
 * Usage (from repository root):
 *   node proofs/ops-workbench/tools/export-blind-study.mjs --dir /tmp/ldw-blind-study
 *
 * The output contains exactly study-workbench.html and OPERATOR_STUDY.md.
 * Never include the facilitator README or distribute the entire repo to a participant.
 * The export is a study instrument, NOT a deployed or customer-authorized app.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const workbench = new URL('../', import.meta.url);
const input = {
  html: new URL('../index.html', import.meta.url),
  css: new URL('../styles.css', import.meta.url),
  aggregate: new URL('../../aggregate-monitor/src/aggregate-monitor.mjs', import.meta.url),
  model: new URL('../src/workbench.mjs', import.meta.url),
  fixtures: new URL('../src/fixtures.mjs', import.meta.url),
  app: new URL('../src/app.mjs', import.meta.url),
  handout: new URL('../OPERATOR_STUDY.md', import.meta.url)
};

function once(source, oldText, replacement, label) {
  assert.equal(source.split(oldText).length - 1, 1,
    'Unexpected ' + label + ' source shape. Fail closed; inspect exports/imports before updating.');
  return source.replace(oldText, replacement);
}
function noModules(code, label) {
  assert.doesNotMatch(code, /^\s*(?:import|export)\s/m,
    'Unhandled ES module import/export in ' + label);
  assert.doesNotMatch(code, /<\/script\b/i, 'Script close tag in ' + label);
  return code;
}
const hash = source => createHash('sha256').update(source, 'utf8').digest('base64');

export async function buildBlindStudy() {
  const files = Object.fromEntries(await Promise.all(
    Object.entries(input).map(async ([key, url]) => [key, await readFile(url, 'utf8')])
  ));
  let model = once(files.model,
    "import {compareAggregateObservations} from '../../aggregate-monitor/src/aggregate-monitor.mjs';",
    '', 'model import');
  let app = once(files.app,
    "import {FICTIONAL_LOCATIONS, FIXTURE_CLOCK} from './fixtures.mjs';",
    '', 'app fixture import');
  app = once(app, "import {derivePortfolio} from './workbench.mjs';",
    '', 'app model import');
  const stripExports = s => s.replace(/^export (const|function) /gm, '$1 ');
  const js = [
    '/* G3a fictional-only offline participant copy; generated from accepted repository sources. */',
    noModules(stripExports(files.aggregate), 'aggregate'),
    noModules(stripExports(model), 'model'),
    noModules(stripExports(files.fixtures), 'fixtures'),
    noModules(stripExports(app), 'app')
  ].join('\n\n');

  assert.doesNotMatch(files.css, /@import\b|url\s*\(|<\/style\b/i,
    'CSS cannot reference outside resources or terminate the inline style');
  assert.doesNotMatch(files.html, /https?:\/\/|<iframe\b|<form\b/i,
    'Workbench HTML must not embed external destinations or forms');
  assert.doesNotMatch(js, /\bfetch\s*\(|\b(?:localStorage|sessionStorage|indexedDB|XMLHttpRequest|WebSocket)\b/,
    'Workbench must not connect or persist data');
  assert.ok(files.handout.includes('four invented businesses'));
  assert.ok(files.handout.includes('Do not give them the Workbench README'));
  const jsPolicy = "'sha256-" + hash(js) + "'";
  const cssPolicy = "'sha256-" + hash(files.css) + "'";
  let html = once(files.html, "script-src 'self'; style-src 'self';",
    'script-src ' + jsPolicy + '; style-src ' + cssPolicy + ';',
    'Content-Security-Policy');
  html = once(html, '<link rel="stylesheet" href="./styles.css">',
    '<style>' + files.css + '</style>', 'stylesheet link');
  html = once(html, '<script type="module" src="./src/app.mjs"></script>',
    '<script type="module">' + js + '</script>', 'application module');
  assert.doesNotMatch(html, /<script\b[^>]+src=|<link\b[^>]+rel="stylesheet"/i,
    'Offline copy must have no external script/style dependency');
  assert.doesNotMatch(html, /facilitator answer key|Required distinguishing finding/i,
    'Do not expose the facilitator answer key to blind participants');
  assert.ok(html.includes("connect-src 'none';"));
  assert.ok(html.includes("form-action 'none'"));
  return {html, handout:files.handout, sourceFiles:Object.keys(input)};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  assert.equal(args.length, 2, 'Supply exactly: --dir <output-directory>');
  assert.equal(args[0], '--dir');
  const target = resolve(args[1]);
  const rel = relative(repoRoot, target);
  assert.ok(rel && rel !== '.' && rel !== '..' && !rel.startsWith('..' + sep),
    'Output directory must be outside the source repository');
  const {html, handout} = await buildBlindStudy();
  await mkdir(target, {recursive:true});
  await Promise.all([
    writeFile(resolve(target, 'study-workbench.html'), html, {flag:'wx'}),
    writeFile(resolve(target, 'OPERATOR_STUDY.md'), handout, {flag:'wx'})
  ]);
  console.log('G3a blind participant kit: exactly two files, fictional only, no network.');
  console.log('Offline Workbench SHA-256: ' + createHash('sha256').update(html).digest('hex'));
}
