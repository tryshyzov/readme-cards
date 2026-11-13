import { card, icon, delay } from '../svg.js';
import { escapeXml, kFormat, truncate, measure } from '../text.js';

/**
 * A letter grade from the numbers, S best, C lowest.
 * Each number is squashed into 0..1 (half-way at a typical value), then weighted.
 */
export function rank({ commits, prs, issues, reviews, stars, followers }) {
  const exp = (x) => 1 - 2 ** -x;
  const log = (x) => x / (1 + x);
  const parts = [
    [2, exp(commits / 250)], [3, exp(prs / 50)], [1, exp(issues / 25)],
    [1, exp(reviews / 2)], [4, log(stars / 50)], [1, log(followers / 10)],
  ];
  const score = parts.reduce((s, [w, v]) => s + w * v, 0) / parts.reduce((s, [w]) => s + w, 0);
  const top = (1 - score) * 100; // "top N percent"
  const levels = [[1, 'S'], [12.5, 'A+'], [25, 'A'], [37.5, 'A-'], [50, 'B+'], [62.5, 'B'], [75, 'B-'], [87.5, 'C+'], [101, 'C']];
  return { level: levels.find(([p]) => top <= p)[1], score };
}

function collect(owner, contrib, t) {
  const stars = owner.repos.reduce((s, r) => s + r.stars, 0);
  const forks = owner.repos.reduce((s, r) => s + r.forks, 0);
  if (owner.type !== 'User') {
    return { rows: [['stars', 'star', t.stars, stars], ['forks', 'fork', t.forks, forks], ['repos', 'repo', t.repos, owner.repoCount]] };
  }
  const commits = contrib?.commits ?? 0;
  return {
    rows: [
      ['stars', 'star', t.stars, stars],
      ['commits', 'commit', t.commits, commits],
      ['prs', 'pr', t.prs, owner.prs],
      ['issues', 'issue', t.issues, owner.issues],
      ['contribs', 'repo', t.contributed, owner.contributedTo],
    ],
    rank: rank({ commits, prs: owner.prs, issues: owner.issues, reviews: contrib?.reviews ?? 0, stars, followers: owner.followers }),
    total: contrib?.total ?? 0,
  };
}

/** Account stats in one of four looks: classic, grid, minimal, terminal. */
export function statsCard({ owner, contrib }, theme, t, q) {
  const hide = new Set((q.get('hide') ?? '').split(',').map((s) => s.trim()));
  const data = collect(owner, contrib, t);
  const rows = data.rows.filter((r) => !hide.has(r[0]));
  const ringMode = q.get('ring') === 'contributions' ? 'contributions' : 'rank';
  const showRing = Boolean(data.rank) && !hide.has('ring') && !hide.has('rank');
  const ringValue = ringMode === 'rank' ? data.rank?.level : kFormat(data.total);
  const ringLabel = ringMode === 'rank' ? t.rank : t.contributions;
  const title = q.get('custom_title') || t.statsTitle(owner.name);
  const args = { owner, rows, theme, t, title, showRing, ringValue, ringLabel, data, ringMode };
  switch (theme.style) {
    case 'grid': return grid(args);
    case 'minimal': return minimal(args);
    case 'terminal': return terminal(args);
    default: return classic(args);
  }
}

function ring(cx, cy, r, theme, value, label, fraction, delayMs = 300) {
  const size = measure(value, 26, true) > r * 1.5 ? 18 : 26;
  return `<g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${theme.track}" stroke-width="6"/>
  <g transform="rotate(-90 ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${theme.ring}" stroke-width="6" stroke-linecap="round"
    pathLength="1" class="draw" style="stroke-dasharray:${fraction.toFixed(3)} 1;animation-delay:${delayMs}ms"/></g>
  <text x="${cx}" y="${cy + size / 3}" text-anchor="middle" class="text bold pop" style="font-size:${size}px;animation-delay:${delayMs + 500}ms">${escapeXml(value)}</text>
  ${label ? `<text x="${cx}" y="${cy + r + 22}" text-anchor="middle" class="muted fade" ${delay(delayMs + 600)}>${escapeXml(label)}</text>` : ''}
</g>`;
}

// For the rank ring, how full it is shows the score.
const ringFraction = (a) => (a.ringMode === 'rank' ? Math.max(0.05, a.data.rank.score) : 1);

function classic(a) {
  const { rows, theme, showRing } = a;
  const width = 495;
  const top = theme.hideTitle ? 30 : 62;
  const height = Math.max(top + rows.length * 25 + 18, showRing ? top + 130 : 0);
  const labelMax = showRing ? 200 : 300;
  const valueX = showRing ? 270 : 370;
  const body = rows.map(([, ic, label, value], i) => {
    const y = top + i * 25;
    return `<g class="slide" ${delay(150 + i * 110)}>
  ${icon(ic, 25, y - 12, theme.icon)}
  <text x="50" y="${y}" class="text">${escapeXml(truncate(label, 14, labelMax))}:</text>
  <text x="${valueX}" y="${y}" class="text bold">${kFormat(value)}</text>
</g>`;
  }).join('\n');
  const r = showRing ? ring(405, top + 45, 42, theme, a.ringValue, a.ringLabel, ringFraction(a)) : '';
  return card({ width, height, theme, title: truncate(a.title, 18, width - 50, true), body: body + r });
}

function grid(a) {
  const { rows, theme } = a;
  const items = rows.map(([, ic, label, value]) => [ic, label, kFormat(value)]);
  if (a.showRing) items.push(['star', a.ringLabel, a.ringValue, true]);
  const width = 495, gap = 12, cols = 3;
  const top = theme.hideTitle ? 20 : 52;
  const tileW = (width - 50 - gap * (cols - 1)) / cols, tileH = 72;
  const rowsN = Math.ceil(items.length / cols);
  const height = top + rowsN * (tileH + gap) - gap + 22;
  const body = items.map(([ic, label, value, highlight], i) => {
    const x = 25 + (i % cols) * (tileW + gap), y = top + Math.floor(i / cols) * (tileH + gap);
    const fill = highlight ? theme.ring : theme.text;
    return `<g class="pop" ${delay(120 + i * 90)}>
  <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${Math.min(10, theme.radius)}" fill="#${theme.track}" fill-opacity=".75"/>
  ${highlight ? '' : icon(ic, x + 12, y + 12, theme.icon, 14)}
  <text x="${x + 12}" y="${y + 52}" class="text bold" style="font-size:24px;fill:#${fill}">${escapeXml(value)}</text>
  <text x="${x + (highlight ? 12 : 32)}" y="${y + 23}" class="muted">${escapeXml(truncate(label, 12, tileW - (highlight ? 24 : 44)))}</text>
</g>`;
  }).join('\n');
  return card({ width, height, theme, title: truncate(a.title, 18, width - 50, true), body });
}

function minimal(a) {
  const { rows, theme } = a;
  const items = rows.map(([key, , label, value]) => [a.t.short[key] ?? label, kFormat(value)]);
  if (a.showRing) items.unshift([a.ringLabel, a.ringValue, true]);
  const width = 495, height = 96;
  const colW = (width - 30) / items.length;
  const body = items.map(([label, value, highlight], i) => {
    const cx = 15 + colW * (i + 0.5);
    return `<g class="slide" ${delay(100 + i * 100)}>
  <text x="${cx}" y="48" text-anchor="middle" class="bold" style="font-size:26px;fill:#${highlight ? theme.ring : theme.title}">${escapeXml(value)}</text>
  <text x="${cx}" y="72" text-anchor="middle" class="muted">${escapeXml(truncate(label, 12, colW - 8))}</text>
</g>${i ? `<line x1="${15 + colW * i}" y1="30" x2="${15 + colW * i}" y2="76" stroke="#${theme.muted}" stroke-opacity=".25"/>` : ''}`;
  }).join('\n');
  return card({ width, height, theme, title: '', body, desc: a.title });
}

function terminal(a) {
  const { rows, theme, owner } = a;
  const width = 495;
  const lines = rows.map(([, , label, value]) => [label, kFormat(value)]);
  if (a.showRing) lines.push([a.ringLabel, a.ringValue, true]);
  const top = 64, lh = 22;
  const keyW = Math.max(...lines.map(([l]) => measure(`› ${l}`, 13))) + 20;
  const body = lines.map(([label, value, highlight], i) => {
    const y = top + i * lh;
    let bar = '';
    if (highlight && a.ringMode === 'rank') {
      const filled = Math.round(a.data.rank.score * 10);
      bar = `<tspan dx="12" style="fill:#${theme.ring}">${'■'.repeat(filled)}</tspan><tspan style="fill:#${theme.track}">${'■'.repeat(10 - filled)}</tspan>`;
    }
    return `<text x="25" y="${y}" class="text type" style="font-size:13px;animation-delay:${400 + i * 260}ms"><tspan class="accent">›</tspan> <tspan style="fill:#${theme.muted}">${escapeXml(label)}</tspan><tspan x="${25 + keyW}" class="bold" ${highlight ? `style="fill:#${theme.ring}"` : ''}>${escapeXml(value)}</tspan>${bar}</text>`;
  }).join('\n');
  const height = top + lines.length * lh + 6;
  return card({ width, height, theme, title: `gh stats ${owner.login}`, body, desc: a.title });
}
