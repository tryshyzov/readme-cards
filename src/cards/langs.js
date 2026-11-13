import { card, delay } from '../svg.js';
import { escapeXml, truncate, measure } from '../text.js';

/** Most used languages over the owner's public, non-fork repositories. */
export function langsCard({ owner }, theme, t, q) {
  const hide = new Set((q.get('hide') ?? '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean));
  const count = Math.max(1, Math.min(Number(q.get('langs_count')) || 6, 12));

  const sizes = new Map();
  for (const r of owner.repos) {
    for (const l of r.langs) {
      if (hide.has(l.name.toLowerCase())) continue;
      const cur = sizes.get(l.name) ?? { name: l.name, color: l.color, size: 0 };
      cur.size += l.size;
      sizes.set(l.name, cur);
    }
  }
  const langs = [...sizes.values()].sort((a, b) => b.size - a.size).slice(0, count);
  const total = langs.reduce((s, l) => s + l.size, 0) || 1;
  for (const l of langs) {
    l.pct = (l.size / total) * 100;
    l.fill = /^#[0-9a-f]{3,8}$/i.test(l.color ?? '') ? l.color : '#' + theme.muted;
  }

  const title = truncate(q.get('custom_title') || t.langsTitle, 18, 300, true);
  if (!langs.length) {
    const top = theme.hideTitle ? 25 : 55;
    return card({ width: 350, height: top + 40, theme, title, body: `<text x="25" y="${top + 15}" class="text">${escapeXml(t.noLangs)}</text>` });
  }
  const args = { langs, theme, t, title, owner };
  switch (theme.style) {
    case 'compact': return compact(args);
    case 'donut': return donut(args);
    case 'terminal': return terminal(args);
    default: return classic(args);
  }
}

/** A labelled bar per language; bars grow in one after another. */
function classic({ langs, theme, title }) {
  const width = 350, top = theme.hideTitle ? 25 : 55;
  const body = langs.map((l, i) => {
    const y = top + i * 40;
    const w = Math.max(2, (l.pct / 100) * (width - 50));
    return `<g class="fade" ${delay(100 + i * 100)}>
  <text x="25" y="${y + 12}" class="text" style="font-size:12px">${escapeXml(truncate(l.name, 12, 220))}</text>
  <text x="${width - 25}" y="${y + 12}" text-anchor="end" class="muted">${l.pct.toFixed(1)}%</text>
  <rect x="25" y="${y + 20}" width="${width - 50}" height="8" rx="4" fill="#${theme.track}"/>
</g>
<rect x="25" y="${y + 20}" width="${w.toFixed(2)}" height="8" rx="4" fill="${l.fill}" class="grow" ${delay(250 + i * 100)}/>`;
  }).join('\n');
  return card({ width, height: top + langs.length * 40 + 8, theme, title, body });
}

/** One stacked bar, legend in two columns below. */
function compact({ langs, theme, title }) {
  const width = 350, top = theme.hideTitle ? 25 : 55, barW = width - 50;
  let x = 25;
  const segs = langs.map((l) => {
    const w = (l.pct / 100) * barW;
    const s = `<rect x="${x.toFixed(2)}" y="${top}" width="${w.toFixed(2)}" height="8" fill="${l.fill}"/>`;
    x += w;
    return s;
  }).join('');
  const legend = langs.map((l, i) => {
    const lx = 25 + (i % 2) * 155, ly = top + 32 + Math.floor(i / 2) * 24;
    return `<g class="slide" ${delay(300 + i * 80)}><circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${l.fill}"/>
  <text x="${lx + 16}" y="${ly}" class="text" style="font-size:12px">${escapeXml(truncate(`${l.name} ${l.pct.toFixed(1)}%`, 12, 130))}</text></g>`;
  }).join('\n');
  const height = top + 32 + Math.ceil(langs.length / 2) * 24 + 4;
  const body = `<clipPath id="bar"><rect x="25" y="${top}" width="${barW}" height="8" rx="4"/></clipPath>
<g clip-path="url(#bar)"><g class="grow">${segs}</g></g>
${legend}`;
  return card({ width, height, theme, title, body });
}

/** Ring split into languages, legend on the right. */
function donut({ langs, theme, title }) {
  const width = 350, top = theme.hideTitle ? 20 : 50;
  const r = 52, sw = 18;
  const cx = 25 + r + sw / 2, cy = top + r + sw / 2 + 4;
  const legendH = langs.length * 22;
  const height = Math.max(cy + r + sw / 2 + 20, top + legendH + 24);
  const gapFrac = langs.length > 1 ? 0.006 : 0;
  let start = 0;
  const arcs = langs.map((l, i) => {
    const frac = l.pct / 100;
    const len = Math.max(0.001, frac - gapFrac);
    const s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${l.fill}" stroke-width="${sw}" pathLength="1"
  style="stroke-dasharray:${len.toFixed(4)} 1;stroke-dashoffset:${(-start).toFixed(4)};animation-delay:${150 + i * 120}ms" class="fade"/>`;
    start += frac;
    return s;
  }).join('\n');
  const top1 = langs[0];
  const legendX = cx + r + sw / 2 + 28;
  const legend = langs.map((l, i) => {
    const y = top + 18 + i * 22;
    return `<g class="slide" ${delay(250 + i * 90)}><rect x="${legendX}" y="${y - 9}" width="10" height="10" rx="3" fill="${l.fill}"/>
  <text x="${legendX + 18}" y="${y}" class="text" style="font-size:12px">${escapeXml(truncate(l.name, 12, width - legendX - 70))}</text>
  <text x="${width - 25}" y="${y}" text-anchor="end" class="muted">${l.pct.toFixed(1)}%</text></g>`;
  }).join('\n');
  const center = `<text x="${cx}" y="${cy + 2}" text-anchor="middle" class="text bold pop" style="font-size:16px;animation-delay:700ms">${top1.pct.toFixed(0)}%</text>
<text x="${cx}" y="${cy + 18}" text-anchor="middle" class="muted fade" style="font-size:10px;animation-delay:800ms">${escapeXml(truncate(top1.name, 10, r * 1.4))}</text>`;
  return card({ width, height, theme, title, body: `<g transform="rotate(-90 ${cx} ${cy})">${arcs}</g>\n${center}\n${legend}` });
}

/** Text bars made of blocks, typed in line by line. */
function terminal({ langs, theme, owner }) {
  const width = 350, top = 62, lh = 22, blocks = 12;
  const nameW = Math.max(...langs.map((l) => measure(l.name, 13))) + 16;
  const cardW = Math.max(width, 25 + nameW + blocks * 8 + 70);
  const body = langs.map((l, i) => {
    const filled = Math.max(1, Math.round((l.pct / 100) * blocks));
    return `<text x="25" y="${top + i * lh}" class="text type" style="font-size:13px;animation-delay:${400 + i * 220}ms">${escapeXml(l.name)}<tspan x="${25 + nameW}" style="fill:${l.fill}">${'█'.repeat(filled)}</tspan><tspan style="fill:#${theme.track}">${'░'.repeat(blocks - filled)}</tspan><tspan x="${cardW - 25}" text-anchor="end" style="fill:#${theme.muted}">${l.pct.toFixed(1)}%</tspan></text>`;
  }).join('\n');
  return card({ width: cardW, height: top + langs.length * lh + 4, theme, title: `linguist ${owner.login}`, body });
}
