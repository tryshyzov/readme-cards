import test from 'node:test';
import assert from 'node:assert/strict';
import { wrap, measure, escapeXml, setMono } from '../src/text.js';
import { resolveTheme, styles } from '../src/theme.js';
import { computeStreaks } from '../src/cards/streak.js';
import { rank, statsCard } from '../src/cards/stats.js';
import { langsCard } from '../src/cards/langs.js';
import { streakCard } from '../src/cards/streak.js';
import { activityCard } from '../src/cards/activity.js';
import { pinCard } from '../src/cards/pin.js';
import { pypiCard } from '../src/cards/pypi.js';
import { locale } from '../src/i18n.js';

const q = (s) => new URLSearchParams(s);

test('Russian description wraps inside the card', () => {
  const text = 'аддон для PulseSync, который автоматически подменяет заблюренные треки, которые есть в удалённом списке, на их незаблюренную версию, если такая вообще найдётся';
  const lines = wrap(text, 13, 350, 3);
  assert.equal(lines.length, 3);
  for (const l of lines) assert.ok(measure(l, 13) <= 350, l);
  assert.ok(lines[2].endsWith('…'));
});

test('long word is broken by letters', () => {
  const lines = wrap('a'.repeat(200), 13, 100, 10);
  for (const l of lines) assert.ok(measure(l, 13) <= 100);
});

test('colours from the URL cannot inject markup', () => {
  const th = resolveTheme(q('title_color="/><script>&bg_color=ff0000"'));
  assert.equal(th.title, resolveTheme(q('')).title);
  assert.equal(escapeXml('<a "b">'), '&lt;a &quot;b&quot;&gt;');
});

test('gradient background is parsed', () => {
  assert.deepEqual(resolveTheme(q('bg_color=90,ff0000,00ff00')).bg, { angle: 90, stops: ['ff0000', '00ff00'] });
});

test('streaks: today without contributions keeps the streak', () => {
  const days = [['2026-01-01', 1], ['2026-01-02', 0], ['2026-01-03', 2], ['2026-01-04', 3], ['2026-01-05', 0]];
  const s = computeStreaks(days);
  assert.equal(s.current.len, 2);
  assert.equal(s.longest.len, 2);
});

test('rank grows with activity', () => {
  const low = rank({ commits: 0, prs: 0, issues: 0, reviews: 0, stars: 0, followers: 0 });
  const high = rank({ commits: 5000, prs: 500, issues: 300, reviews: 100, stars: 20000, followers: 2000 });
  assert.equal(low.level, 'C');
  assert.equal(high.level, 'S');
});

// Every card in every style renders well-formed SVG (no duplicate attributes, balanced tags).
const days = Array.from({ length: 400 }, (_, i) => [new Date(Date.UTC(2025, 9, 1) + i * 864e5).toISOString().slice(0, 10), (i * 7) % 5]);
const owner = { type: 'User', login: 'octo', name: 'Octo Cat', followers: 3, prs: 10, issues: 2, contributedTo: 4, repoCount: 2,
  repos: [{ name: 'a', stars: 3, forks: 1, langs: [{ name: 'Python', color: '#3572A5', size: 900 }, { name: 'C++', color: '#f34b7d', size: 100 }] }] };
const contrib = { commits: 120, reviews: 1, total: 300, days };
const repo = { name: 'repo', full: 'octo/repo', description: 'Экран «Сейчас играет» для старого Android-планшета', stars: 5, forks: 0, lang: { name: 'Python', color: '#3572A5' }, owner: 'octo' };
const pkg = { name: 'pkg', version: '1.0.0', summary: 'Thing', license: 'MIT', python: '>=3.9', released: '2026-01-01T00:00:00Z', downloads: { last_month: 1234 } };
const render = { stats: statsCard, langs: langsCard, streak: streakCard, activity: activityCard, pin: pinCard, pypi: pypiCard };

function wellFormed(svg) {
  for (const tag of svg.match(/<[a-zA-Z][^>]*>/g)) {
    const names = [...tag.matchAll(/\s([a-zA-Z:-]+)=/g)].map((m) => m[1]);
    assert.equal(new Set(names).size, names.length, `duplicate attribute in ${tag}`);
  }
  const stack = [];
  for (const [, slash, name, self] of svg.matchAll(/<(\/?)([a-zA-Z]+)\b[^>]*?(\/?)>/g)) {
    if (self) continue;
    if (slash) assert.equal(stack.pop(), name, `unexpected </${name}>`);
    else stack.push(name);
  }
  assert.equal(stack.length, 0, 'unclosed tags');
}

for (const [card, list] of Object.entries(styles)) {
  for (const style of list) {
    for (const anim of ['', '&disable_animations=true']) {
      test(`${card} / ${style}${anim}`, () => {
        const query = q(`username=octo&style=${style}&theme=nowplaylab&locale=ru${anim}`);
        const theme = resolveTheme(query, card);
        setMono(theme.mono);
        const svg = render[card]({ owner, contrib, repo, pkg }, theme, locale(query), query, 'ru');
        assert.match(svg, /^<svg /);
        wellFormed(svg);
      });
    }
  }
}
