import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Static regression only. Rendered zoom/focus and real assistive technology
// require separately recorded browser/human evidence.
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('selected fictional location has a distinct nontext state in both themes', () => {
  assert.match(css, /\.location-option\.active\{border-color:var\(--purple\);background:var\(--purple-bg\)\}/);
  assert.match(css, /\.location-option\.active \.location-mark\{background:var\(--purple\);color:var\(--bg\)\}/);
});

test('location buttons reflow without nested horizontal rails at 400% desktop zoom widths', () => {
  const narrow = css.match(/@media\(max-width:730px\)\{([\s\S]*?)\n@media\(max-width:480px\)/)?.[1];
  assert.ok(narrow, 'expected responsive 730px and 480px boundaries');
  assert.match(narrow, /\.locations\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\);overflow:visible;gap:7px;padding:7px\}/);
  assert.match(narrow, /\.location-option\{width:100%;min-width:0;padding:7px\}/);
  assert.doesNotMatch(narrow, /overflow-x:auto/, 'do not restore a clipped horizontal location rail');
  assert.match(css, /@media\(max-width:480px\)\{\.locations\{grid-template-columns:minmax\(0,1fr\)\}\}/);
});

test('action labels remain usable at small widths and Verify is independently filterable', () => {
  assert.match(css, /\.filter-button\{min-height:40px/);
  assert.match(css, /\.theme-button\{min-height:40px/);
  assert.match(css, /\.source-value\{font-size:10px/);
  assert.doesNotMatch(css, /\.source-value\{font-size:8px/);
  assert.match(html, /<button class="filter-button" data-filter="verify" aria-pressed="false">Verify<\/button>/);
});

test('operator handoff is a native disclosure with selectable wrapped text', () => {
  assert.match(html, /<details class="panel handoff-panel" id="handoff">/);
  assert.match(html, /<summary class="handoff-summary">/);
  assert.match(html, /id="handoff-next"/);
  assert.match(css, /\.handoff-body\{[^}]*user-select:text/);
  assert.match(css, /\.handoff-grid dd\{[^}]*overflow-wrap:anywhere/);
  assert.match(css, /\.handoff-grid\{[^}]*repeat\(auto-fit,minmax\(230px,1fr\)\)/);
});
