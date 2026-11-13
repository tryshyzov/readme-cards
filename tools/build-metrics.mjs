// Builds src/metrics.json: the width of every common character, in em.
// Run once: npm i --no-save opentype.js && node tools/build-metrics.mjs <regular.ttf> <bold.ttf>
// The committed table was made from Arial, which is close to (or a bit wider than)
// the fonts GitHub viewers actually see (Segoe UI, Helvetica, Ubuntu).
import fs from 'node:fs';
import opentype from 'opentype.js';

const [regPath, boldPath] = process.argv.slice(2);
if (!regPath || !boldPath) {
  console.error('usage: node tools/build-metrics.mjs <regular.ttf> <bold.ttf>');
  process.exit(1);
}

const ranges = [
  [0x20, 0x7e], [0xa0, 0x17f], [0x400, 0x4ff], [0x2010, 0x206f],
  [0x2100, 0x215f], [0x2190, 0x21ff], [0x2200, 0x22ff], [0x2500, 0x25ff], [0x2600, 0x27bf],
];

function table(path) {
  const font = opentype.loadSync(path);
  const out = {};
  for (const [a, b] of ranges) {
    for (let c = a; c <= b; c++) {
      const g = font.charToGlyph(String.fromCodePoint(c));
      if (!g || g.index === 0) continue;
      out[c.toString(36)] = Math.round((g.advanceWidth / font.unitsPerEm) * 1000);
    }
  }
  return out;
}

const metrics = { unit: 1000, regular: table(regPath), bold: table(boldPath) };
fs.writeFileSync(new URL('../src/metrics.json', import.meta.url), JSON.stringify(metrics));
console.log('regular', Object.keys(metrics.regular).length, 'bold', Object.keys(metrics.bold).length);
