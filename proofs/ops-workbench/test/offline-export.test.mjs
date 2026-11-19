import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildBlindStudy} from '../tools/export-blind-study.mjs';

const sha256 = text => createHash('sha256').update(text, 'utf8').digest('base64');

test('blind participant export contains only original fictional Workbench and blind handout', async () => {
  const {html, handout, sourceFiles} = await buildBlindStudy();
  assert.deepEqual(sourceFiles.sort(), [
    'aggregate', 'app', 'css', 'fixtures', 'handout', 'html', 'model'
  ]);
  assert.match(html, /FICTIONAL DATA \/ SOURCE-ONLY PROOF/);
  assert.match(html, /Fictional workspaces/);
  assert.match(html, /Choose fictional location/);
  assert.match(html, /Harbor Pine Printworks/);
  assert.doesNotMatch(html, /facilitator answer key|Required distinguishing finding/i);
  assert.match(handout, /never worked on this proof/);
  assert.doesNotMatch(handout, /required distinguishing finding/i);
  assert.match(handout, /four invented businesses/);
  assert.doesNotMatch(html, /<script\b[^>]*src=|<link\b[^>]*rel="stylesheet"/i);
  assert.doesNotMatch(html, /https?:\/\/|@import|url\s*\(|\bfetch\s*\(/i);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);

  const js = html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  assert.ok(js && css);
  assert.ok(html.includes("script-src 'sha256-" + sha256(js) + "'"),
    'Serialized CSP must include exact inline script hash');
  assert.ok(html.includes("style-src 'sha256-" + sha256(css) + "'"),
    'Serialized CSP must include exact inline stylesheet hash');
  assert.doesNotMatch(js, /^\s*(import|export)\s/m);
  assert.match(js, /compareAggregateObservations/);
  assert.match(js, /derivePortfolio/);
  assert.match(js, /renderLocations/);
});
test('same accepted source produces identical offline export bytes', async () => {
  const a = await buildBlindStudy();
  const b = await buildBlindStudy();
  assert.equal(a.html, b.html);
  assert.equal(a.handout, b.handout);
});
