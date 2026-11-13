// Typing text: lines are typed letter by letter (and erased, or stacked one under another).
// Each line is revealed by a clip rectangle whose width steps from letter to letter (SMIL, works inside <img>).
import { escapeXml, measure, setMono } from '../text.js';
import { hex, num, flag, palette, FONTS, svgDoc } from './common.js';

export function typingSvg(q) {
  const pal = palette(q);
  const lines = (q.get('lines') ?? 'Hello, world!').split(';').map((s) => s.trim()).filter(Boolean).slice(0, 10)
    .map((s) => s.slice(0, 120));
  const fontKey = FONTS[q.get('font')] ? q.get('font') : 'mono';
  const size = num(q, 'size', 22, 8, 80);
  const color = hex(q.get('color'), pal.title);
  const bg = hex(q.get('background'), null);
  const multiline = flag(q, 'multiline');
  const center = flag(q, 'center');
  const repeat = flag(q, 'repeat', true);
  const cursor = flag(q, 'cursor', true);
  const perChar = num(q, 'speed', 70, 15, 400) / 1000; // seconds per letter
  const pause = num(q, 'pause', 1200, 0, 10000) / 1000;
  const weight = flag(q, 'bold') ? 700 : 400;
  const lineH = Math.round(size * 1.5);
  const pad = Math.round(size * 0.6);

  setMono(fontKey === 'mono');
  const widths = lines.map((l) => [...l].map((_, i) => measure([...l].slice(0, i + 1).join(''), size, weight === 700)));
  setMono(false);
  const longest = Math.max(...widths.map((w) => w.at(-1) ?? 0));
  const width = num(q, 'width', Math.ceil(longest + pad * 2 + size * 0.6), 40, 1200);
  const height = num(q, 'height', multiline ? lineH * lines.length + pad : lineH + pad, 16, 800);
  const x0 = center ? null : pad;

  const font = `style="font: ${weight} ${size}px ${FONTS[fontKey]}; fill: #${color}"`;
  const cursorW = Math.max(2, size * 0.08);
  let body = '';

  if (multiline) {
    // Lines type one after another and stay.
    let t = 0.3;
    lines.forEach((line, i) => {
      const w = widths[i];
      const lw = w.at(-1) ?? 0;
      const x = center ? (width - lw) / 2 : x0;
      const y = pad / 2 + lineH * i + lineH / 2;
      const dur = Math.max(0.01, w.length * perChar);
      const values = [0, ...w].map((v) => v.toFixed(1)).join(';');
      const id = `c${i}`;
      body += `<clipPath id="${id}"><rect x="${x}" y="${y - lineH / 2}" height="${lineH}" width="0"><animate attributeName="width" begin="${t.toFixed(2)}s" dur="${dur.toFixed(2)}s" values="${values}" calcMode="discrete" fill="freeze"/></rect></clipPath>
<text x="${x}" y="${y}" dominant-baseline="middle" clip-path="url(#${id})" ${font}>${escapeXml(line)}</text>`;
      if (cursor) {
        const last = i === lines.length - 1;
        body += `<rect y="${y - size * 0.6}" width="${cursorW}" height="${size * 1.2}" fill="#${color}" opacity="0" x="${x}">
  <animate attributeName="x" begin="${t.toFixed(2)}s" dur="${dur.toFixed(2)}s" values="${[0, ...w].map((v) => (x + v + 2).toFixed(1)).join(';')}" calcMode="discrete" fill="freeze"/>
  <animate attributeName="opacity" begin="${t.toFixed(2)}s" dur="${last ? 1 : dur + pause / 2}s" values="${last ? '1;0' : '1'}" calcMode="discrete" ${last ? 'repeatCount="indefinite"' : 'fill="remove"'}/>
</rect>`;
      }
      t += dur + pause / 2;
    });
  } else {
    // One line at a time: type, wait, erase, next line; the whole cycle repeats.
    const parts = widths.map((w) => {
      const type = w.length * perChar;
      return { type, hold: pause, erase: w.length * perChar * 0.4, gap: 0.3 };
    });
    const total = parts.reduce((s, p) => s + p.type + p.hold + p.erase + p.gap, 0);
    let start = 0;
    const y = height / 2;
    lines.forEach((line, i) => {
      const w = widths[i];
      const p = parts[i];
      const lw = w.at(-1) ?? 0;
      const x = center ? (width - lw) / 2 : x0;
      const kt = [0], vals = [0];
      const push = (time, v) => { kt.push(Math.min(1, time / total)); vals.push(v); };
      if (start > 0) push(start, 0);
      w.forEach((v, k) => push(start + (k + 1) * (p.type / w.length), v));
      const eraseAt = start + p.type + p.hold;
      if (repeat || i < lines.length - 1) {
        [...w].reverse().slice(1).forEach((v, k) => push(eraseAt + (k + 1) * (p.erase / w.length), v));
        push(eraseAt + p.erase, 0);
      }
      // keyTimes must be strictly increasing for discrete steps; nudge equal times apart.
      for (let k = 1; k < kt.length; k++) if (kt[k] <= kt[k - 1]) kt[k] = Math.min(1, kt[k - 1] + 1e-4);
      if (kt.at(-1) < 1) { kt.push(1); vals.push(vals.at(-1)); }
      const anim = (attr, map) => `<animate attributeName="${attr}" dur="${total.toFixed(2)}s" ${repeat ? 'repeatCount="indefinite"' : 'fill="freeze"'} calcMode="discrete" keyTimes="${kt.map((k) => k.toFixed(4)).join(';')}" values="${vals.map(map).join(';')}"/>`;
      body += `<clipPath id="c${i}"><rect x="${x}" y="0" height="${height}" width="0">${anim('width', (v) => v.toFixed(1))}</rect></clipPath>
<text x="${x}" y="${y}" dominant-baseline="middle" clip-path="url(#c${i})" ${font}>${escapeXml(line)}</text>`;
      if (cursor) {
        body += `<rect y="${y - size * 0.6}" width="${cursorW}" height="${size * 1.2}" fill="#${color}" x="${x}" opacity="0">${anim('x', (v) => (x + v + 2).toFixed(1))}${anim('opacity', (v, k) => (kt[k] >= start / total - 1e-6 && kt[k] <= (eraseAt + p.erase) / total + 1e-6 ? 1 : 0))}</rect>`;
      }
      start += p.type + p.hold + p.erase + p.gap;
    });
  }

  const bgRect = bg ? `<rect width="${width}" height="${height}" rx="${num(q, 'radius', 0, 0, 40)}" fill="#${bg}"/>` : '';
  return svgDoc(width, height, bgRect + body, escapeXml(lines.join(' / ')));
}
