import { card, icon, delay } from '../svg.js';
import { escapeXml, kFormat } from '../text.js';

/** Current and longest run of days with at least one contribution. */
export function computeStreaks(days) {
  let longest = { len: 0, start: null, end: null };
  let run = { len: 0, start: null, end: null };
  for (const [date, n] of days) {
    if (n > 0) {
      run = run.len ? { ...run, len: run.len + 1, end: date } : { len: 1, start: date, end: date };
      if (run.len > longest.len) longest = { ...run };
    } else {
      run = { len: 0, start: null, end: null };
    }
  }
  // Today without contributions yet does not break the streak.
  let i = days.length - 1;
  if (i >= 0 && days[i][1] === 0) i--;
  let current = { len: 0, start: null, end: null };
  for (; i >= 0 && days[i][1] > 0; i--) {
    current = { len: current.len + 1, start: days[i][0], end: current.end ?? days[i][0] };
  }
  return { current, longest };
}

function fmtDate(iso, lang, withYear) {
  if (!iso) return '';
  const opts = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  if (withYear) opts.year = 'numeric';
  return new Intl.DateTimeFormat(lang, opts).format(new Date(iso + 'T00:00:00Z'));
}

export function streakCard({ contrib }, theme, t, q, lang) {
  const { current, longest } = computeStreaks(contrib.days);
  const thisYear = String(new Date().getUTCFullYear());
  const range = (s, e, ongoing) => {
    if (!s) return '';
    const yr = s.slice(0, 4) !== thisYear || (e && e.slice(0, 4) !== thisYear);
    const a = fmtDate(s, lang, yr);
    const b = ongoing ? t.present : fmtDate(e, lang, yr);
    return a === b ? a : `${a} – ${b}`;
  };
  const first = contrib.days.find(([, n]) => n > 0)?.[0] ?? contrib.days[0]?.[0];
  const v = {
    total: kFormat(contrib.total), totalRange: range(first, contrib.days.at(-1)?.[0], true),
    current: current.len, currentRange: range(current.start, current.end, current.len > 0),
    longest: longest.len, longestRange: range(longest.start, longest.end, false),
  };
  const desc = `${t.current}: ${current.len}`;
  if (theme.style === 'compact') return compact(v, theme, t, desc);
  if (theme.style === 'terminal') return terminal(v, theme, t, q, desc);
  return classic(v, theme, t, desc);
}

function classic(v, theme, t, desc) {
  const width = 495, height = 195, col = width / 3;
  const cx = col * 1.5, cy = 72, r = 40, GAP = 30; // gap at the top of the ring for the flame
  const side = (x, value, label, sub, ms) => `<g class="slide" ${delay(ms)}>
  <text x="${x}" y="88" text-anchor="middle" class="text bold" style="font-size:28px">${escapeXml(value)}</text>
  <text x="${x}" y="122" text-anchor="middle" class="text">${escapeXml(label)}</text>
  <text x="${x}" y="146" text-anchor="middle" class="muted">${escapeXml(sub)}</text>
</g>`;
  const arc = (2 * Math.PI * r - GAP) / (2 * Math.PI * r);
  const body = `
${side(col / 2, v.total, t.totalContrib, v.totalRange, 600)}
<line x1="${col}" y1="35" x2="${col}" y2="160" stroke="#${theme.border}" stroke-opacity=".7"/>
<line x1="${col * 2}" y1="35" x2="${col * 2}" y2="160" stroke="#${theme.border}" stroke-opacity=".7"/>
<g transform="rotate(${(-90 + (GAP / 2 / r) * 180 / Math.PI).toFixed(2)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${theme.ring}" stroke-width="5"
  pathLength="1" class="draw" style="stroke-dasharray:${arc.toFixed(4)} 1"/></g>
<g class="pop" ${delay(900)}><g class="flicker">${icon('flame', cx - 9, cy - r - 11, theme.ring, 18)}</g></g>
<text x="${cx}" y="${cy + 10}" text-anchor="middle" class="text bold pop" style="font-size:28px;animation-delay:500ms">${v.current}</text>
<g class="fade" ${delay(700)}>
  <text x="${cx}" y="${cy + r + 34}" text-anchor="middle" class="text bold" style="fill:#${theme.title}">${escapeXml(t.current)}</text>
  <text x="${cx}" y="${cy + r + 56}" text-anchor="middle" class="muted">${escapeXml(v.currentRange)}</text>
</g>
${side(col * 2.5, String(v.longest), t.longest, v.longestRange, 750)}`;
  return card({ width, height, theme, title: '', body, desc });
}

/** One line: flame and current streak, then best and total. */
function compact(v, theme, t, desc) {
  const width = 495, height = 90;
  const cell = (x, value, label, ms, color = theme.text) => `<g class="slide" ${delay(ms)}>
  <text x="${x}" y="45" class="bold" style="font-size:26px;fill:#${color}">${escapeXml(value)}</text>
  <text x="${x}" y="67" class="muted">${escapeXml(label)}</text></g>`;
  const body = `<g class="pop"><g class="flicker">${icon('flame', 25, 22, theme.ring, 36)}</g></g>
${cell(76, String(v.current), t.current, 200, theme.ring)}
${cell(230, String(v.longest), t.longest, 350)}
${cell(365, v.total, t.totalContrib, 500)}`;
  return card({ width, height, theme, title: '', body, desc });
}

function terminal(v, theme, t, q, desc) {
  const width = 495, top = 64, lh = 22;
  const lines = [
    [t.current, String(v.current), v.currentRange, true],
    [t.longest, String(v.longest), v.longestRange],
    [t.totalContrib, v.total, v.totalRange],
  ];
  const body = lines.map(([label, value, sub, hl], i) => `<text x="25" y="${top + i * lh}" class="text type" style="font-size:13px;animation-delay:${400 + i * 260}ms"><tspan class="accent">›</tspan> <tspan style="fill:#${theme.muted}">${escapeXml(label)}</tspan><tspan x="200" class="bold" ${hl ? `style="fill:#${theme.ring}"` : ''}>${escapeXml(value)}</tspan><tspan x="250" style="fill:#${theme.muted}">${escapeXml(sub)}</tspan></text>`).join('\n');
  return card({ width, height: top + lines.length * lh + 6, theme, title: `streak ${q.get('username')}`, body, desc });
}
