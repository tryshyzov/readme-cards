// Card frame shared by every card, plus icons.
import { escapeXml } from './text.js';

// Octicons (MIT, GitHub Inc.), 16x16.
export const icons = {
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  commit: 'M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
  pr: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
  issue: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
  fork: 'M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z',
  download: 'M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z',
  tag: 'M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  calendar: 'M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z',
  flame: 'M8 16c3.3 0 6-2.5 6-5.8 0-2.6-1.6-4.3-2.9-5.6-.4-.4-1.1-.1-1.1.5 0 1-.5 1.9-1.3 2.3C9 4.6 7.6 1.9 5.4.3c-.5-.3-1.1 0-1.1.6C4.2 3.3 2 5.2 2 8.9 2 13.2 4.7 16 8 16Z',
};

export function icon(name, x, y, color, size = 16) {
  const s = size / 16;
  return `<path transform="translate(${x} ${y}) scale(${s})" fill="#${color}" d="${icons[name]}"/>`;
}

function backgroundDef(bg) {
  if (bg.solid) return { fill: `#${bg.solid}`, def: '' };
  const a = ((bg.angle % 360) + 360) % 360;
  const rad = (a * Math.PI) / 180;
  // Same idea as CSS: 0deg points up, 90deg to the right.
  const x = Math.sin(rad) / 2, y = -Math.cos(rad) / 2;
  const f = (n) => (n * 100).toFixed(1) + '%';
  const stops = bg.stops
    .map((c, i) => `<stop offset="${f(i / (bg.stops.length - 1))}" stop-color="#${c}"/>`)
    .join('');
  return {
    fill: 'url(#bg)',
    def: `<linearGradient id="bg" x1="${f(0.5 - x)}" y1="${f(0.5 - y)}" x2="${f(0.5 + x)}" y2="${f(0.5 + y)}">${stops}</linearGradient>`,
  };
}

const ANIMATIONS = `
  .fade, .slide, .grow, .rise, .pop, .draw, .type { animation-duration: .6s; animation-timing-function: cubic-bezier(.2,.7,.2,1); animation-fill-mode: both; }
  .fade { animation-name: fade; }
  .slide { animation-name: slide; }
  .grow { animation-name: grow; transform-box: fill-box; transform-origin: left center; animation-duration: .9s; }
  .rise { animation-name: rise; transform-box: fill-box; transform-origin: center bottom; }
  .pop { animation-name: pop; transform-box: fill-box; transform-origin: center; animation-duration: .4s; }
  .draw { animation-name: draw; animation-duration: 1.4s; stroke-dasharray: 1; }
  .type { animation-name: type; animation-timing-function: steps(5, end); animation-duration: .45s; }
  .caret { animation: blink 1s steps(1) infinite; }
  .flicker { animation: flicker 1.8s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center bottom; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes slide { from { opacity: 0; transform: translateX(-10px); } }
  @keyframes grow { from { transform: scaleX(0); } }
  @keyframes rise { from { transform: scaleY(0); } }
  @keyframes pop { from { opacity: 0; transform: scale(.2); } }
  @keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  /* Typing feel without clipping: a choppy step-in. Clipping text cut off its end in some browsers. */
  @keyframes type { from { opacity: 0; transform: translateX(-6px); } }
  @keyframes blink { 50% { opacity: 0; } }
  @keyframes flicker { 0% { transform: scale(1, 1); } 50% { transform: scale(.94, 1.08); } 100% { transform: scale(1.04, .96); } }
  @media (prefers-reduced-motion: reduce) {
    .fade, .slide, .grow, .rise, .pop, .draw, .type, .caret, .flicker { animation: none; }
  }`;

/** style="animation-delay:…" helper. */
export const delay = (ms) => `style="animation-delay:${Math.round(ms)}ms"`;

/**
 * Wraps card content in the frame: background, border, title.
 * In the terminal style the title becomes a shell prompt after three window dots.
 */
export function card({ width, height, theme, title, body, desc = '', defs = '' }) {
  const bg = backgroundDef(theme.bg);
  let titleSvg = '';
  if (theme.mono) {
    const dots = ['ff5f57', 'febc2e', '28c840']
      .map((c, i) => `<circle cx="${25 + i * 16}" cy="29" r="5" fill="#${c}"/>`).join('');
    titleSvg = dots + (title && !theme.hideTitle
      ? `<text x="82" y="34" class="title" style="font-size:14px"><tspan style="fill:#${theme.muted}">~ % </tspan>${escapeXml(title)}<tspan class="caret" style="fill:#${theme.accent}">▍</tspan></text>`
      : '');
  } else if (title && !theme.hideTitle) {
    titleSvg = `<text x="25" y="35" class="title fade">${escapeXml(title)}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">
<title id="t">${escapeXml(desc || title || 'card')}</title>
<defs>${bg.def}${defs}</defs>
<style>
  text { font-family: ${theme.font}; }
  .title { font-size: 18px; font-weight: 600; fill: #${theme.title}; }
  .text { font-size: 14px; fill: #${theme.text}; }
  .bold { font-weight: 700; }
  .muted { font-size: 12px; fill: #${theme.muted}; }
  .accent { fill: #${theme.accent}; }
${theme.animate ? ANIMATIONS : ''}
</style>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${theme.radius}" fill="${bg.fill}" stroke="#${theme.border}" stroke-opacity="${theme.hideBorder ? 0 : 1}"/>
${titleSvg}
${body}
</svg>`;
}

/** A small card shown instead of real data when something went wrong. */
export function errorCard(theme, message, hint = '') {
  const body = `<text x="25" y="62" class="text">${escapeXml(message)}</text>`
    + (hint ? `<text x="25" y="86" class="muted">${escapeXml(hint)}</text>` : '');
  return card({ width: 495, height: 110, theme, title: 'Something went wrong', body });
}
