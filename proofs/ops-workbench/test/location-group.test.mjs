import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Static semantic contract only: actual screen-reader announcements require
// a separate supported-browser/assistive-technology acceptance test.
test('fictional location controls belong to a named accessibility group', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const container = html.match(/<div\b[^>]*\bid="locations"[^>]*>/)?.[0];
  assert.ok(container, 'location selector must remain present');
  assert.match(container, /\brole="group"/, 'generic divs cannot carry an accessible name');
  assert.match(container, /\baria-label="Choose fictional location"/);
  assert.match(html, /<div\b[^>]*\bid="locations"[^>]*><\/div>/,
    'location button mounting target must remain empty in static HTML');
});
