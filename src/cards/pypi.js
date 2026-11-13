import { card, icon } from '../svg.js';
import { escapeXml, kFormat, truncate, wrap } from '../text.js';

/** PyPI package: version, monthly downloads, Python and licence. */
export function pypiCard({ pkg }, theme, t, q, lang) {
  const width = 400;
  const summary = wrap(pkg.summary, 13, width - 50, 2);
  const descTop = 62;
  const rowY = descTop + Math.max(summary.length, 1) * 18 + 22;

  const cells = [
    ['tag', t.version, pkg.version],
    pkg.downloads
      ? ['download', t.downloads, kFormat(pkg.downloads.last_month)]
      : ['calendar', t.released, pkg.released ? new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(pkg.released)) : '—'],
  ];
  const extra = [pkg.python && `Python ${pkg.python}`, pkg.license].filter(Boolean).join(' · ');

  let body = (theme.mono ? '' : `<text x="25" y="35" class="title fade">${escapeXml(truncate(pkg.name, 18, width - 50, true))}</text>\n`)
    + summary.map((l, i) => `<text x="25" y="${descTop + i * 18}" class="text ${theme.mono ? 'type' : 'slide'}" style="font-size:13px;animation-delay:${200 + i * 150}ms">${escapeXml(l)}</text>`).join('\n');
  body += cells.map(([ic, label, value], i) => {
    const x = 25 + i * 180;
    return `<g class="pop" style="animation-delay:${450 + i * 150}ms">
  ${icon(ic, x, rowY - 13, theme.icon)}
  <text x="${x + 24}" y="${rowY}" class="text bold" style="font-size:16px">${escapeXml(truncate(value, 16, 140, true))}</text>
  <text x="${x + 24}" y="${rowY + 18}" class="muted">${escapeXml(label)}</text>
</g>`;
  }).join('\n');
  let height = rowY + 36;
  if (extra) {
    body += `\n<text x="25" y="${height + 4}" class="muted">${escapeXml(truncate(extra, 12, width - 50))}</text>`;
    height += 22;
  }
  const title = theme.mono ? truncate(`pip install ${pkg.name}`, 14, width - 120) : '';
  return card({ width, height, theme, title, body, desc: `${pkg.name} ${pkg.version}` });
}
