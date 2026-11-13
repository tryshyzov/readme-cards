// "Effects" tab: banners, typing text, badges, decor. The form is built from the definitions below.

const L = (ru, en) => ({ ru, en });

const EFFECTS = {
  wave: {
    name: L('Шапка и волна', 'Header & wave'),
    path: '/api/wave',
    fullWidth: true,
    fields: [
      { name: 'type', server: 'waving', type: 'select', label: L('Форма', 'Shape'), options: {
        waving: L('Волна в движении', 'Moving wave'), wave: L('Волна', 'Wave'), rect: L('Прямоугольник', 'Rectangle'),
        rounded: L('Скруглённый', 'Rounded'), slice: L('Срез', 'Slice') } },
      { name: 'section', server: 'header', type: 'select', label: L('Где стоит', 'Placement'), options: { header: L('Шапка сверху', 'Header'), footer: L('Подвал снизу', 'Footer') } },
      { name: 'text', type: 'text', label: L('Текст', 'Text'), value: 'tryshyzov' },
      { name: 'desc', type: 'text', label: L('Подпись', 'Subtitle'), value: '✦ designer ✦' },
      { name: 'color', type: 'stops', label: L('Цвета волны', 'Wave colours'), from: 'gradient' },
      { name: 'reversal', type: 'check', label: L('Развернуть градиент', 'Reverse gradient') },
      { name: 'height', type: 'range', label: L('Высота', 'Height'), min: 40, max: 400, value: 180 },
      { name: 'speed', type: 'range', label: L('Медленность волны, сек', 'Wave cycle, s'), min: 2, max: 30, value: 8, only: { type: 'waving' } },
      { name: 'font', server: 'sans', type: 'select', label: L('Шрифт', 'Font'), options: { sans: L('Без засечек', 'Sans'), mono: L('Моноширинный', 'Mono'), serif: L('С засечками', 'Serif') } },
      { name: 'text_animation', server: 'fade', type: 'select', label: L('Анимация текста', 'Text animation'), options: {
        fade: L('Проявление', 'Fade in'), rise: L('Всплытие', 'Rise'), glow: L('Свечение', 'Glow'), twinkle: L('Мерцание', 'Twinkle'), none: L('Без анимации', 'None') } },
      { name: 'font_color', type: 'color', label: L('Цвет текста', 'Text colour'), from: 'text' },
      { name: 'font_size', type: 'range', label: L('Размер текста', 'Text size'), min: 10, max: 120, value: 52 },
      { name: 'desc_size', type: 'range', label: L('Размер подписи', 'Subtitle size'), min: 8, max: 60, value: 18 },
      { name: 'text_y', always: true, type: 'range', label: L('Текст по высоте, %', 'Text position, %'), min: 0, max: 100, value: 42, unit: '%' },
      { name: 'desc_y', always: true, type: 'range', label: L('Подпись по высоте, %', 'Subtitle position, %'), min: 0, max: 100, value: 66, unit: '%' },
      { name: 'bold', server: true, type: 'check', label: L('Жирный текст', 'Bold text'), value: true },
    ],
  },
  typing: {
    name: L('Печать текста', 'Typing text'),
    path: '/api/typing',
    fields: [
      { name: 'lines', type: 'lines', label: L('Строки (каждая с новой строки)', 'Lines (one per line)'), value: 'Thanks for visiting!\nexit 0' },
      { name: 'multiline', type: 'check', label: L('Строки остаются одна под другой', 'Keep lines stacked') },
      { name: 'repeat', server: true, type: 'check', label: L('Повторять по кругу', 'Loop'), value: true },
      { name: 'center', type: 'check', label: L('По центру', 'Centered') },
      { name: 'cursor', server: true, type: 'check', label: L('Курсор', 'Cursor'), value: true },
      { name: 'bold', type: 'check', label: L('Жирный', 'Bold') },
      { name: 'font', server: 'mono', type: 'select', label: L('Шрифт', 'Font'), options: { mono: L('Моноширинный', 'Mono'), sans: L('Без засечек', 'Sans'), serif: L('С засечками', 'Serif') } },
      { name: 'size', type: 'range', label: L('Размер', 'Size'), min: 8, max: 80, value: 22 },
      { name: 'color', type: 'color', label: L('Цвет текста', 'Text colour'), from: 'title' },
      { name: 'background', type: 'color', label: L('Фон (можно без)', 'Background (optional)'), optional: true, from: 'bg' },
      { name: 'speed', type: 'range', label: L('Скорость: мс на букву', 'Speed: ms per letter'), min: 15, max: 400, value: 70 },
      { name: 'pause', type: 'range', label: L('Пауза после строки, мс', 'Pause after a line, ms'), min: 0, max: 5000, step: 100, value: 1200 },
    ],
  },
  badge: {
    name: L('Плашка', 'Badge'),
    path: '/api/badge',
    fields: [
      { name: 'label', type: 'text', label: L('Слева (можно пусто)', 'Left part (optional)'), value: 'Telegram' },
      { name: 'message', type: 'text', label: L('Справа', 'Right part'), value: 'tryshyzov' },
      { name: 'logo', type: 'text', label: L('Логотип: имя с simpleicons.org', 'Logo: name from simpleicons.org'), value: 'telegram', hint: L('например github, telegram, figma, gmail', 'e.g. github, telegram, figma, gmail') },
      { name: 'href', type: 'text', label: L('Куда ведёт по клику', 'Link on click'), value: 'https://t.me/tryshyzov', local: true },
      { name: 'style', server: 'flat', type: 'select', label: L('Форма', 'Shape'), options: { 'for-the-badge': L('Крупная', 'Large'), flat: L('Плоская', 'Flat'), pill: L('Таблетка', 'Pill') } },
      { name: 'shine', type: 'check', label: L('Блик пробегает', 'Shine sweep'), value: true },
      { name: 'color', type: 'color', label: L('Цвет справа', 'Right colour'), from: 'accent' },
      { name: 'label_color', type: 'color', label: L('Цвет слева', 'Left colour'), from: 'bg' },
      { name: 'logo_color', type: 'color', label: L('Цвет логотипа', 'Logo colour'), optional: true, placeholder: L('как текст', 'like the text'), from: 'accent' },
    ],
  },
  decor: {
    name: L('Декор', 'Decor'),
    path: '/api/decor',
    fullWidth: true,
    fields: [
      { name: 'type', server: 'stars', type: 'select', label: L('Что', 'Kind'), options: {
        stars: L('Мерцающие звёзды ✦', 'Twinkling stars ✦'), line: L('Разделитель', 'Divider'), dots: L('Точки', 'Dots'), sparkles: L('Фон с частицами', 'Sparkle banner') } },
      { name: 'color', type: 'stops', label: L('Цвета', 'Colours'), from: 'decor' },
      { name: 'count', type: 'range', label: L('Сколько', 'How many'), min: 1, max: 120, value: 9, only: { type: ['stars', 'dots', 'sparkles'] } },
      { name: 'height', type: 'range', label: L('Высота', 'Height'), min: 10, max: 400, value: 48 },
      { name: 'speed', type: 'range', label: L('Скорость', 'Speed'), min: 0.25, max: 4, step: 0.25, value: 1 },
      { name: 'thickness', type: 'range', label: L('Толщина линии', 'Line thickness'), min: 1, max: 12, value: 2, only: { type: 'line' } },
      { name: 'star', server: true, type: 'check', label: L('Звёздочка посередине', 'Star in the middle'), value: true, only: { type: 'line' } },
      { name: 'text', type: 'text', label: L('Текст', 'Text'), value: '✦ tryshyzov ✦', only: { type: 'sparkles' } },
      { name: 'bg_color', type: 'stops', label: L('Фон', 'Background'), from: 'gradient', only: { type: 'sparkles' } },
      { name: 'seed', type: 'text', label: L('Узор (любое слово)', 'Pattern (any word)'), value: '', hint: L('другое слово — другая раскладка', 'another word, another layout'), only: { type: ['stars', 'sparkles'] } },
    ],
  },
};

// Defaults that differ per decor kind.
const DECOR_HEIGHT = { stars: 48, line: 24, dots: 32, sparkles: 160 };
const DECOR_COUNT = { stars: 9, dots: 7, sparkles: 60 };

export function createEffects({ root, getLang, getTheme, setTheme, themes, onChange }) {
  let kind = 'wave';
  const values = {};
  for (const [k, def] of Object.entries(EFFECTS)) {
    values[k] = {};
    for (const f of def.fields) if (f.value !== undefined) values[k][f.name] = f.value;
  }
  const tr = (l) => l[getLang()] ?? l.en;
  const th = () => themes()[getTheme()] ?? themes().default;

  function themeColor(from) {
    const t = th();
    const gradient = t.gradient ?? (String(t.bg).includes(',') ? String(t.bg).split(',').slice(1) : [t.bg, t.border, t.accent]);
    if (from === 'gradient') return gradient;
    if (from === 'decor') return [t.title, t.accent, t.muted];
    if (from === 'bg') return String(t.bg).includes(',') ? String(t.bg).split(',')[1] : String(t.bg).slice(0, 6);
    return t[from];
  }

  const visible = (f) => {
    if (!f.only) return true;
    return Object.entries(f.only).every(([k, v]) => (Array.isArray(v) ? v : [v]).includes(current()[k] ?? firstOption(k)));
  };
  const current = () => values[kind];
  const firstOption = (name) => Object.keys(EFFECTS[kind].fields.find((f) => f.name === name)?.options ?? {})[0];

  function field(f) {
    const wrap = document.createElement('label');
    wrap.className = f.type === 'check' ? 'check' : 'f';
    const v = current()[f.name];
    const set = (val) => {
      if (val === '' || val === undefined || val === null) delete current()[f.name]; else current()[f.name] = val;
      onChange();
    };
    const title = document.createElement('span');
    title.textContent = tr(f.label);
    if (f.type === 'check') {
      const input = Object.assign(document.createElement('input'), { type: 'checkbox', checked: v ?? false });
      input.addEventListener('change', () => { current()[f.name] = input.checked; onChange(); });
      wrap.append(input, ' ', title);
      return wrap;
    }
    wrap.append(title);
    if (f.type === 'select') {
      const sel = document.createElement('select');
      for (const [val, lab] of Object.entries(f.options)) sel.append(new Option(tr(lab), val, false, (v ?? firstOption(f.name)) === val));
      sel.addEventListener('change', () => {
        current()[f.name] = sel.value;
        if (kind === 'wave' && f.name === 'section') {
          const foot = sel.value === 'footer';
          current().text_y = foot ? 62 : 42;
          current().desc_y = foot ? 82 : 66;
        }
        if (kind === 'decor' && f.name === 'type') {
          current().height = DECOR_HEIGHT[sel.value];
          if (DECOR_COUNT[sel.value]) current().count = DECOR_COUNT[sel.value];
        }
        render(); onChange();
      });
      wrap.append(sel);
    } else if (f.type === 'range') {
      wrap.classList.add('range');
      const input = Object.assign(document.createElement('input'), { type: 'range', min: f.min, max: f.max, step: f.step ?? 1, value: v ?? f.value });
      const out = Object.assign(document.createElement('output'), { textContent: input.value });
      input.addEventListener('input', () => { out.textContent = input.value; current()[f.name] = Number(input.value); onChange(); });
      wrap.append(input, out);
    } else if (f.type === 'lines') {
      const ta = Object.assign(document.createElement('textarea'), { rows: 3, value: v ?? '', spellcheck: false });
      ta.addEventListener('input', () => set(ta.value));
      wrap.append(ta);
    } else if (f.type === 'color') {
      wrap.classList.add('fx-color');
      const auto = [].concat(themeColor(f.from))[0] ?? '000000';
      const row = document.createElement('span');
      row.className = 'fx-color-row';
      const picker = Object.assign(document.createElement('input'), { type: 'color', value: '#' + String(v ?? auto).slice(0, 6) });
      const hexIn = Object.assign(document.createElement('input'), { className: 'hex', value: v ?? '', placeholder: f.optional ? tr(f.placeholder ?? L('нет', 'none')) : String(auto).toUpperCase(), maxLength: 8, spellcheck: false });
      picker.setAttribute('aria-label', tr(f.label));
      picker.addEventListener('input', () => { hexIn.value = picker.value.slice(1).toUpperCase(); set(hexIn.value); });
      hexIn.addEventListener('input', () => {
        const ok = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hexIn.value) || hexIn.value === '';
        hexIn.setAttribute('aria-invalid', String(!ok));
        if (ok) { if (hexIn.value) picker.value = '#' + hexIn.value.replace('#', '').slice(0, 6); set(hexIn.value.replace('#', '')); }
      });
      row.append(picker, hexIn);
      wrap.append(row);
    } else if (f.type === 'stops') {
      wrap.classList.add('fx-stops');
      const list = (v ? String(v).split(',') : [].concat(themeColor(f.from))).map((c) => c.slice(0, 6));
      const row = document.createElement('span');
      row.className = 'fx-stops-row';
      const commit = () => set([...row.querySelectorAll('input[type=color]')].map((p) => p.value.slice(1).toUpperCase()).join(','));
      const addPicker = (c) => {
        const p = Object.assign(document.createElement('input'), { type: 'color', value: '#' + c });
        p.setAttribute('aria-label', tr(f.label));
        p.addEventListener('input', commit);
        row.insertBefore(p, plus);
      };
      const plus = Object.assign(document.createElement('button'), { type: 'button', className: 'fx-mini', textContent: '+' });
      plus.setAttribute('aria-label', tr(L('Добавить цвет', 'Add colour')));
      const minus = Object.assign(document.createElement('button'), { type: 'button', className: 'fx-mini', textContent: '−' });
      minus.setAttribute('aria-label', tr(L('Убрать цвет', 'Remove colour')));
      row.append(plus, minus);
      list.forEach(addPicker);
      plus.addEventListener('click', () => { if (row.querySelectorAll('input').length < 6) { addPicker(list.at(-1) ?? 'ffffff'); commit(); } });
      minus.addEventListener('click', () => { const ps = row.querySelectorAll('input'); if (ps.length > 1) { ps[ps.length - 1].remove(); commit(); } });
      wrap.append(row);
    } else {
      const input = Object.assign(document.createElement('input'), { value: v ?? '', spellcheck: false });
      input.addEventListener('input', () => set(input.value));
      wrap.append(input);
    }
    if (f.hint) wrap.append(Object.assign(document.createElement('small'), { className: 'hint-s', textContent: tr(f.hint) }));
    return wrap;
  }

  function render() {
    const kinds = document.createElement('div');
    kinds.className = 'chips';
    kinds.setAttribute('role', 'radiogroup');
    for (const [k, def] of Object.entries(EFFECTS)) {
      const b = Object.assign(document.createElement('button'), { type: 'button', className: 'chip', textContent: tr(def.name) });
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(k === kind));
      b.addEventListener('click', () => { kind = k; render(); onChange(true); });
      kinds.append(b);
    }
    const head = (text) => Object.assign(document.createElement('h2'), { className: 'fs-title', innerHTML: '<span class="star" aria-hidden="true">✦</span> ' }).appendChild(document.createTextNode(text)).parentNode;
    const box1 = document.createElement('section');
    box1.className = 'box';
    const themeSel = document.createElement('select');
    for (const name of Object.keys(themes())) themeSel.append(new Option(name.replace('_', ' '), name, false, name === getTheme()));
    themeSel.addEventListener('change', () => { setTheme(themeSel.value); render(); onChange(true); });
    const themeLab = document.createElement('label');
    themeLab.className = 'f fx-theme';
    themeLab.append(Object.assign(document.createElement('span'), { textContent: tr(L('Тема: цвета по умолчанию', 'Theme: default colours')) }), themeSel);
    box1.append(head(tr(L('Эффект', 'Effect'))), kinds, themeLab);
    const box2 = document.createElement('section');
    box2.className = 'box';
    const grid = document.createElement('div');
    grid.className = 'fx-grid';
    for (const f of EFFECTS[kind].fields) if (visible(f)) grid.append(field(f));
    box2.append(head(tr(L('Настройки', 'Settings'))), grid);
    root.replaceChildren(box1, box2);
  }

  function url() {
    const def = EFFECTS[kind];
    const p = new URLSearchParams();
    if (getTheme() !== 'default') p.set('theme', getTheme());
    for (const f of def.fields) {
      if (f.local || !visible(f)) continue;
      let v = current()[f.name];
      // Selects and checkboxes always go into the link, so the picture matches what the form shows.
      if (f.type === 'select') v = v ?? firstOption(f.name);
      if (f.type === 'check') v = String(Boolean(v ?? false));
      // ...but values equal to the server's own default are left out to keep the link short.
      const serverDefault = f.server ?? (f.type === 'check' ? 'false' : undefined);
      if (serverDefault !== undefined && String(v) === String(serverDefault)) continue;
      if (v === undefined || v === '') continue;
      if (f.type === 'lines') v = String(v).split('\n').map((s) => s.trim()).filter(Boolean).join(';');
      // Ranges left at the default stay out of the link, unless the server default depends on other settings.
      if (f.type === 'range' && Number(v) === f.value && !f.always && kind !== 'decor') continue;
      p.set(f.name, v);
    }
    return `${location.origin}${def.path}?${p.toString().replace(/%2C/g, ',').replace(/%3B/g, ';')}`;
  }

  return {
    render,
    url,
    alt: () => (kind === 'badge' ? [current().label, current().message].filter(Boolean).join(': ') : kind === 'wave' ? current().text || tr(EFFECTS[kind].name) : tr(EFFECTS[kind].name)),
    target: () => (kind === 'badge' ? current().href || '' : ''),
    fullWidth: () => Boolean(EFFECTS[kind].fullWidth),
  };
}
