// Shared helpers for the decorative effects (waves, typing text, badges, decor).
import { themes } from '../theme.js';

const HEX = /^(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function hex(value, fallback) {
  const v = String(value ?? '').trim().replace(/^#/, '');
  return HEX.test(v) ? v : fallback;
}

export function num(q, name, def, min, max) {
  const n = Number(q.get(name));
  return q.get(name) !== null && q.get(name) !== '' && Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : def;
}

export const flag = (q, name, def = false) => {
  const v = q.get(name);
  if (v === null) return def;
  return v === '' || v === 'true' || v === '1';
};

/** Colours of the chosen theme, for effects that have no own colour set. */
export function palette(q) {
  const th = themes[q.get('theme')] ?? themes.tryshyzov;
  const stops = th.gradient ?? (String(th.bg).includes(',') ? String(th.bg).split(',').slice(1) : [th.bg, th.border, th.accent]);
  return { ...th, stops, solidBg: String(th.bg).includes(',') ? String(th.bg).split(',')[1] : th.bg };
}

/**
 * Gradient stops: "233871,5F3189,E75395" (even spacing) or "0:233871,55:5F3189,100:E75395".
 * Returns [{ offset: 0..100, color }] or null.
 */
export function stops(value) {
  if (!value) return null;
  const parts = String(value).split(',').map((s) => s.trim()).filter(Boolean);
  if (!parts.length || parts.length > 8) return null;
  const out = parts.map((p, i) => {
    const [a, b] = p.includes(':') ? p.split(':') : [null, p];
    const color = hex(b, null);
    const offset = a === null ? (parts.length === 1 ? 0 : (i / (parts.length - 1)) * 100) : Number(a);
    return color && Number.isFinite(offset) ? { offset: Math.max(0, Math.min(100, offset)), color } : null;
  });
  return out.every(Boolean) ? out : null;
}

export function gradientDef(id, list, vertical = false) {
  const s = list.length === 1 ? [list[0], { ...list[0], offset: 100 }] : list;
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${s
    .map((x) => `<stop offset="${x.offset}%" stop-color="#${x.color}"/>`).join('')}</linearGradient>`;
}

export const FONTS = {
  sans: "'Segoe UI', Ubuntu, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'SF Mono', ui-monospace, Menlo, Consolas, 'JetBrains Mono', 'Liberation Mono', monospace",
  serif: "Georgia, 'Times New Roman', serif",
};

export function svgDoc(width, height, inner, title = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"${title ? ` aria-label="${title}"` : ''}>
${inner}
</svg>`;
}

/** Small deterministic random generator, so the same URL always gives the same picture. */
export function rng(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.codePointAt(0)) >>> 0;
  s = s || 1;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Four-pointed star like ✦, centred at (cx, cy). */
export function starPath(cx, cy, r) {
  const k = r * 0.28;
  return `M${cx} ${cy - r}C${cx + k * 0.4} ${cy - k} ${cx + k} ${cy - k * 0.4} ${cx + r} ${cy}C${cx + k} ${cy + k * 0.4} ${cx + k * 0.4} ${cy + k} ${cx} ${cy + r}C${cx - k * 0.4} ${cy + k} ${cx - k} ${cy + k * 0.4} ${cx - r} ${cy}C${cx - k} ${cy - k * 0.4} ${cx - k * 0.4} ${cy - k} ${cx} ${cy - r}Z`;
}

export const REDUCED = '@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }';
