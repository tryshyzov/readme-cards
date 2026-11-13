// Decor: twinkling stars, dividers, pulsing dots, sparkle banners.
import { escapeXml } from '../text.js';
import { hex, num, flag, palette, stops, gradientDef, FONTS, svgDoc, rng, starPath, REDUCED } from './common.js';

export const DECOR_TYPES = ['stars', 'line', 'dots', 'sparkles'];

export function decorSvg(q) {
  const type = DECOR_TYPES.includes(q.get('type')) ? q.get('type') : 'stars';
  const pal = palette(q);
  const colors = (stops(q.get('color')) ?? stops([pal.title, pal.accent, pal.muted].join(','))).map((s) => s.color);
  const W = num(q, 'width', 854, 60, 1200);
  const rand = rng(q.get('seed') ?? 'tryshyzov');
  const speed = num(q, 'speed', 1, 0.25, 4); // 1 = normal, 2 = twice as fast
  let H, body = '', defs = '', css = '';

  if (type === 'stars') {
    H = num(q, 'height', 48, 16, 300);
    const count = num(q, 'count', 9, 1, 40);
    for (let i = 0; i < count; i++) {
      const x = W * ((i + 0.5) / count) + (rand() - 0.5) * (W / count) * 0.5;
      const y = H / 2 + (rand() - 0.5) * H * 0.4;
      const r = (0.18 + rand() * 0.22) * H;
      const c = colors[i % colors.length];
      body += `<path class="s" style="animation-delay:${(rand() * 2.4 / speed).toFixed(2)}s" fill="#${c}" d="${starPath(x, y, r)}"/>`;
    }
    css = `.s { transform-box: fill-box; transform-origin: center; animation: tw ${(2.4 / speed).toFixed(2)}s ease-in-out infinite alternate; } @keyframes tw { from { opacity: .25; transform: scale(.7) rotate(0deg); } to { opacity: 1; transform: scale(1) rotate(15deg); } }`;
  } else if (type === 'line') {
    H = num(q, 'height', 24, 6, 120);
    const thick = num(q, 'thickness', 2, 1, 12);
    defs = gradientDef('g', stops(colors.join(',')));
    const star = flag(q, 'star', true);
    const mid = W / 2, gap = star ? H * 0.9 : 0;
    body = `<rect x="0" y="${(H - thick) / 2}" width="${mid - gap}" height="${thick}" rx="${thick / 2}" fill="url(#g)"/>
<rect x="${mid + gap}" y="${(H - thick) / 2}" width="${mid - gap}" height="${thick}" rx="${thick / 2}" fill="url(#g)"/>
<circle class="run" cx="0" cy="${H / 2}" r="${thick * 2}" fill="#${colors.at(-1)}"/>`;
    if (star) body += `<path class="s" fill="#${colors.at(-1)}" d="${starPath(mid, H / 2, H * 0.42)}"/>`;
    css = `.run { filter: drop-shadow(0 0 4px #${colors.at(-1)}); animation: run ${(4 / speed).toFixed(2)}s linear infinite; } @keyframes run { from { transform: translateX(0); opacity: 0; } 10%, 90% { opacity: 1; } to { transform: translateX(${W}px); opacity: 0; } }
.s { transform-box: fill-box; transform-origin: center; animation: spin ${(6 / speed).toFixed(2)}s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
  } else if (type === 'dots') {
    H = num(q, 'height', 32, 10, 120);
    const count = num(q, 'count', 7, 2, 30);
    const r = Math.min(H * 0.22, (W / count) * 0.25);
    const step = Math.min(W / count, r * 5);
    const x0 = (W - step * (count - 1)) / 2;
    for (let i = 0; i < count; i++) {
      body += `<circle class="d" style="animation-delay:${((i * 0.12) / speed).toFixed(2)}s" cx="${x0 + i * step}" cy="${H / 2}" r="${r}" fill="#${colors[i % colors.length]}"/>`;
    }
    css = `.d { transform-box: fill-box; transform-origin: center; animation: pulse ${(1.4 / speed).toFixed(2)}s ease-in-out infinite; } @keyframes pulse { 0%, 100% { transform: scale(.55); opacity: .4; } 50% { transform: scale(1); opacity: 1; } }`;
  } else {
    H = num(q, 'height', 160, 40, 500);
    const bg = stops(q.get('bg_color')) ?? stops(pal.stops.join(','));
    defs = gradientDef('bg', bg);
    const count = num(q, 'count', 60, 5, 200);
    body = `<rect width="${W}" height="${H}" rx="${num(q, 'radius', 16, 0, 40)}" fill="url(#bg)"/>`;
    for (let i = 0; i < count; i++) {
      const x = rand() * W, y = rand() * H, r = 0.8 + rand() * (rand() > 0.85 ? 5 : 1.8);
      const c = colors[Math.floor(rand() * colors.length)];
      const shape = r > 3 ? `<path d="${starPath(x, y, r * 1.6)}"` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"`;
      body += `${shape} class="p" fill="#${c}" style="animation-delay:${(rand() * 3 / speed).toFixed(2)}s;animation-duration:${((1.6 + rand() * 2.4) / speed).toFixed(2)}s"/>`;
    }
    const text = (q.get('text') ?? '').slice(0, 80);
    if (text) {
      const fc = hex(q.get('font_color'), pal.text);
      body += `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" style="font: 700 ${num(q, 'font_size', 40, 10, 120)}px ${FONTS[q.get('font')] ?? FONTS.sans}; fill: #${fc}">${escapeXml(text)}</text>`;
    }
    css = `.p { animation: tw 2s ease-in-out infinite alternate; } @keyframes tw { from { opacity: .1; } to { opacity: 1; } }`;
  }

  return svgDoc(W, H, `<defs>${defs}</defs><style>${css} ${REDUCED}</style>\n${body}`, type);
}
