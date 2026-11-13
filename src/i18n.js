// Labels in English and Russian (?locale=ru).
const words = {
  en: {
    statsTitle: (n) => `${n}'s GitHub stats`, stars: 'Total stars', commits: 'Total commits', prs: 'Pull requests',
    issues: 'Issues', contributed: 'Contributed to', forks: 'Total forks', repos: 'Public repositories',
    contributions: 'contributions', rank: 'rank', langsTitle: 'Most used languages', totalContrib: 'Total contributions',
    current: 'Current streak', longest: 'Longest streak', present: 'Present', days: 'days', day: 'day',
    activityTitle: (n) => `${n}'s contribution graph`, version: 'Version', downloads: 'Downloads / month', released: 'Released',
    short: { stars: 'stars', commits: 'commits', prs: 'PRs', issues: 'issues', contribs: 'repos', forks: 'forks', repos: 'repos' },
    python: 'Python', license: 'License', noLangs: 'No languages yet', archived: 'Archived', template: 'Template',
  },
  ru: {
    statsTitle: (n) => `Статистика ${n} на GitHub`, stars: 'Звёзды', commits: 'Коммиты', prs: 'Пулл-реквесты',
    issues: 'Задачи (issues)', contributed: 'Участие в репо', forks: 'Форки', repos: 'Публичные репозитории',
    contributions: 'вкладов', rank: 'оценка', langsTitle: 'Языки', totalContrib: 'Всего вкладов',
    current: 'Текущая серия', longest: 'Самая длинная', present: 'сейчас', days: 'дн.', day: 'дн.',
    activityTitle: (n) => `Активность ${n}`, version: 'Версия', downloads: 'Скачиваний за месяц', released: 'Выпущена',
    short: { stars: 'звёзды', commits: 'коммиты', prs: 'PR', issues: 'issues', contribs: 'репо', forks: 'форки', repos: 'репо' },
    python: 'Python', license: 'Лицензия', noLangs: 'Языков пока нет', archived: 'Архив', template: 'Шаблон',
  },
};

export function locale(q) {
  return words[q.get('locale')] ?? words.en;
}

export function localeCode(q) {
  return words[q.get('locale')] ? q.get('locale') : 'en';
}
