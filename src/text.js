// Text helpers: escaping, measuring and wrapping by real width (not by letter count).
import fs from 'node:fs';

const metrics = JSON.parse(fs.readFileSync(new URL('./metrics.json', import.meta.url), 'utf8'));
const tables = {
  regular: new Map(Object.entries(metrics.regular).map(([k, v]) => [parseInt(k, 36), v])),
  bold: new Map(Object.entries(metrics.bold).map(([k, v]) => [parseInt(k, 36), v])),
};

// Fonts on the viewer's machine differ a little from the table; keep a margin.
const SAFETY = 1.06;

export function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function charWidth(cp, table) {
  const w = table.get(cp);
  if (w !== undefined) return w;
  if (cp >= 0x300 && cp <= 0x36f) return 0; // combining marks
  if (cp >= 0xfe00 && cp <= 0xfe0f) return 0; // variation selectors
  if (cp === 0x200d) return 0; // zero-width joiner
  if (cp >= 0x1f000) return 1250; // emoji
  if (cp >= 0x2e80 && cp <= 0xffdc) return 1000; // CJK and fullwidth
  return 650;
}

// Cards render synchronously, so the font kind can be a module-level switch.
let mono = false;
/** Terminal style uses a monospace font: every letter is 0.6 em wide. */
export function setMono(on) { mono = Boolean(on); }

/** Width of `text` in pixels at `size` px. */
export function measure(text, size, bold = false) {
  const table = bold ? tables.bold : tables.regular;
  let w = 0;
  for (const ch of String(text)) {
    const cp = ch.codePointAt(0);
    w += mono ? (cp >= 0x2e80 ? 1000 : charWidth(cp, table) === 0 ? 0 : 602) : charWidth(cp, table);
  }
  return (w / 1000) * size * SAFETY;
}

/** Cuts `text` so it fits `maxWidth`, adding an ellipsis when cut. */
export function truncate(text, size, maxWidth, bold = false) {
  text = String(text ?? '');
  if (measure(text, size, bold) <= maxWidth) return text;
  const chars = [...text];
  while (chars.length && measure(chars.join('') + '…', size, bold) > maxWidth) chars.pop();
  return chars.join('').trimEnd() + '…';
}

/**
 * Splits `text` into lines no wider than `maxWidth`.
 * Breaks at spaces; a word longer than the line is broken by letters.
 * Extra lines are dropped and the last kept line gets an ellipsis.
 */
export function wrap(text, size, maxWidth, maxLines = 3, bold = false) {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  const push = () => { if (line) lines.push(line); line = ''; };

  for (let word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate, size, bold) <= maxWidth) { line = candidate; continue; }
    push();
    // Word alone is too wide: break it by letters.
    while (measure(word, size, bold) > maxWidth) {
      const chars = [...word];
      let n = chars.length;
      while (n > 1 && measure(chars.slice(0, n).join(''), size, bold) > maxWidth) n--;
      lines.push(chars.slice(0, n).join(''));
      word = chars.slice(n).join('');
    }
    line = word;
  }
  push();

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = truncate(kept[maxLines - 1] + ' ' + lines[maxLines], size, maxWidth, bold);
    if (!kept[maxLines - 1].endsWith('…')) kept[maxLines - 1] += '…';
    return kept;
  }
  return lines;
}

/** 1234 -> "1.2k", 1234567 -> "1.2M". */
export function kFormat(n) {
  n = Number(n) || 0;
  const abs = Math.abs(n);
  if (abs >= 1e6) return (n / 1e6).toFixed(abs >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(abs >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'k';
  return String(n);
}
