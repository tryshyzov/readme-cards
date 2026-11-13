// Header and footer banners: waves, rectangles, slices; optional moving wave and animated text.
import { escapeXml } from '../text.js';
import { hex, num, flag, palette, stops, gradientDef, FONTS, svgDoc, REDUCED } from './common.js';

export const WAVE_TYPES = ['waving', 'wave', 'rect', 'rounded', 'slice'];
export const TEXT_ANIMATIONS = ['none', 'fade', 'rise', 'glow', 'twinkle'];
const W = 854;

/** Points of a sine wave from left to right. */
function wavePoints(base, amp, freq, phase, n = 48) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    pts.push([x, base + amp * Math.sin((x / W) * Math.PI * 2 * freq + phase)]);
  }
  return pts;
}

/** Shape filled from the top edge down to the wave. Same number of points for every phase, so SMIL can morph it. */
function waveShape(h, base, amp, freq, phase) {
  const pts = wavePoints(base, amp, freq, phase);
  return `M0,0 L${W},0 L${W},${pts.at(-1)[1].toFixed(1)} ` + pts.slice().reverse().map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';
}

export function waveSvg(q) {
  const type = WAVE_TYPES.includes(q.get('type')) ? q.get('type') : 'waving';
  const footer = q.get('section') === 'footer';
  const H = num(q, 'height', 180, 40, 400);
  const pal = palette(q);
  let colors = stops(q.get('color')) ?? stops(pal.stops.join(','));
  if (flag(q, 'reversal')) colors = colors.map((c) => ({ ...c, offset: 100 - c.offset })).reverse();
  const text = (q.get('text') ?? '').slice(0, 80);
  const desc = (q.get('desc') ?? '').slice(0, 120);
  const fontColor = hex(q.get('font_color'), pal.text ?? 'ffffff');
  const descColor = hex(q.get('desc_color'), fontColor);
  const fontSize = num(q, 'font_size', 52, 10, 120);
  const descSize = num(q, 'desc_size', 18, 8, 60);
  const textY = num(q, 'text_y', footer ? 62 : 42, 0, 100);
  const descY = num(q, 'desc_y', footer ? 82 : 66, 0, 100);
  const font = FONTS[q.get('font')] ?? FONTS.sans;
  const weight = flag(q, 'bold', true) ? 700 : 400;
  const anim = TEXT_ANIMATIONS.includes(q.get('text_animation')) ? q.get('text_animation') : 'fade';
  const speed = num(q, 'speed', 8, 2, 30);

  const fill = 'url(#g)';
  let shape;
  const base = H * 0.78, amp = H * 0.09;
  if (type === 'waving') {
    // Two layers: a soft one behind, the main one in front; both morph between phases.
    const layer = (phases, opacity, ampK, freq, dur) => {
      const d = phases.map((p) => waveShape(H, base - (1 - ampK) * amp, amp * ampK, freq, p));
      return `<path fill="${fill}" fill-opacity="${opacity}" d="${d[0]}"><animate attributeName="d" dur="${dur}s" repeatCount="indefinite" values="${[...d, d[0]].join(';')}" calcMode="spline" keySplines="${Array(d.length).fill('.45 0 .55 1').join(';')}"/></path>`;
    };
    shape = layer([0, Math.PI / 2, Math.PI, Math.PI * 1.5], 0.45, 1.2, 1.3, speed * 1.3)
      + layer([Math.PI, Math.PI * 1.5, 0, Math.PI / 2], 1, 1, 1, speed);
  } else if (type === 'wave') {
    shape = `<path fill="${fill}" d="${waveShape(H, base, amp, 1, 0.6)}"/>`;
  } else if (type === 'rect') {
    shape = `<rect width="${W}" height="${H}" fill="${fill}"/>`;
  } else if (type === 'rounded') {
    shape = `<rect width="${W}" height="${H}" rx="${Math.min(24, H / 4)}" fill="${fill}"/>`;
  } else {
    shape = `<path fill="${fill}" d="M0,0 L${W},0 L${W},${H * 0.55} L0,${H} Z"/>`;
  }
  if (footer && type !== 'rect' && type !== 'rounded') shape = `<g transform="translate(0 ${H}) scale(1 -1)">${shape}</g>`;

  const textAnim = {
    none: '',
    fade: '.t { animation: fade 1.2s ease-out both; } .d { animation: fade 1.2s .4s ease-out both; } @keyframes fade { from { opacity: 0; } }',
    rise: '.t, .d { transform-box: fill-box; } .t { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; } .d { animation: rise .9s .25s cubic-bezier(.2,.7,.2,1) both; } @keyframes rise { from { opacity: 0; transform: translateY(14px); } }',
    glow: '.t { animation: glow 3s ease-in-out infinite alternate; } @keyframes glow { from { filter: drop-shadow(0 0 0 rgba(255,255,255,0)); } to { filter: drop-shadow(0 0 10px rgba(255,255,255,.65)); } }',
    twinkle: '.t, .d { animation: tw 2.4s ease-in-out infinite alternate; } .d { animation-delay: .8s; } @keyframes tw { from { opacity: 1; } to { opacity: .55; } }',
  }[anim];

  const textSvg = (text ? `<text class="t" x="50%" y="${textY}%" text-anchor="middle" dominant-baseline="middle" style="font: ${weight} ${fontSize}px ${font}; fill: #${fontColor}">${escapeXml(text)}</text>` : '')
    + (desc ? `<text class="d" x="50%" y="${descY}%" text-anchor="middle" dominant-baseline="middle" style="font: 400 ${descSize}px ${font}; fill: #${descColor}">${escapeXml(desc)}</text>` : '');

  return svgDoc(W, H, `<defs>${gradientDef('g', colors)}</defs>
<style>${textAnim} ${REDUCED}</style>
${shape}
${textSvg}`, escapeXml(text || 'banner'));
}
