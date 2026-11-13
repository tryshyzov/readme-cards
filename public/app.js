// Configurator: builds the card URL from the form, shows a live preview and the snippet.
import { createEffects } from './effects.js';

const UI = {
  ru: {
    heroTitle: 'Карточки для профиля на GitHub, которые не падают',
    heroLede: 'Настрой карточку, скопируй код и вставь в README. Картинка обновляется сама: данные берутся с GitHub раз в пару часов.',
    copyReadme: 'Скопировать для README', copyLink: 'или только ссылку', copyCode: 'Скопировать код', copied: 'Скопировано',
    eachColor: 'Настроить каждый цвет', ariaLang: 'Язык сайта', ariaGh: 'Тема GitHub', ariaFmt: 'Формат',
    hexError: 'Нужен код цвета из 3 или 6 знаков, например E75395',
    cardLegend: 'Карточка', styleLegend: 'Стиль', dataLegend: 'Данные', themeLegend: 'Цвета',
    username: 'Ник на GitHub', repo: 'Репозиторий', package: 'Пакет на PyPI', cardLocale: 'Язык подписей',
    ringMode: 'В кольце', ringRank: 'Оценка', ringContrib: 'Число вкладов',
    langsCount: 'Сколько языков', hideLangs: 'Скрыть языки', descLines: 'Строк описания',
    days: 'Дней на графике', weeks: 'Недель в календаре', customTitle: 'Свой заголовок',
    showOwner: 'Показывать владельца', hideTitle: 'Без заголовка',
    c_bg: 'Фон', bgSolid: 'Цвет', bgGradient: 'Градиент', angle: 'Угол градиента',
    resetColors: 'Вернуть все цвета темы', radius: 'Скругление углов', hideBorder: 'Без рамки', noAnim: 'Без анимации',
    preview: 'Как будет в README', ghDark: 'Тёмный GitHub', ghLight: 'Светлый', replay: 'Повторить анимацию',
    code: 'Код для вставки',
    hint: 'GitHub хранит картинки у себя пару часов. Если поменял настройки, а в профиле старое, подожди или допиши к ссылке &v=2.',
    footer: 'Работает на своём сервере, без чужих сервисов.', source: 'Исходник на GitHub',
    loading: 'Загружаю…', failed: 'Картинка не загрузилась. Проверь ник или название.',
    resetOne: 'Вернуть цвет темы', stop: 'Точка', addStop: 'Добавить третью точку', removeStop: 'Убрать третью точку',
    tabCards: 'Карточки', tabEffects: 'Эффекты', ariaTabs: 'Раздел', fxTheme: 'Тема (цвета по умолчанию)',
    types: { stats: 'Статистика', langs: 'Языки', streak: 'Серия', activity: 'Активность', pin: 'Репозиторий', pypi: 'PyPI' },
    styles: { classic: 'Классика', grid: 'Плитки', minimal: 'Минимум', terminal: 'Терминал', compact: 'Компактно', donut: 'Бублик', bars: 'Столбики', heatmap: 'Календарь' },
    colors: {
      title: ['Заголовок', 'Название карточки'], text: ['Текст', 'Цифры и подписи'], muted: ['Второстепенный', 'Даты, проценты'],
      icon: ['Иконки', 'Значки у строк'], accent: ['Акцент', 'Графики, полосы'], ring: ['Кольцо', 'Кольцо и огонёк'],
      border: ['Рамка', 'Видна, если рамка включена'], track: ['Подложка', 'Пустая часть полос'],
    },
  },
  en: {
    heroTitle: 'Cards for your GitHub profile that stay up',
    heroLede: 'Set up a card, copy the code and paste it into your README. The image updates itself: data comes from GitHub every couple of hours.',
    copyReadme: 'Copy for README', copyLink: 'or just the link', copyCode: 'Copy code', copied: 'Copied',
    eachColor: 'Adjust each colour', ariaLang: 'Site language', ariaGh: 'GitHub theme', ariaFmt: 'Format',
    hexError: 'Needs a 3 or 6 digit colour code, like E75395',
    cardLegend: 'Card', styleLegend: 'Style', dataLegend: 'Data', themeLegend: 'Colours',
    username: 'GitHub username', repo: 'Repository', package: 'PyPI package', cardLocale: 'Label language',
    ringMode: 'In the ring', ringRank: 'Rank', ringContrib: 'Contributions',
    langsCount: 'Languages shown', hideLangs: 'Hide languages', descLines: 'Description lines',
    days: 'Days on the chart', weeks: 'Weeks in the calendar', customTitle: 'Custom title',
    showOwner: 'Show owner', hideTitle: 'No title',
    c_bg: 'Background', bgSolid: 'Colour', bgGradient: 'Gradient', angle: 'Gradient angle',
    resetColors: 'Reset all colours to the theme', radius: 'Corner radius', hideBorder: 'No border', noAnim: 'No animation',
    preview: 'How it looks in a README', ghDark: 'Dark GitHub', ghLight: 'Light', replay: 'Replay animation',
    code: 'Code to paste',
    hint: 'GitHub keeps images for a couple of hours. If you changed settings and the profile still shows the old card, wait or add &v=2 to the link.',
    footer: 'Runs on its own server, no third-party services.', source: 'Source on GitHub',
    loading: 'Loading…', failed: 'The image did not load. Check the username or name.',
    resetOne: 'Back to theme colour', stop: 'Stop', addStop: 'Add a third stop', removeStop: 'Remove the third stop',
    tabCards: 'Cards', tabEffects: 'Effects', ariaTabs: 'Section', fxTheme: 'Theme (default colours)',
    types: { stats: 'Stats', langs: 'Languages', streak: 'Streak', activity: 'Activity', pin: 'Repository', pypi: 'PyPI' },
    styles: { classic: 'Classic', grid: 'Tiles', minimal: 'Minimal', terminal: 'Terminal', compact: 'Compact', donut: 'Donut', bars: 'Bars', heatmap: 'Calendar' },
    colors: {
      title: ['Title', 'Card heading'], text: ['Text', 'Numbers and labels'], muted: ['Secondary', 'Dates, percentages'],
      icon: ['Icons', 'Row icons'], accent: ['Accent', 'Charts, bars'], ring: ['Ring', 'Ring and flame'],
      border: ['Border', 'Shown when the border is on'], track: ['Track', 'Empty part of bars'],
    },
  },
};

// Which inputs each card uses.
const FIELDS = {
  stats: ['username', 'locale', 'ring', 'custom_title', 'hide_title'],
  langs: ['username', 'langs_count', 'hide', 'locale', 'custom_title', 'hide_title'],
  streak: ['username', 'locale'],
  activity: ['username', 'days', 'weeks', 'locale', 'custom_title', 'hide_title'],
  pin: ['username', 'repo', 'description_lines_count', 'show_owner', 'locale'],
  pypi: ['package', 'locale'],
};
const DEFAULTS = { langs_count: '6', description_lines_count: '3', days: '31', weeks: '52', border_radius: '12' };
const COLOR_KEYS = ['title', 'text', 'muted', 'icon', 'accent', 'ring', 'border', 'track'];

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const form = $('#form');
const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

let config = { themes: {}, styles: {} };
const state = {
  lang: 'ru', type: 'stats', style: 'classic', theme: 'tryshyzov',
  colors: {},              // overrides: key -> hex without #
  bg: null,                // override: { solid } or { angle, stops }
  gh: 'dark', fmt: 'md', mode: 'cards', fxTheme: 'tryshyzov',
};

// ---------- helpers ----------

const expand = (h) => {
  h = h.replace('#', '');
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  return h.slice(0, 6).toLowerCase();
};
function parseBg(v) {
  const parts = String(v).split(',');
  if (parts.length === 1) return { solid: parts[0] };
  return { angle: Number(parts[0]), stops: parts.slice(1) };
}
const bgToParam = (bg) => (bg.solid ? bg.solid : [bg.angle, ...bg.stops].join(','));
const themeBase = () => config.themes[state.theme] ?? config.themes.default;
const currentBg = () => state.bg ?? parseBg(themeBase().bg);
const t = () => UI[state.lang];

// ---------- building the URL ----------

function params() {
  const p = new URLSearchParams();
  const fields = FIELDS[state.type];
  for (const name of fields) {
    const el = form.elements[name];
    if (!el || $(`[data-for="${name}"]`)?.hidden) continue;
    if (el.type === 'checkbox') { if (el.checked) p.set(name, 'true'); continue; }
    const v = el.value.trim();
    if (v && v !== DEFAULTS[name]) p.set(name, v);
  }
  if (state.style !== 'classic') p.set('style', state.style);
  if (state.theme !== 'default') p.set('theme', state.theme);
  if (state.bg) p.set('bg_color', bgToParam(state.bg));
  for (const k of COLOR_KEYS) if (state.colors[k]) p.set(`${k}_color`, state.colors[k]);
  const radius = form.elements.border_radius.value;
  if (radius !== DEFAULTS.border_radius) p.set('border_radius', radius);
  if (form.elements.hide_border.checked) p.set('hide_border', 'true');
  if (form.elements.disable_animations.checked) p.set('disable_animations', 'true');
  return p;
}

function cardUrl() {
  const p = params().toString().replace(/%2C/g, ',');
  return `${location.origin}/api/${state.type}?${p}`;
}

function linkTarget() {
  const u = form.elements.username.value.trim();
  if (state.type === 'pin') return `https://github.com/${u}/${form.elements.repo.value.trim()}`;
  if (state.type === 'pypi') return `https://pypi.org/project/${form.elements.package.value.trim()}/`;
  return '';
}

// ---------- rendering ----------

function renderUrl(url) {
  const [base, query] = url.split('?');
  const code = $('#url-text');
  code.textContent = '';
  code.append(base);
  if (!query) return;
  query.split('&').forEach((pair, i) => {
    const [k, v = ''] = pair.split('=');
    const sep = document.createElement('span');
    sep.className = 'p'; sep.textContent = i ? '&' : '?';
    code.append(document.createElement('wbr'));
    const key = document.createElement('span');
    key.className = 'k'; key.textContent = k;
    code.append(sep, key, '=' + decodeURIComponent(v));
  });
}

const fxMode = () => state.mode === 'effects';
const currentUrl = () => (fxMode() ? fx.url() : cardUrl());

function renderSnippet(url) {
  const alt = fxMode() ? fx.alt() : t().types[state.type];
  const target = fxMode() ? fx.target() : linkTarget();
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  let s;
  if (fxMode() && fx.fullWidth()) {
    // Banners should stretch to the README width, which Markdown cannot say: HTML in both formats.
    s = `<img src="${esc(url)}" width="100%" alt="${alt}"/>`;
  } else if (state.fmt === 'md') {
    s = `![${alt}](${url})`;
    if (target) s = `[${s}](${target})`;
  } else {
    s = `<img src="${esc(url)}" alt="${alt}"/>`;
    if (target) s = `<a href="${target}">${s}</a>`;
  }
  $('#snippet').textContent = s;
}

let previewTimer;
function update({ now = false } = {}) {
  const url = currentUrl();
  renderUrl(url);
  renderSnippet(url);
  if (!fxMode()) try { history.replaceState(null, '', '#' + new URLSearchParams({ type: state.type, ...Object.fromEntries(params()) })); } catch {}
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => loadPreview(url), now ? 0 : 450);
}

function loadPreview(url, bust = false) {
  const img = $('#preview');
  const src = bust ? `${url}&_=${Date.now()}` : url;
  if (img.getAttribute('src') === src) return;
  img.classList.add('loading');
  $('#status').textContent = t().loading;
  img.onload = () => { img.classList.remove('loading'); $('#status').textContent = ''; };
  img.onerror = () => { img.classList.remove('loading'); $('#status').textContent = t().failed; };
  img.alt = fxMode() ? fx.alt() : t().types[state.type];
  img.src = src;
  $('#mini-img').src = src;
}

function chip(label, checked, onClick, cls = 'chip') {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.setAttribute('role', 'radio');
  b.setAttribute('aria-checked', String(checked)); b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function renderTypes() {
  const box = $('#types');
  box.replaceChildren(...Object.keys(FIELDS).map((type) => chip(t().types[type], type === state.type, () => {
    state.type = type;
    if (!(config.styles[type] ?? ['classic']).includes(state.style)) state.style = 'classic';
    renderTypes(); renderStyles(); renderFields(); update({ now: true });
  })));
}

function renderStyles() {
  const list = config.styles[state.type] ?? ['classic'];
  $('#styles').replaceChildren(...list.map((s) => chip(t().styles[s] ?? s, s === state.style, () => {
    state.style = s; renderStyles(); renderFields(); update({ now: true });
  })));
}

function renderFields() {
  const used = new Set(FIELDS[state.type]);
  for (const el of $$('[data-for]')) {
    const name = el.dataset.for;
    let show = used.has(name);
    if (state.type === 'activity' && name === 'days') show = state.style !== 'heatmap';
    if (state.type === 'activity' && name === 'weeks') show = state.style === 'heatmap';
    el.hidden = !show;
  }
}

function renderThemes() {
  const box = $('#themes');
  box.replaceChildren(...Object.entries(config.themes).map(([name, th]) => {
    const bg = parseBg(th.bg);
    const css = bg.solid
      ? (bg.solid.length === 8 && bg.solid.endsWith('00') ? 'repeating-conic-gradient(#2b4282 0 25%, #233871 0 50%) 0 0/12px 12px' : '#' + bg.solid)
      : `linear-gradient(${bg.angle}deg, ${bg.stops.map((c) => '#' + c).join(',')})`;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'theme'; b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(name === state.theme));
    b.style.setProperty('--sw-bg', css);
    b.style.setProperty('--sw-text', '#' + th.text);
    b.innerHTML = `<span class="sw">${['title', 'accent', 'text'].map((k) => `<i style="background:#${th[k]}"></i>`).join('')}</span><span class="nm"></span>`;
    b.querySelector('.nm').textContent = name.replace('_', ' ');
    b.title = name;
    b.addEventListener('click', () => {
      state.theme = name; state.colors = {}; state.bg = null;
      renderThemes(); renderColors(); update({ now: true });
    });
    return b;
  }));
}

/** One colour row: round picker, name, hex field, reset. */
function colorRow({ label, hint, value, overridden, onChange, onReset }) {
  const row = document.createElement('div');
  row.className = 'color';
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  row.innerHTML = `<input type="color" aria-label="">
<label class="name" for="${id}"></label>
<input class="hex" id="${id}" spellcheck="false" maxlength="9">
<button type="button" class="reset" aria-label=""><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.75 8a5.25 5.25 0 1 0 1.6-3.77"/><path d="M2.5 2.5v3.25h3.25"/></svg></button>`;
  const picker = row.querySelector('[type=color]');
  const hex = row.querySelector('.hex');
  const reset = row.querySelector('.reset');
  row.querySelector('.name').innerHTML = '';
  row.querySelector('.name').append(label, ...(hint ? [Object.assign(document.createElement('small'), { textContent: hint })] : []));
  picker.setAttribute('aria-label', label);
  reset.setAttribute('aria-label', `${t().resetOne}: ${label}`);
  reset.title = t().resetOne;
  picker.value = '#' + expand(value);
  hex.value = value.toUpperCase();
  hex.classList.toggle('inherited', !overridden);
  reset.disabled = !overridden || !onReset;
  picker.addEventListener('input', () => {
    hex.value = picker.value.slice(1).toUpperCase();
    hex.classList.remove('inherited'); hex.removeAttribute('aria-invalid'); err.hidden = true;
    reset.disabled = !onReset;
    onChange(picker.value.slice(1));
  });
  const err = Object.assign(document.createElement('p'), { className: 'err', hidden: true, textContent: t().hexError });
  err.id = id + 'e';
  hex.setAttribute('aria-describedby', err.id);
  row.append(err);
  hex.addEventListener('input', () => {
    const v = hex.value.trim();
    const ok = HEX.test(v);
    hex.setAttribute('aria-invalid', String(!ok));
    err.hidden = ok;
    if (!ok) return;
    picker.value = '#' + expand(v);
    hex.classList.remove('inherited');
    reset.disabled = !onReset;
    onChange(v.replace('#', ''));
  });
  if (onReset) reset.addEventListener('click', onReset);
  return row;
}

function renderColors() {
  const base = themeBase();
  const bg = currentBg();
  const gradient = !bg.solid;
  $$('[data-bg]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.bg === 'gradient') === gradient)));
  $('#angle-row').hidden = !gradient;
  if (gradient) { $('#angle').value = bg.angle; $('#angle-out').textContent = bg.angle + '°'; }

  const setBg = (next) => { state.bg = next; update(); };
  const resetBg = () => { state.bg = null; renderColors(); update({ now: true }); };
  const bgRows = gradient
    ? bg.stops.map((c, i) => colorRow({
      label: `${t().stop} ${i + 1}`, value: c, overridden: Boolean(state.bg),
      onChange: (v) => { const cur = currentBg(); const stops = [...cur.stops]; stops[i] = v; setBg({ angle: cur.angle, stops }); },
      onReset: state.bg ? resetBg : null,
    }))
    : [colorRow({
      label: t().bgSolid, value: bg.solid, overridden: Boolean(state.bg),
      onChange: (v) => setBg({ solid: v }), onReset: state.bg ? resetBg : null,
    })];
  if (gradient) {
    const more = bg.stops.length < 3;
    const btn = Object.assign(document.createElement('button'), {
      type: 'button', className: 'link', textContent: more ? t().addStop : t().removeStop,
    });
    btn.addEventListener('click', () => {
      const cur = currentBg();
      const stops = more ? [...cur.stops, state.colors.title ?? base.title] : cur.stops.slice(0, 2);
      state.bg = { angle: cur.angle, stops };
      renderColors(); update({ now: true });
    });
    bgRows.push(btn);
  }
  $('#bg-colors').replaceChildren(...bgRows);

  $('#colors').replaceChildren(...COLOR_KEYS.map((k) => {
    const [label, hint] = t().colors[k];
    const inherited = k === 'ring' ? (state.colors.accent ?? base.accent) : base[k];
    return colorRow({
      label, hint, value: state.colors[k] ?? inherited, overridden: Boolean(state.colors[k]),
      onChange: (v) => { state.colors[k] = v; update(); },
      onReset: () => { delete state.colors[k]; renderColors(); update({ now: true }); },
    });
  }));
}

function applyLang() {
  document.documentElement.lang = state.lang;
  for (const el of $$('[data-i18n]')) {
    const v = t()[el.dataset.i18n];
    if (typeof v === 'string') el.textContent = v;
  }
  for (const el of $$('[data-i18n-aria]')) el.setAttribute('aria-label', t()[el.dataset.i18nAria]);
  $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  renderTypes(); renderStyles(); renderColors();
  if (fxMode()) fx.render();
}

// ---------- events ----------

form.addEventListener('input', (e) => {
  if (e.target.closest('.color') || e.target.id === 'angle') return;
  if (e.target.name === 'locale') e.target.dataset.touched = '1';
  if (e.target.name === 'border_radius') $('#radius-out').textContent = e.target.value;
  update();
});
form.addEventListener('submit', (e) => e.preventDefault());

$('#angle').addEventListener('input', (e) => {
  const cur = currentBg();
  state.bg = { angle: Number(e.target.value), stops: cur.stops };
  $('#angle-out').textContent = e.target.value + '°';
  $$('#bg-colors .reset').forEach((r) => { r.disabled = false; });
  update();
});

$$('[data-bg]').forEach((b) => b.addEventListener('click', () => {
  const cur = currentBg();
  if (b.dataset.bg === 'gradient' && cur.solid) {
    state.bg = { angle: 135, stops: [cur.solid.slice(0, 6), (state.colors.border ?? themeBase().border).slice(0, 6)] };
  } else if (b.dataset.bg === 'solid' && !cur.solid) {
    state.bg = { solid: cur.stops[0] };
  } else return;
  renderColors(); update({ now: true });
}));

$('#reset-colors').addEventListener('click', () => { state.colors = {}; state.bg = null; renderColors(); update({ now: true }); });

$$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  state.lang = b.dataset.lang;
  try { localStorage.setItem('lang', state.lang); } catch {}
  applyLang(); update({ now: true });
}));
$$('[data-gh]').forEach((b) => b.addEventListener('click', () => {
  state.gh = b.dataset.gh;
  $('#stage').dataset.gh = state.gh;
  $$('[data-gh]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
}));
$$('[data-fmt]').forEach((b) => b.addEventListener('click', () => {
  state.fmt = b.dataset.fmt;
  $$('[data-fmt]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderSnippet(currentUrl());
}));
$('#replay').addEventListener('click', () => loadPreview(currentUrl(), true));

async function copy(text, btn) {
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  const label = btn.textContent;
  btn.style.minWidth = btn.offsetWidth + 'px';
  btn.textContent = t().copied; btn.classList.add('done');
  setTimeout(() => { btn.textContent = label; btn.classList.remove('done'); btn.style.minWidth = ''; }, 1500);
}
$('#copy-readme').addEventListener('click', (e) => copy($('#snippet').textContent, e.currentTarget));
$('#copy-url').addEventListener('click', (e) => copy(currentUrl(), e.currentTarget));

// Cards / Effects switch.
const fx = createEffects({
  root: $('#fx-form'),
  getLang: () => state.lang,
  getTheme: () => state.fxTheme,
  setTheme: (name) => { state.fxTheme = name; },
  themes: () => config.themes,
  onChange: (now) => update({ now: Boolean(now) }),
});
function setMode(mode) {
  state.mode = mode;
  $$('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  form.hidden = mode === 'effects';
  $('#fx-form').hidden = mode !== 'effects';
  if (mode === 'effects') fx.render();
  try { localStorage.setItem('mode', mode); } catch {}
  update({ now: true });
}
$$('[data-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

// Keep numbers inside their limits.
form.addEventListener('change', (e) => {
  const el = e.target;
  if (el.type !== 'number' || el.value === '') return;
  const v = Math.min(Number(el.max), Math.max(Number(el.min), Math.round(Number(el.value)) || Number(el.min)));
  if (String(v) !== el.value) { el.value = v; update(); }
});

// On narrow screens a small copy of the card follows you while the big preview is off screen.
const narrow = matchMedia('(max-width: 960px)');
new IntersectionObserver(([entry]) => {
  $('#mini').hidden = !narrow.matches || entry.isIntersecting;
}).observe($('#stage'));
$('#copy-snippet').addEventListener('click', (e) => copy($('#snippet').textContent, e.currentTarget));

// ---------- start ----------

function restore() {
  const h = new URLSearchParams(location.hash.slice(1));
  if (!h.has('type')) return;
  if (FIELDS[h.get('type')]) state.type = h.get('type');
  state.style = (config.styles[state.type] ?? ['classic']).includes(h.get('style')) ? h.get('style') : 'classic';
  state.theme = h.get('theme') && config.themes[h.get('theme')] ? h.get('theme') : 'default';
  if (h.get('bg_color')) state.bg = parseBg(h.get('bg_color'));
  for (const k of COLOR_KEYS) if (h.get(`${k}_color`)) state.colors[k] = h.get(`${k}_color`);
  for (const [k, v] of h) {
    const el = form.elements[k];
    if (!el || el instanceof RadioNodeList) continue;
    if (el.type === 'checkbox') el.checked = v === 'true';
    else el.value = v;
    if (k === 'locale') el.dataset.touched = '1';
  }
  form.elements.hide_border.checked = h.get('hide_border') === 'true';
  $('#radius-out').textContent = form.elements.border_radius.value;
}

(async () => {
  try { config = await (await fetch('/config.json')).json(); } catch { /* keep empty */ }
  try { state.lang = localStorage.getItem('lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en'); } catch {}
  form.elements.locale.value = state.lang === 'ru' ? 'ru' : '';
  restore();
  renderThemes(); renderFields(); applyLang();
  let mode = 'cards';
  try { mode = location.hash.startsWith('#type=') ? 'cards' : localStorage.getItem('mode') || 'cards'; } catch {}
  setMode(mode === 'effects' ? 'effects' : 'cards');
})();
