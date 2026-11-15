import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

function themeTokens(selector) {
  const start = css.indexOf(selector + '{');
  assert.notEqual(start, -1, 'Expected theme selector ' + selector);
  const end = css.indexOf('}', start);
  assert.ok(end > start, 'Expected closed theme token block');
  return Object.fromEntries(
    css.slice(start + selector.length + 1, end)
      .split(';').map(part => part.trim()).filter(part => part.startsWith('--'))
      .map(part => {
        const colon = part.indexOf(':');
        return [part.slice(0, colon), part.slice(colon + 1).trim()];
      })
  );
}

function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const channels = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255);
  const linear = channels.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear.reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const dark = themeTokens(':root');
const light = {...dark, ...themeTokens(':root[data-theme=light]')};

test('secondary text meets 4.5:1 in both themes on page and inset backgrounds', () => {
  for (const [theme, palette] of [['dark', dark], ['light', light]]) {
    for (const background of ['--bg', '--input']) {
      const ratio = contrast(palette['--subtle'], palette[background]);
      assert.ok(ratio >= 4.5, theme + ' --subtle/' + background + ' contrast is ' + ratio.toFixed(3) + ':1 (minimum 4.5:1)');
    }
  }
});

test('active location labels and mark retain readable contrast in both themes', () => {
  assert.match(css, /\.location-option\.active \.location-name small\{color:var\(--muted\)\}/);
  for (const [theme, palette] of [['dark', dark], ['light', light]]) {
    const label = contrast(palette['--muted'], palette['--purple-bg']);
    const mark = contrast(palette['--bg'], palette['--purple']);
    const border = contrast(palette['--purple'], palette['--rail']);
    assert.ok(label >= 4.5, theme + ' active secondary label contrast ' + label.toFixed(3) + ':1');
    assert.ok(mark >= 4.5, theme + ' active marker text contrast ' + mark.toFixed(3) + ':1');
    assert.ok(border >= 3, theme + ' selected location border contrast ' + border.toFixed(3) + ':1');
  }
});
