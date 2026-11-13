// Badges: label and message, optional logo, three shapes, optional shine sweep.
import { escapeXml, measure } from '../text.js';
import { hex, num, flag, palette, FONTS, svgDoc, REDUCED } from './common.js';
import { cache } from '../data.js';

export const BADGE_STYLES = ['flat', 'pill', 'for-the-badge'];
const SLUG = /^[a-z0-9]{1,60}$/;

/** Logo from Simple Icons (CC0), fetched once and kept in the cache for a month. */
async function logoPath(slug) {
  if (!slug || !SLUG.test(slug)) return null;
  try {
    return await cache.get(`logo:${slug}`, 30 * 24 * 3600_000, async () => {
      const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${slug}.svg`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return '';
      const svg = await res.text();
      return (svg.match(/<path d="([^"]+)"/) ?? [])[1] ?? '';
    }) || null;
  } catch {
    return null;
  }
}

/** Black or white text, whichever reads better on the background. */
function contrastText(bgHex) {
  const h = bgHex.length <= 4 ? [...bgHex.slice(0, 3)].map((c) => c + c).join('') : bgHex.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? '141414' : 'ffffff';
}

export async function badgeSvg(q) {
  const pal = palette(q);
  const style = BADGE_STYLES.includes(q.get('style')) ? q.get('style') : 'flat';
  const big = style === 'for-the-badge';
  let label = (q.get('label') ?? '').slice(0, 40);
  let message = (q.get('message') ?? 'badge').slice(0, 60);
  if (big) { label = label.toUpperCase(); message = message.toUpperCase(); }
  const color = hex(q.get('color'), pal.accent);
  const labelColor = hex(q.get('label_color'), pal.solidBg);
  const textColor = hex(q.get('text_color'), contrastText(color));
  const labelText = hex(q.get('label_text_color'), contrastText(labelColor));
  const logoColor = hex(q.get('logo_color'), label ? labelText : textColor);
  const shine = flag(q, 'shine');
  const logo = await logoPath((q.get('logo') ?? '').toLowerCase());

  const h = big ? 28 : 22;
  const size = big ? 11 : 12;
  const spacing = big ? 1.2 : 0;
  const padX = big ? 12 : 8;
  const logoSize = big ? 14 : 13;
  const textW = (s) => measure(s, size, big) + spacing * [...s].length;
  const logoW = logo ? logoSize + 5 : 0;
  const leftW = label ? padX * 2 + logoW + textW(label) : 0;
  const rightW = padX * 2 + (label ? 0 : logoW) + textW(message);
  const width = Math.ceil(leftW + rightW);
  const r = style === 'pill' ? h / 2 : big ? 4 : 4;
  const font = `font: ${big ? 700 : 500} ${size}px ${FONTS.sans}; letter-spacing: ${spacing}px`;

  const logoSvg = (x) => (logo ? `<g transform="translate(${x} ${(h - logoSize) / 2}) scale(${logoSize / 24})"><path fill="#${logoColor}" d="${logo}"/></g>` : '');
  const parts = [];
  if (label) {
    parts.push(`<rect width="${leftW}" height="${h}" fill="#${labelColor}"/>`);
    parts.push(logoSvg(padX));
    parts.push(`<text x="${padX + logoW}" y="${h / 2}" dominant-baseline="central" style="${font}; fill: #${labelText}">${escapeXml(label)}</text>`);
  }
  parts.push(`<rect x="${leftW}" width="${rightW}" height="${h}" fill="#${color}"/>`);
  if (!label) parts.push(logoSvg(leftW + padX));
  parts.push(`<text x="${leftW + padX + (label ? 0 : logoW)}" y="${h / 2}" dominant-baseline="central" style="${font}; fill: #${textColor}">${escapeXml(message)}</text>`);
  if (shine) {
    parts.push(`<rect class="shine" x="-60" width="40" height="${h}" fill="url(#sh)" transform="skewX(-20)"/>`);
  }
  const css = shine ? `.shine { animation: sweep 3.2s ease-in-out infinite; } @keyframes sweep { 0% { transform: skewX(-20deg) translateX(0); } 60%, 100% { transform: skewX(-20deg) translateX(${width + 120}px); } } ${REDUCED}` : '';
  const inner = `<defs><clipPath id="r"><rect width="${width}" height="${h}" rx="${r}"/></clipPath>
<linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<style>${css}</style>
<g clip-path="url(#r)">${parts.join('\n')}</g>`;
  return svgDoc(width, h, inner, escapeXml(label ? `${label}: ${message}` : message));
}
