// HTTP server: card endpoints under /api, the configurator site at /.
import './env.js';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveTheme, themes, styles } from './theme.js';
import { locale, localeCode } from './i18n.js';
import { errorCard } from './svg.js';
import { setMono } from './text.js';
import { owner, contributions, repository, pypi, valid, NotFound } from './data.js';
import { statsCard } from './cards/stats.js';
import { langsCard } from './cards/langs.js';
import { streakCard } from './cards/streak.js';
import { pinCard } from './cards/pin.js';
import { activityCard } from './cards/activity.js';
import { pypiCard } from './cards/pypi.js';

const PORT = Number(process.env.PORT || 3000);
const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));
const ALLOWED = (process.env.ALLOWED_USERS || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
const CARD_MAX_AGE = Number(process.env.CACHE_HOURS ?? 2) * 3600;

class BadRequest extends Error {}

function need(q, name, check) {
  const v = q.get(name);
  if (!v || !check(v)) throw new BadRequest(`Missing or invalid "${name}"`);
  if (ALLOWED.length && (name === 'username' || name === 'owner') && !ALLOWED.includes(v.toLowerCase())) {
    throw new BadRequest(`"${v}" is not served here`);
  }
  return v;
}

const routes = {
  '/api/stats': async (q) => {
    const login = need(q, 'username', valid.login);
    const o = await owner(login);
    const contrib = o.type === 'User' ? await contributions(login).catch(() => null) : null;
    return (theme, t, lang) => statsCard({ owner: o, contrib }, theme, t, q, lang);
  },
  '/api/langs': async (q) => {
    const o = await owner(need(q, 'username', valid.login));
    return (theme, t, lang) => langsCard({ owner: o }, theme, t, q, lang);
  },
  '/api/streak': async (q) => {
    const contrib = await contributions(need(q, 'username', valid.login));
    return (theme, t, lang) => streakCard({ contrib }, theme, t, q, lang);
  },
  '/api/activity': async (q) => {
    const login = need(q, 'username', valid.login);
    const [o, contrib] = await Promise.all([owner(login), contributions(login)]);
    return (theme, t, lang) => activityCard({ owner: o, contrib }, theme, t, q, lang);
  },
  '/api/pin': async (q) => {
    const o = need(q, q.has('owner') ? 'owner' : 'username', valid.login);
    const repo = await repository(o, need(q, 'repo', valid.repo));
    return (theme, t, lang) => pinCard({ repo }, theme, t, q, lang);
  },
  '/api/pypi': async (q) => {
    const pkg = await pypi(need(q, 'package', valid.pkg));
    return (theme, t, lang) => pypiCard({ pkg }, theme, t, q, lang);
  },
};

const STATIC = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

function serveStatic(pathname, res) {
  const file = path.normalize(path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname));
  if (!file.startsWith(PUBLIC + path.sep)) return false;
  let data;
  try { data = fs.readFileSync(file); } catch { return false; }
  res.writeHead(200, { 'Content-Type': STATIC[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(data);
  return true;
}

function sendSvg(res, svg, maxAge) {
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400`,
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(svg);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  if (url.pathname === '/config.json') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' }).end(JSON.stringify({ themes, styles }));
    return;
  }
  if (url.pathname === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok'); return; }

  // Same paths as github-readme-stats, so old links only need a new domain.
  const aliases = { '/api': '/api/stats', '/api/top-langs': '/api/langs' };
  const clean = url.pathname.replace(/\/$/, '');
  const routePath = aliases[clean] ?? clean;
  const route = routes[routePath];
  if (!route) {
    if (serveStatic(url.pathname, res)) return;
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }

  const q = url.searchParams;
  const theme = resolveTheme(q, routePath.split('/').pop());
  setMono(theme.mono);
  const t = locale(q);
  try {
    const render = await route(q);
    sendSvg(res, render(theme, t, localeCode(q)), CARD_MAX_AGE);
  } catch (e) {
    const known = e instanceof BadRequest || e instanceof NotFound;
    if (!known) console.error(new Date().toISOString(), url.pathname + url.search, e);
    // Errors are cached briefly, so a fixed problem shows up soon.
    sendSvg(res, errorCard(theme, known ? e.message : 'Could not load data, try again later'), 300);
  }
});

server.listen(PORT, () => console.log(`readme-cards on :${PORT}`));
