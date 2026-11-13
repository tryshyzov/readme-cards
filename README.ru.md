<p align="center">
  <img src="docs/header.svg" alt="readme-cards: карточки для README на GitHub" width="100%"/>
</p>

<p align="center"><a href="README.md">English</a> &nbsp;·&nbsp; <b>Русский</b> &nbsp;·&nbsp; <a href="https://cards.tryshyzov.ru">Конструктор</a></p>

<p align="center">
  <a href="https://cards.tryshyzov.ru"><img src="https://img.shields.io/badge/%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C_%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80-E75395?style=for-the-badge" alt="Открыть конструктор"/></a>
  <img src="https://img.shields.io/badge/node-20+-233871?style=for-the-badge&logo=nodedotjs&logoColor=E75395" alt="Node 20+"/>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5F3189?style=for-the-badge" alt="MIT"/></a>
</p>

Карточки для профиля и README на GitHub: **статистика, языки, серия, активность, репозитории и пакеты PyPI**. Работают на своём сервере, поэтому не пропадают, когда падает чужой бесплатный сервис карточек (github-readme-stats днями отвечал ошибкой).

## ✦ Как это выглядит

<p align="center">
  <img src="https://cards.tryshyzov.ru/api/stats?username=tryshyzov&theme=tryshyzov&hide_border=true&locale=ru" alt="Карточка статистики" height="165"/>
  <img src="https://cards.tryshyzov.ru/api/langs?username=tryshyzov&theme=tryshyzov&style=donut&hide_border=true&locale=ru" alt="Карточка языков, стиль donut" height="165"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/streak?username=tryshyzov&theme=tryshyzov&hide_border=true&locale=ru" alt="Карточка серии"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/pin?username=tryshyzov&repo=FckCensor-Rework&theme=tryshyzov&hide_border=true&locale=ru" alt="Карточка репозитория с длинным русским описанием" width="49%"/>
  <img src="https://cards.tryshyzov.ru/api/pin?username=nowplaylab&repo=nowplaying-display&theme=nowplaylab&hide_border=true&locale=ru" alt="Карточка репозитория, тема nowplaylab" width="49%"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/stats?username=tryshyzov&theme=tryshyzov&style=terminal&hide_border=true&locale=ru" alt="Карточка статистики, стиль terminal" height="165"/>
  <img src="https://cards.tryshyzov.ru/api/pypi?package=lrclib-synced&theme=nowplaylab&hide_border=true&locale=ru" alt="Карточка пакета PyPI" height="165"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/activity?username=tryshyzov&theme=tryshyzov&style=heatmap&hide_border=true&locale=ru" alt="Карточка активности, стиль heatmap" width="100%"/>
</p>

Это живые карточки: каждую из них прямо сейчас рисует [cards.tryshyzov.ru](https://cards.tryshyzov.ru).

## ✦ Как пользоваться

1. Открой конструктор: **[cards.tryshyzov.ru](https://cards.tryshyzov.ru)**.
2. Выбери карточку, стиль и тему или настрой каждый цвет сам.
3. Скопируй строчку, которую он выдаст, в свой README:

```markdown
![Моя статистика](https://cards.tryshyzov.ru/api/stats?username=ТВОЙ_НИК&theme=tryshyzov&locale=ru)
```

Карточки обновляются сами: данные с GitHub хранятся пару часов, потом забираются заново.

**Переходишь с github-readme-stats?** Поменяй в ссылках домен на `cards.tryshyzov.ru`. Названия параметров те же, поэтому цвета останутся.

## ✦ Карточки

| Карточка | Адрес | Стили |
|---|---|---|
| Статистика | `/api/stats?username=…` | `classic` `grid` `minimal` `terminal` |
| Языки | `/api/langs?username=…` | `classic` `compact` `donut` `terminal` |
| Серия | `/api/streak?username=…` | `classic` `compact` `terminal` |
| Активность | `/api/activity?username=…` | `classic` `bars` `heatmap` `terminal` |
| Репозиторий | `/api/pin?username=…&repo=…` | `classic` `terminal` |
| Пакет PyPI | `/api/pypi?package=…` | `classic` `terminal` |

Описание репозитория переносится по настоящей ширине текста, поэтому длинное описание и русские буквы не вылезают за край.

<details>
<summary><b>Все параметры</b></summary>

| Параметр | Что делает |
|---|---|
| `theme` | `default`, `tryshyzov`, `nowplaylab`, `github_light`, `transparent`, `bear`, `dracula`, `tokyonight`, `nord`, `gruvbox`, `radical`, `catppuccin`, `synthwave`, `ocean` |
| `style` | вид карточки, см. таблицу выше |
| `bg_color` | цвет (`233871`) или градиент: угол и цвета (`135,233871,E75395`) |
| `title_color` `text_color` `muted_color` `icon_color` `accent_color` `ring_color` `border_color` `track_color` | цвета, hex без `#` |
| `hide_border` `hide_title` `disable_animations` | `true`, чтобы включить |
| `border_radius` | скругление углов, 0–40 |
| `locale` | `en` (по умолчанию) или `ru` |
| `custom_title` | свой заголовок |
| `hide` | статистика: любые из `stars,commits,prs,issues,contribs,ring`; языки: названия языков |
| `ring` | статистика: что показывает кольцо, `rank` (по умолчанию) или `contributions` |
| `langs_count` | сколько языков показать, 1–12 |
| `days` / `weeks` | длина графика активности |
| `description_lines_count` `show_owner` | карточка репозитория |

</details>

## ✦ Эффекты

<p align="center">
  <img src="https://cards.tryshyzov.ru/api/wave?type=waving&section=header&text=readme-cards&desc=cards%20for%20GitHub&color=233871,5F3189,E75395&text_animation=fade" alt="Волна-шапка" width="100%"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/typing?lines=tryshyzov%40MacBook%20~%20%25%20whoami;tryshyzov&size=20&color=E75395&background=233871" alt="Печатающийся текст"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/badge?label=made%20with&message=readme-cards&logo=github&style=for-the-badge&color=E75395&label_color=233871" alt="Плашка"/>
</p>
<p align="center">
  <img src="https://cards.tryshyzov.ru/api/decor?type=sparkles&color=E75395&count=12&height=60" alt="Блёстки" width="100%"/>
</p>

| Эффект | Адрес | Главные параметры |
|---|---|---|
| Волна для шапки или подвала | `/api/wave` | `type` (`waving` `wave` `rect` `rounded` `slice`), `section` (`header`/`footer`), `text`, `desc`, `color` (один цвет или несколько для градиента), `text_animation` (`fade` `rise` `glow` `twinkle` `none`) |
| Печатающийся текст | `/api/typing` | `lines` (через `;`), `font`, `size`, `bold`, `color`, `background`, `center`, `vCenter`, `multiline`, `width`, `height`, `duration` (мс на строку), `pause`, `repeat`, `letterSpacing`, `theme` |
| Плашка | `/api/badge` | `label`, `message`, `logo` (название из [Simple Icons](https://simpleicons.org)), `style` (`flat` `pill` `for-the-badge`), `color`, `label_color`, `shine` |
| Украшение | `/api/decor` | `type` (`stars` `line` `dots` `sparkles`), `color`, `count`, `height`, `speed`, `seed`, `text` |

Они заменяют capsule-render, readme-typing-svg и плашки shields.io, так что весь профиль может жить на одном сервере. Печатающийся текст — порт [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) (MIT) с теми же параметрами, так что его ссылки работают, если поменять домен. В конструкторе для них есть отдельная вкладка.

## ✦ Свой сервер

Понадобятся сервер с Docker, домен, который на него смотрит, и токен GitHub. Токен только читает открытые данные: создай **fine-grained** токен на [github.com/settings/tokens](https://github.com/settings/tokens) и не давай ему никаких дополнительных прав.

```bash
git clone https://github.com/tryshyzov/readme-cards && cd readme-cards
cp .env.example .env
```

Заполни `.env`:

| Настройка | |
|---|---|
| `GITHUB_TOKEN` | токен из шага выше |
| `DOMAIN` | твой домен, например `cards.example.com` |
| `ALLOWED_USERS` | необязательно: рисовать карточки только для этих аккаунтов, через запятую. Пусто — для всех |
| `CACHE_HOURS` | сколько часов хранить данные с GitHub, по умолчанию 2 |

И запусти:

```bash
docker compose --profile caddy up -d
```

Caddy сам получит сертификат для HTTPS, нужны свободные порты 80 и 443. Открой `https://твой-домен`, там будет конструктор.

**Уже есть nginx?** Запусти `docker compose up -d` без Caddy. Сервис слушает `127.0.0.1:3000`, пример настройки лежит в [deploy/nginx.conf.example](deploy/nginx.conf.example).

**Без Docker:** Node 20 или новее, затем `GITHUB_TOKEN=… node src/server.js`. Сервис слушает порт `3000` (или `PORT`).

Если GitHub недоступен, карточки показывают последние данные, которые успели прийти, а не ошибку.

## ✦ Разработка

```bash
npm test
```

Карточки лежат в `src/cards/`, цвета и темы в `src/theme.js`, конструктор в `public/`.

## ✦ Лицензия

MIT, см. [LICENSE](LICENSE).

<p align="center">
  <img src="docs/footer.svg" alt="" width="100%"/>
</p>
