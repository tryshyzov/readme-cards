import { card, icon, delay } from '../svg.js';
import { escapeXml, kFormat, truncate, wrap, measure } from '../text.js';

/** Repository card: name, description wrapped by real text width, language, stars, forks. */
export function pinCard({ repo }, theme, t, q) {
  const width = Math.max(300, Math.min(Number(q.get('card_width')) || 400, 600));
  const maxLines = Math.max(1, Math.min(Number(q.get('description_lines_count')) || 3, 6));
  const showOwner = q.get('show_owner') === 'true';
  const inner = width - 50;

  const name = showOwner ? repo.full : repo.name;
  const lines = repo.description ? wrap(repo.description, 13, inner, maxLines) : [];
  const badge = repo.archived ? t.archived : repo.template ? t.template : '';

  const descTop = 65;
  const lineH = 18;
  // With description_lines_count set, the card keeps that height, so pins side by side line up.
  const reserved = q.has('description_lines_count') ? maxLines : Math.max(lines.length, 1);
  const footY = descTop + reserved * lineH + 14;
  const height = footY + 22;

  const badgeW = badge ? measure(badge, 11) + 16 : 0;
  const titleMax = inner - 25 - (badge ? badgeW + 10 : 0);
  const titleText = truncate(name, 18, titleMax, true);

  let body = theme.mono ? '' : `${icon('repo', 25, 21, theme.icon)}
<text x="50" y="35" class="title fade">${escapeXml(titleText)}</text>`;
  if (badge && !theme.mono) {
    const bx = 50 + measure(titleText, 18, true) + 10;
    body += `<rect x="${bx}" y="21" width="${badgeW}" height="19" rx="9.5" fill="none" stroke="#${theme.muted}"/>
<text x="${bx + badgeW / 2}" y="34.5" text-anchor="middle" class="muted" style="font-size:11px">${escapeXml(badge)}</text>`;
  }
  body += lines.map((l, i) => `<text x="25" y="${descTop + i * lineH}" class="text ${theme.mono ? 'type' : 'slide'}" style="font-size:13px;animation-delay:${200 + i * 150}ms">${escapeXml(l)}</text>`).join('\n');

  let x = 25;
  const foot = [];
  if (repo.lang) {
    const c = (repo.lang.color || '#' + theme.muted).replace(/[^#0-9a-f]/gi, '');
    foot.push(`<circle cx="${x + 6}" cy="${footY - 4}" r="6" fill="${c}"/>
<text x="${x + 18}" y="${footY}" class="text" style="font-size:13px">${escapeXml(repo.lang.name)}</text>`);
    x += 18 + measure(repo.lang.name, 13) + 22;
  }
  const stat = (ic, n) => {
    const s = `${icon(ic, x, footY - 13, theme.icon)}<text x="${x + 22}" y="${footY}" class="text" style="font-size:13px">${kFormat(n)}</text>`;
    x += 22 + measure(kFormat(n), 13) + 22;
    return s;
  };
  foot.push(stat('star', repo.stars));
  if (repo.forks > 0 || q.get('show_forks') === 'true') foot.push(stat('fork', repo.forks));

  body += `\n<g class="fade" ${delay(300 + lines.length * 150)}>${foot.join('\n')}</g>`;
  const termTitle = truncate(`cat ${name}`, 14, inner - 70);
  return card({ width, height, theme, title: theme.mono ? termTitle : '', body, desc: `${repo.full}: ${repo.description}` });
}
