// Typing text, ported from readme-typing-svg by Jonah Lawrence (DenverCoder1), MIT License,
// https://github.com/DenverCoder1/readme-typing-svg (src/templates/main.php).
// Same parameters as the original, so its links work here after swapping the domain:
// lines (split by ;), font, size, color, background, center, vCenter, multiline, width, height,
// duration (ms per line), pause (ms), repeat, letterSpacing. Extra: theme, bold.
import { escapeXml } from '../text.js';
import { hex, num, flag, palette, FONTS } from './common.js';

export function typingSvg(q) {
  const pal = palette(q);
  const lines = (q.get('lines') ?? 'The five boxing wizards jump quickly').split(';').map((s) => s.trim()).filter(Boolean).slice(0, 20)
    .map((s) => s.slice(0, 200));
  const size = num(q, 'size', 20, 1, 200);
  const color = '#' + hex(q.get('color'), pal.title);
  const background = '#' + hex(q.get('background'), '00000000');
  const center = flag(q, 'center');
  const vCenter = flag(q, 'vCenter') || flag(q, 'vcenter');
  const multiline = flag(q, 'multiline');
  const repeat = flag(q, 'repeat', true);
  const duration = num(q, 'duration', 5000, 1, 60000);
  const pause = num(q, 'pause', 1000, 0, 60000);
  const width = num(q, 'width', 400, 1, 2000);
  const height = num(q, 'height', multiline ? (size + 5) * lines.length + 10 : 50, 1, 2000);
  const letterSpacing = /^(normal|-?\d+(\.\d+)?(px|em|rem|%)?)$/.test(q.get('letterSpacing') ?? '') ? q.get('letterSpacing') : 'normal';
  const fontKey = q.get('font');
  const font = (FONTS[fontKey] ?? (fontKey && /^[\w \-]{1,40}$/.test(fontKey) ? `'${fontKey}', ${FONTS.mono}` : FONTS.mono)).replace(/"/g, "'");
  const weight = flag(q, 'bold') ? 700 : 400;
  const last = lines.length - 1;

  let out = '';
  lines.forEach((line, i) => {
    let anim;
    if (!multiline) {
      // Single line: type in 80% of the duration, hold for the pause, erase in what is left.
      const begin = i === 0 ? (repeat ? `0s;d${last}.end` : '0s') : `d${i - 1}.end`;
      const freeze = !repeat && i === last;
      const y = height / 2;
      const empty = `m0,${y} h0`, full = `m0,${y} h${width}`;
      const values = [empty, full, full, freeze ? full : empty];
      const keyTimes = ['0', (0.8 * duration) / (duration + pause), (0.8 * duration + pause) / (duration + pause), '1'];
      anim = `<animate id='d${i}' attributeName='d' begin='${begin}' dur='${duration + pause}ms' fill='${freeze ? 'freeze' : 'remove'}' values='${values.join(' ; ')}' keyTimes='${keyTimes.join(';')}' />`;
    } else {
      // Multiline: each line waits for the ones above, types, and stays.
      const next = i + 1;
      const lineDuration = (duration + pause) * next;
      const y = next * (size + 5);
      const empty = `m0,${y} h0`, full = `m0,${y} h${width}`;
      const values = [empty, empty, full, full];
      const keyTimes = ['0', i / next, i / next + duration / lineDuration, '1'];
      anim = `<animate id='d${i}' attributeName='d' begin='0s${repeat ? `;d${last}.end` : ''}' dur='${lineDuration}ms' fill="freeze" values='${values.join(' ; ')}' keyTimes='${keyTimes.join(';')}' />`;
    }
    out += `<path id='path${i}'>${anim}</path>
<text font-family="${font}" font-weight="${weight}" fill='${color}' font-size='${size}' dominant-baseline='${vCenter ? 'middle' : 'auto'}' x='${center ? '50%' : '0%'}' text-anchor='${center ? 'middle' : 'start'}' letter-spacing='${letterSpacing}'><textPath xlink:href='#path${i}'>${escapeXml(line)}</textPath></text>\n`;
  });

  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 ${width} ${height}' style='background-color: ${background};' width='${width}px' height='${height}px' role='img' aria-label='${escapeXml(lines.join(' / '))}'>
${out}</svg>`;
}
