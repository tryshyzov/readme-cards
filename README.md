<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=180&color=0:233871,55:5F3189,100:E75395&section=header&text=readme-cards&fontColor=E6D6F0&fontSize=52&fontAlignY=38&desc=%E2%9C%A6%20cards%20for%20GitHub%20READMEs%20%E2%9C%A6&descColor=E6D6F0&descSize=16&descAlignY=60" alt="readme-cards"/>
</p>

<p align="center">
  <a href="https://cards.tryshyzov.ru"><img src="https://img.shields.io/badge/configurator-E75395?style=for-the-badge" alt="Configurator"/></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-233871?style=for-the-badge&logo=nodedotjs&logoColor=E75395" alt="Node 20+"/>
  <img src="https://img.shields.io/badge/license-MIT-5F3189?style=for-the-badge" alt="MIT"/>
</p>

Self-hosted SVG cards for GitHub profiles: stats, languages, streak, repository pins, activity graph and PyPI packages. No third-party card service in between, so the cards do not go down when somebody else's free hosting does.
/ Свои карточки-картинки для профиля на GitHub: статистика, языки, серия, репозитории, график активности и пакеты PyPI. Работают на своём сервере, без чужих сервисов, которые то и дело падают.

## ✦ Configurator / Конструктор

Open **https://cards.tryshyzov.ru**, pick a card, a style and colours, copy the line into your README.
/ Открой **https://cards.tryshyzov.ru**, выбери карточку, стиль и цвета, скопируй строчку в README.

## ✦ Cards / Карточки

| Card / Карточка | URL | Styles / Стили |
|---|---|---|
| Stats / Статистика | `/api/stats?username=…` | `classic` `grid` `minimal` `terminal` |
| Languages / Языки | `/api/langs?username=…` | `classic` `compact` `donut` `terminal` |
| Streak / Серия | `/api/streak?username=…` | `classic` `compact` `terminal` |
| Activity / Активность | `/api/activity?username=…` | `classic` `bars` `heatmap` `terminal` |
| Repository / Репозиторий | `/api/pin?username=…&repo=…` | `classic` `terminal` |
| PyPI | `/api/pypi?package=…` | `classic` `terminal` |

<p align="center">
  <img src="https://cards.tryshyzov.ru/api/stats?username=tryshyzov&theme=tryshyzov&hide_border=true" alt="stats"/>
  <img src="https://cards.tryshyzov.ru/api/langs?username=tryshyzov&theme=tryshyzov&style=donut&hide_border=true" alt="languages"/>
</p>

Repository descriptions wrap by the real width of the text, so long or Cyrillic descriptions stay inside the card.
/ Описание репозитория переносится по реальной ширине текста, поэтому длинный и русский текст не вылезает за край.

## ✦ Options / Параметры

| Parameter | What it does / Что делает |
|---|---|
| `theme` | `default`, `tryshyzov`, `nowplaylab`, `github_light`, `transparent`, `bear`, `dracula`, `tokyonight`, `nord`, `gruvbox`, `radical`, `catppuccin`, `synthwave`, `ocean` |
| `style` | look of the card, see the table above / вид карточки |
| `bg_color` | `233871` or a gradient `135,233871,E75395` (angle, colours) / цвет или градиент |
| `title_color` `text_color` `muted_color` `icon_color` `accent_color` `ring_color` `border_color` `track_color` | hex without `#` / цвет без `#` |
| `hide_border` `hide_title` `disable_animations` | `true` |
| `border_radius` | 0–40 |
| `locale` | `en` (default), `ru` |
| `custom_title` | your own heading / свой заголовок |
| `hide` | stats: `stars,commits,prs,issues,contribs,ring`; langs: language names |
| `ring` | stats: `rank` (default) or `contributions` |
| `langs_count` | 1–12 |
| `days` / `weeks` | activity chart length / длина графика |
| `description_lines_count` `show_owner` | pin card |

Links from github-readme-stats keep working after swapping the domain: the colour names are the same.
/ Ссылки от github-readme-stats работают, если поменять домен: названия параметров те же.

## ✦ Run your own / Запустить у себя

You need a server with Docker and a domain pointing to it.
/ Нужен сервер с Docker и домен, который на него смотрит.

```bash
git clone https://github.com/tryshyzov/readme-cards && cd readme-cards
cp .env.example .env   # put GITHUB_TOKEN and DOMAIN here / впиши токен и домен
docker compose --profile caddy up -d
```

Caddy gets the HTTPS certificate by itself. Already have nginx? Run `docker compose up -d` (the service listens on `127.0.0.1:3000`) and use [deploy/nginx.conf.example](deploy/nginx.conf.example).
/ Уже есть nginx? Запусти `docker compose up -d` и возьми пример настройки из `deploy/nginx.conf.example`.

 The token only needs read access to public repositories (a fine-grained token with no extra permissions is enough). Data is cached for `CACHE_HOURS` (2 by default); if GitHub is down, the last good data keeps being served.
/ Caddy сам получает сертификат для HTTPS. Токену нужно только чтение публичных репозиториев. Данные кэшируются на `CACHE_HOURS` часов (по умолчанию 2); если GitHub недоступен, отдаются последние удачные.

Without Docker: Node 20+, `GITHUB_TOKEN=… node src/server.js`, port `3000` (or `PORT`). Tests: `npm test`.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=100&color=0:E75395,45:5F3189,100:233871&section=footer" alt="footer"/>
</p>
