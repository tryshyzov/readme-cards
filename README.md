<p align="center">
  <img src="docs/header.svg" alt="readme-cards: cards for GitHub READMEs" width="100%"/>
</p>

<p align="center"><b>English</b> &nbsp;·&nbsp; <a href="README.ru.md">Русский</a> &nbsp;·&nbsp; <a href="https://cards.tryshyzov.ru">Configurator</a></p>

<p align="center">
  <a href="https://cards.tryshyzov.ru"><img src="https://img.shields.io/badge/open_the_configurator-E75395?style=for-the-badge" alt="Open the configurator"/></a>
  <img src="https://img.shields.io/badge/node-20+-233871?style=for-the-badge&logo=nodedotjs&logoColor=E75395" alt="Node 20+"/>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5F3189?style=for-the-badge" alt="MIT"/></a>
</p>

Cards for your GitHub profile and READMEs: **stats, languages, streak, activity, repository pins and PyPI packages**. They run on your own server, so they don't vanish when somebody else's free card service goes down (github-readme-stats was answering with errors for days).

## ✦ What it looks like

<p align="center">
  <img src="https://cards.tryshyzov.ru/api/stats?username=tryshyzov&theme=tryshyzov&hide_border=true" alt="Stats card" height="165"/>
  <img src="https://cards.tryshyzov.ru/api/langs?username=tryshyzov&theme=tryshyzov&style=donut&hide_border=true" alt="Languages card, donut style" height="165"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/streak?username=tryshyzov&theme=tryshyzov&hide_border=true" alt="Streak card"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/pin?username=tryshyzov&repo=FckCensor-Rework&theme=tryshyzov&hide_border=true" alt="Repository card with a long Russian description" width="49%"/>
  <img src="https://cards.tryshyzov.ru/api/pin?username=nowplaylab&repo=nowplaying-display&theme=nowplaylab&hide_border=true" alt="Repository card, nowplaylab theme" width="49%"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/stats?username=tryshyzov&theme=tryshyzov&style=terminal&hide_border=true" alt="Stats card, terminal style" height="165"/>
  <img src="https://cards.tryshyzov.ru/api/pypi?package=lrclib-synced&theme=nowplaylab&hide_border=true" alt="PyPI package card" height="165"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/activity?username=tryshyzov&theme=tryshyzov&style=heatmap&hide_border=true" alt="Activity card, heatmap style" width="100%"/>
</p>

These are live: every card above is drawn right now by [cards.tryshyzov.ru](https://cards.tryshyzov.ru).

## ✦ How to use

1. Open the configurator at **[cards.tryshyzov.ru](https://cards.tryshyzov.ru)**.
2. Pick a card, a style and a theme, or set every colour yourself.
3. Copy the line it gives you into your README:

```markdown
![My stats](https://cards.tryshyzov.ru/api/stats?username=YOUR_NAME&theme=tryshyzov)
```

Cards refresh on their own: GitHub data is kept for a couple of hours, then fetched again.

**Coming from github-readme-stats?** Change the domain in your links to `cards.tryshyzov.ru`. The parameter names are the same, so your colours carry over.

## ✦ Cards

| Card | Address | Styles |
|---|---|---|
| Stats | `/api/stats?username=…` | `classic` `grid` `minimal` `terminal` |
| Languages | `/api/langs?username=…` | `classic` `compact` `donut` `terminal` |
| Streak | `/api/streak?username=…` | `classic` `compact` `terminal` |
| Activity | `/api/activity?username=…` | `classic` `bars` `heatmap` `terminal` |
| Repository | `/api/pin?username=…&repo=…` | `classic` `terminal` |
| PyPI package | `/api/pypi?package=…` | `classic` `terminal` |

Repository descriptions wrap by the real width of the text, so long descriptions and Cyrillic stay inside the card.

<details>
<summary><b>All options</b></summary>

| Option | What it does |
|---|---|
| `theme` | `default`, `tryshyzov`, `nowplaylab`, `github_light`, `transparent`, `bear`, `dracula`, `tokyonight`, `nord`, `gruvbox`, `radical`, `catppuccin`, `synthwave`, `ocean` |
| `style` | the look of the card, see the table above |
| `bg_color` | a colour (`233871`) or a gradient: angle and colours (`135,233871,E75395`) |
| `title_color` `text_color` `muted_color` `icon_color` `accent_color` `ring_color` `border_color` `track_color` | colours, hex without `#` |
| `hide_border` `hide_title` `disable_animations` | `true` to turn on |
| `border_radius` | corner rounding, 0–40 |
| `locale` | `en` (default) or `ru` |
| `custom_title` | your own heading |
| `hide` | stats: any of `stars,commits,prs,issues,contribs,ring`; languages: language names |
| `ring` | stats: what the ring shows, `rank` (default) or `contributions` |
| `langs_count` | how many languages, 1–12 |
| `days` / `weeks` | length of the activity chart |
| `description_lines_count` `show_owner` | repository card |

</details>

## ✦ Effects

<p align="center">
  <img src="https://cards.tryshyzov.ru/api/wave?type=waving&section=header&text=readme-cards&desc=cards%20for%20GitHub&color=233871,5F3189,E75395&text_animation=fade" alt="Wave header" width="100%"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/typing?lines=tryshyzov%40MacBook%20~%20%25%20whoami;tryshyzov&size=20&color=E75395&background=233871" alt="Typing text"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/badge?label=made%20with&message=readme-cards&logo=github&style=for-the-badge&color=E75395&label_color=233871" alt="Badge"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/decor?type=sparkles&color=E75395&count=12&height=60" alt="Sparkles" width="100%"/>
</p>

| Effect | Address | Main options |
|---|---|---|
| Wave header or footer | `/api/wave` | `type` (`waving` `wave` `rect` `rounded` `slice`), `section` (`header`/`footer`), `text`, `desc`, `color` (one colour or several for a gradient), `text_animation` (`fade` `rise` `glow` `twinkle` `none`) |
| Typing text | `/api/typing` | `lines` (separated by `;`), `font`, `size`, `bold`, `color`, `background`, `center`, `vCenter`, `multiline`, `width`, `height`, `duration` (ms per line), `pause`, `repeat`, `letterSpacing`, `theme` |
| Badge | `/api/badge` | `label`, `message`, `logo` (a [Simple Icons](https://simpleicons.org) name), `style` (`flat` `pill` `for-the-badge`), `color`, `label_color`, `shine` |
| Decoration | `/api/decor` | `type` (`stars` `line` `dots` `sparkles`), `color`, `count`, `height`, `speed`, `seed`, `text` |

These replace capsule-render, readme-typing-svg and shields.io badges, so a whole profile can live on one server. The typing effect is a port of [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) (MIT) with the same options, so its links work after swapping the domain. The configurator has a tab for them.

## ✦ Run your own server

You need a server with Docker, a domain pointing at it, and a GitHub token. The token only reads public data: create a **fine-grained** token at [github.com/settings/tokens](https://github.com/settings/tokens) and give it no extra permissions.

```bash
git clone https://github.com/tryshyzov/readme-cards && cd readme-cards
cp .env.example .env
```

Fill in `.env`:

| Setting | |
|---|---|
| `GITHUB_TOKEN` | the token from above |
| `DOMAIN` | your domain, e.g. `cards.example.com` |
| `ALLOWED_USERS` | optional: draw cards only for these accounts, comma separated. Empty means anyone |
| `CACHE_HOURS` | how long to keep GitHub data, 2 by default |

Then start it:

```bash
docker compose --profile caddy up -d
```

Caddy gets the HTTPS certificate by itself; ports 80 and 443 must be free. Open `https://your-domain` and the configurator is there.

**Already have nginx?** Run `docker compose up -d` without the Caddy profile. The service listens on `127.0.0.1:3000`; an example config is in [deploy/nginx.conf.example](deploy/nginx.conf.example).

**Without Docker:** Node 20 or newer, then `GITHUB_TOKEN=… node src/server.js`. It listens on port `3000` (or `PORT`).

If GitHub is unreachable, the cards keep showing the last data that came through, instead of an error.

## ✦ Development

```bash
npm test
```

The cards live in `src/cards/`, colours and themes in `src/theme.js`, the configurator in `public/`.

## ✦ License

MIT, see [LICENSE](LICENSE).

<p align="center">
  <img src="docs/footer.svg" alt="" width="100%"/>
</p>
