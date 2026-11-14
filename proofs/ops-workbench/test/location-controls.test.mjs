import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal document double: exercises the real app module's DOM lifecycle,
// not visual rendering, browser focus behavior, or assistive technology.
class FakeElement {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.dataset = {};
    this.attributes = new Map();
    this.handlers = new Map();
    this.className = '';
    this.textContent = '';
    this.scrollLeft = 0;
    this.classList = {
      toggle: (name, enabled) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        if (enabled) classes.add(name);
        else classes.delete(name);
        this.className = [...classes].join(' ');
      }
    };
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  addEventListener(name, callback) { this.handlers.set(name, callback); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  click() {
    const callback = this.handlers.get('click');
    assert.equal(typeof callback, 'function', 'control must remain operable');
    callback();
  }
}

test('location controls preserve node identity and selection state on rerender', async () => {
  const elements = new Map();
  const filters = ['all', 'hold', 'human'].map(value => {
    const button = new FakeElement('button');
    button.dataset.filter = value;
    return button;
  });
  const fakeDocument = {
    documentElement: {dataset: {theme: 'dark'}},
    createElement: tag => new FakeElement(tag),
    createTextNode: text => ({textContent: text}),
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement('div'));
      return elements.get(id);
    },
    querySelectorAll(selector) {
      assert.equal(selector, '[data-filter]');
      return filters;
    }
  };

  const previousDocument = globalThis.document;
  globalThis.document = fakeDocument;
  try {
    await import('../src/app.mjs?g3a-focus-regression');
    const locationRail = fakeDocument.getElementById('locations');
    assert.equal(locationRail.children.length, 4, 'four fictional locations are mounted');
    const [first, second] = locationRail.children;
    assert.equal(first.getAttribute('aria-pressed'), 'true');
    assert.equal(second.getAttribute('aria-pressed'), 'false');

    // Simulate a focused native button being activated by keyboard or pointer.
    // The same live node must remain mounted after selection and after filtering.
    fakeDocument.activeElement = second;
    locationRail.scrollLeft = 120;
    second.click();
    assert.strictEqual(locationRail.children[1], second, 'focused control must not be replaced');
    assert.strictEqual(fakeDocument.activeElement, second);
    assert.equal(locationRail.scrollLeft, 120, 'mobile location rail is not reset');
    assert.equal(first.getAttribute('aria-pressed'), 'false');
    assert.equal(second.getAttribute('aria-pressed'), 'true');
    assert.ok(second.className.split(/\s+/).includes('active'));
    assert.equal(fakeDocument.getElementById('location-title').textContent, 'Cedar Quay Bicycle Shop');

    filters[2].click();
    assert.strictEqual(locationRail.children[1], second, 'filter rerender preserves location control');
    assert.equal(second.getAttribute('aria-pressed'), 'true');
    assert.equal(locationRail.children.length, 4);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
