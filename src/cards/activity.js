import { card, delay } from '../svg.js';
import { escapeXml, truncate } from '../text.js';

/** Daily contributions: line chart, bars, a GitHub-like calendar or a terminal sparkline. */
export function activityCard({ owner, contrib }, theme, t, q, lang) {
  const title = q.get('custom_title') || t.activityTitle(owner?.name ?? q.get('username'));
  const args = { contrib, theme, t, q, lang, title, login: owner?.login ?? q.get('username') };
  switch (theme.style) {
    case 'heatmap': return heatmap(args);
    case 'terminal': return terminal(args);
    default: return chart(args, theme.style === 'bars');
  }
}

function chart({ contrib, theme, q, lang, title }, bars) {
  const n = Math.max(7, Math.min(Number(q.get('days')) || 31, 90));
  const days = contrib.days.slice(-n);
  const width = Math.max(500, Math.min(Number(q.get('card_width')) || 850, 1200));
  const height = 300;
  const left = 50, right = width - 25, top = theme.hideTitle ? 25 : 60, bottom = height - 45;
  const max = Math.max(4, ...days.map(([, c]) => c));
  const step = Math.ceil(max / 4);
  const yMax = step * 4;
  const slot = (right - left) / days.length;
  const px = bars ? (i) => left + slot * (i + 0.5) : (i) => left + (i / Math.max(1, days.length - 1)) * (right - left);
  const py = (v) => bottom - (v / yMax) * (bottom - top);

  const grid = [0, 1, 2, 3, 4].map((k) => {
    const v = step * k, y = py(v);
    return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#${theme.muted}" stroke-opacity="${k ? 0.18 : 0.4}"/>
<text x="${left - 10}" y="${y + 4}" text-anchor="end" class="muted">${v}</text>`;
  }).join('\n');

  const fmt = new Intl.DateTimeFormat(lang, { day: 'numeric', timeZone: 'UTC' });
  const fmtMonth = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const every = Math.ceil(days.length / Math.floor((right - left) / 40));
  const xLabels = days.map(([date], i) => {
    if (i % every && i !== days.length - 1) return '';
    const dt = new Date(date + 'T00:00:00Z');
    const label = i === 0 || dt.getUTCDate() === 1 ? fmtMonth.format(dt) : fmt.format(dt);
    return `<text x="${px(i)}" y="${bottom + 22}" text-anchor="middle" class="muted">${escapeXml(label)}</text>`;
  }).join('');

  let plot;
  const defs = `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#${theme.accent}" stop-opacity=".35"/><stop offset="100%" stop-color="#${theme.accent}" stop-opacity="0"/>
</linearGradient>`;
  if (bars) {
    const bw = Math.max(3, slot * 0.62);
    plot = days.map(([date, c], i) => {
      const h = Math.max(c ? 2 : 0, bottom - py(c));
      return `<rect x="${(px(i) - bw / 2).toFixed(1)}" y="${(bottom - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(3, bw / 3).toFixed(1)}" fill="#${theme.accent}" class="rise" ${delay(150 + i * (900 / days.length))}><title>${date}: ${c}</title></rect>`;
    }).join('');
  } else {
    const pts = days.map(([, c], i) => [px(i), py(c)]);
    // Smooth line through the points (Catmull-Rom converted to Bezier), never dipping below zero.
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, Math.min(bottom, p1[1] + (p2[1] - p0[1]) / 6)];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, Math.min(bottom, p2[1] - (p3[1] - p1[1]) / 6)];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    const dots = pts.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#${theme.accent}" class="pop" ${delay(300 + i * (1100 / pts.length))}><title>${days[i][0]}: ${days[i][1]}</title></circle>`).join('');
    plot = `<path d="${d} L${right},${bottom} L${left},${bottom} Z" fill="url(#area)" class="fade" ${delay(900)}/>
<path d="${d}" fill="none" stroke="#${theme.accent}" stroke-width="2.5" stroke-linejoin="round" pathLength="1" class="draw"/>
${dots}`;
  }
  return card({ width, height, theme, title: truncate(title, 18, width - 50, true), body: `${grid}\n${xLabels}\n${plot}`, defs });
}

/** Calendar of squares like on a GitHub profile; it lights up column by column. */
function heatmap({ contrib, theme, q, lang, title }) {
  const weeks = Math.max(8, Math.min(Number(q.get('weeks')) || 52, 53));
  const cell = 11, gap = 3, left = 50, top = theme.hideTitle ? 40 : 72;
  // Align to weeks starting on Sunday, like GitHub.
  const all = contrib.days;
  const last = new Date(all.at(-1)[0] + 'T00:00:00Z');
  const startIdx = Math.max(0, all.length - 1 - last.getUTCDay() - (weeks - 1) * 7);
  const days = all.slice(startIdx);
  const max = Math.max(1, ...days.map(([, c]) => c));
  const level = (c) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)));
  const opacity = [0, 0.3, 0.55, 0.8, 1];
  const width = left + weeks * (cell + gap) + 25;
  const height = top + 7 * (cell + gap) + 40;

  const fmtMonth = new Intl.DateTimeFormat(lang, { month: 'short', timeZone: 'UTC' });
  let months = '', lastMonth = -1;
  const cells = days.map(([date, c], i) => {
    const w = Math.floor(i / 7), d = i % 7;
    const x = left + w * (cell + gap), y = top + d * (cell + gap);
    const dt = new Date(date + 'T00:00:00Z');
    if (d === 0 && dt.getUTCMonth() !== lastMonth && w < weeks - 2) {
      lastMonth = dt.getUTCMonth();
      months += `<text x="${x}" y="${top - 10}" class="muted" style="font-size:10px">${escapeXml(fmtMonth.format(dt))}</text>`;
    }
    const lv = level(c);
    const fill = lv ? `fill="#${theme.accent}" fill-opacity="${opacity[lv]}"` : `fill="#${theme.track}"`;
    return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2.5" ${fill} class="pop" ${delay(100 + w * 22 + d * 6)}><title>${date}: ${c}</title></rect>`;
  }).join('');
  const dayNames = [1, 3, 5].map((d) => {
    const label = new Intl.DateTimeFormat(lang, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2023, 0, 1 + d)));
    return `<text x="${left - 8}" y="${top + d * (cell + gap) + 9}" text-anchor="end" class="muted" style="font-size:10px">${escapeXml(label)}</text>`;
  }).join('');
  const legendY = top + 7 * (cell + gap) + 16;
  const legend = [0, 1, 2, 3, 4].map((lv, i) => {
    const x = width - 25 - (5 - i) * (cell + gap);
    return `<rect x="${x}" y="${legendY}" width="${cell}" height="${cell}" rx="2.5" ${lv ? `fill="#${theme.accent}" fill-opacity="${opacity[lv]}"` : `fill="#${theme.track}"`}/>`;
  }).join('');
  const total = days.reduce((s, [, c]) => s + c, 0);
  const body = `${months}${dayNames}${cells}${legend}
<text x="${left}" y="${legendY + 10}" class="muted fade" ${delay(1200)}>${total}</text>`;
  return card({ width, height, theme, title: truncate(title, 18, width - 50, true), body });
}

/** Sparkline made of block characters. */
function terminal({ contrib, theme, q, login }) {
  const n = Math.max(7, Math.min(Number(q.get('days')) || 31, 60));
  const days = contrib.days.slice(-n);
  const max = Math.max(1, ...days.map(([, c]) => c));
  const ticks = '▁▂▃▄▅▆▇█';
  const spark = days.map(([, c]) => (c ? ticks[Math.min(7, Math.ceil((c / max) * 7))] : ' ')).join('');
  const total = days.reduce((s, [, c]) => s + c, 0);
  const active = days.filter(([, c]) => c > 0).length;
  const width = Math.max(420, 50 + n * 13 * 0.62);
  const body = `<text x="25" y="76" class="type" style="font-size:22px;fill:#${theme.accent};letter-spacing:0;animation-duration:1.2s;animation-delay:400ms">${escapeXml(spark)}</text>
<text x="25" y="108" class="text type" style="font-size:13px;animation-delay:1500ms"><tspan class="accent">›</tspan> <tspan style="fill:#${theme.muted}">${n}d</tspan> ${total} · max ${max}/day · ${active}/${n} active</text>`;
  return card({ width, height: 128, theme, title: `activity ${login}`, body });
}
