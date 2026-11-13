// Themes, card styles and colour parameters from the URL.

export const SANS = "'Segoe UI', Ubuntu, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const MONO = "'SF Mono', ui-monospace, Menlo, Consolas, 'JetBrains Mono', 'Liberation Mono', monospace";

// bg can be a colour or "angle,colour,colour,…" for a gradient.
const T = (bg, title, text, muted, icon, accent, border, track, extra = {}) =>
  ({ bg, title, text, muted, icon, accent, border, track, ...extra });

export const themes = {
  default: T('0d1117', '58a6ff', 'c9d1d9', '8b949e', '58a6ff', '58a6ff', '30363d', '21262d'),
  // Personal profile tryshyzov: colours from the avatar.
  tryshyzov: T('233871', 'E75395', 'E6D6F0', 'AF8FC0', 'E75395', 'E75395', '5F3189', '2E4585',
    { gradient: ['233871', '5F3189', 'E75395'] }),
  // NowPlay Lab organisation: lavender gradient from the banner.
  nowplaylab: T('135,7A689B,55507F,343759', 'FFFFFF', 'E8E6F2', 'B4AFCF', 'FFFFFF', '772556', '8B85A7', '3B3C61',
    { font: `Inter, ${SANS}`, gradient: ['7A689B', '55507F', '343759'] }),
  github_light: T('ffffff', '0969da', '1f2328', '656d76', '0969da', '0969da', 'd0d7de', 'eaeef2'),
  transparent: T('00000000', '58a6ff', '8b949e', '8b949e', '58a6ff', '58a6ff', '8b949e', '8b949e33'),
  bear: T('1f2023', 'e03c8a', 'bcb28d', '8b8670', '00aeff', 'e03c8a', '2c2d31', '2c2d31'),
  dracula: T('282a36', 'ff79c6', 'f8f8f2', '6272a4', 'bd93f9', 'ff79c6', '44475a', '44475a'),
  tokyonight: T('1a1b27', '70a5fd', 'a9b1d6', '565f89', 'bf91f3', '38bdae', '292e42', '292e42'),
  nord: T('2e3440', '88c0d0', 'd8dee9', '7b88a1', '81a1c1', '88c0d0', '3b4252', '3b4252'),
  gruvbox: T('282828', 'fabd2f', 'ebdbb2', 'a89984', 'fe8019', 'b8bb26', '3c3836', '3c3836'),
  radical: T('141321', 'fe428e', 'a9fef7', '7f7aa1', 'f8d847', 'fe428e', '2a2840', '2a2840'),
  catppuccin: T('1e1e2e', 'cba6f7', 'cdd6f4', '7f849c', 'f5c2e7', 'cba6f7', '313244', '313244'),
  synthwave: T('2b213a', 'e2e9ec', 'e5289e', '9d8bb5', 'ef8539', 'ef8539', '3d2f52', '3d2f52'),
  ocean: T('135,0f2027,203a43,2c5364', '7fdbff', 'e0f7ff', '8fb8c9', '7fdbff', '39cccc', '2c5364', '1b3540'),
};

// Card styles. Every card has "classic"; extra ones are listed per card.
export const styles = {
  stats: ['classic', 'grid', 'minimal', 'terminal'],
  langs: ['classic', 'compact', 'donut', 'terminal'],
  streak: ['classic', 'compact', 'terminal'],
  activity: ['classic', 'bars', 'heatmap', 'terminal'],
  pin: ['classic', 'terminal'],
  pypi: ['classic', 'terminal'],
};

const HEX = /^(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function hex(value) {
  const v = String(value ?? '').trim().replace(/^#/, '');
  return HEX.test(v) ? v : null;
}

/** "7A689B" or "135,7A689B,343759" (angle and gradient stops). Anything else -> null. */
function background(value) {
  const parts = String(value ?? '').split(',').map((s) => s.trim());
  if (parts.length === 1) return hex(parts[0]) ? { solid: hex(parts[0]) } : null;
  const angle = Number(parts[0]);
  const stops = parts.slice(1).map(hex);
  if (!Number.isFinite(angle) || stops.length < 2 || stops.some((s) => !s)) return null;
  return { angle, stops };
}

export const bool = (v) => v === '' || v === 'true' || v === '1';

/** Builds the final colour set from ?theme=…, ?style=… and per-colour overrides. */
export function resolveTheme(q, card = 'stats') {
  const base = themes[q.get('theme')] ?? themes.default;
  const pick = (param, key) => hex(q.get(param)) ?? base[key];
  const radius = Number(q.get('border_radius'));
  const allowed = styles[card] ?? ['classic'];
  // Old github-readme-stats links use layout=compact for languages.
  const wanted = q.get('style') || (card === 'langs' && q.get('layout') === 'compact' ? 'compact' : 'classic');
  const style = allowed.includes(wanted) ? wanted : 'classic';
  return {
    style,
    mono: style === 'terminal',
    bg: background(q.get('bg_color')) ?? background(base.bg),
    title: pick('title_color', 'title'),
    text: pick('text_color', 'text'),
    muted: pick('muted_color', 'muted'),
    icon: pick('icon_color', 'icon'),
    accent: pick('accent_color', 'accent'),
    ring: pick('ring_color', 'accent'),
    border: pick('border_color', 'border'),
    track: pick('track_color', 'track'),
    font: style === 'terminal' ? MONO : base.font ?? SANS,
    hideBorder: bool(q.get('hide_border')),
    hideTitle: bool(q.get('hide_title')),
    animate: !bool(q.get('disable_animations')),
    radius: Number.isFinite(radius) && q.get('border_radius') !== null ? Math.max(0, Math.min(radius, 40)) : 12,
  };
}
