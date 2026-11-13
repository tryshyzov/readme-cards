// Loading data from GitHub (GraphQL) and PyPI, through the cache.
import { Cache } from './cache.js';

const HOUR = 3600_000;
const TTL = {
  profile: Number(process.env.CACHE_HOURS ?? 2) * HOUR,
  contrib: Number(process.env.CACHE_HOURS ?? 2) * HOUR,
  repo: Number(process.env.CACHE_HOURS ?? 2) * HOUR,
  pypi: 4 * HOUR,
};
const UA = 'readme-cards (+https://github.com/tryshyzov/readme-cards)';

export const cache = new Cache(process.env.CACHE_FILE || null);

export class NotFound extends Error {}

const LOGIN = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const REPO = /^[\w.-]{1,100}$/;
const PKG = /^[a-z\d](?:[a-z\d._-]{0,98}[a-z\d])?$/i;
export const valid = {
  login: (s) => typeof s === 'string' && LOGIN.test(s),
  repo: (s) => typeof s === 'string' && REPO.test(s),
  pkg: (s) => typeof s === 'string' && PKG.test(s),
};

async function graphql(query, variables) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) {
    if (json.errors.some((e) => e.type === 'NOT_FOUND')) throw new NotFound(json.errors[0].message);
    // Organisations can refuse some tokens (e.g. a fine-grained token that lives too long).
    if (json.errors.some((e) => e.type === 'FORBIDDEN')) {
      const owner = variables.owner ?? variables.login ?? '';
      throw new NotFound(`GitHub does not let this server read ${owner}`.trim());
    }
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

// ---------- owner: repositories, stars, languages ----------

const OWNER_Q = `query($login: String!, $after: String) {
  repositoryOwner(login: $login) {
    __typename login
    ... on User { name createdAt followers { totalCount }
      pullRequests { totalCount }
      openIssues: issues(states: OPEN) { totalCount }
      closedIssues: issues(states: CLOSED) { totalCount }
      repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { totalCount } }
    ... on Organization { name createdAt }
    repositories(first: 100, after: $after, privacy: PUBLIC, ownerAffiliations: OWNER, isFork: false,
                 orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount pageInfo { hasNextPage endCursor }
      nodes { name stargazerCount forkCount isArchived
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
    }
  }
}`;

export function owner(login) {
  login = login.toLowerCase();
  return cache.get(`owner:${login}`, TTL.profile, async () => {
    let after = null, first = null;
    const repos = [];
    for (let page = 0; page < 5; page++) {
      const d = await graphql(OWNER_Q, { login, after });
      if (!d.repositoryOwner) throw new NotFound(`No GitHub user or organization "${login}"`);
      first ??= d.repositoryOwner;
      const r = d.repositoryOwner.repositories;
      repos.push(...r.nodes);
      if (!r.pageInfo.hasNextPage) break;
      after = r.pageInfo.endCursor;
    }
    const o = first;
    return {
      type: o.__typename, login: o.login, name: o.name || o.login, createdAt: o.createdAt,
      followers: o.followers?.totalCount ?? 0,
      prs: o.pullRequests?.totalCount ?? 0,
      issues: (o.openIssues?.totalCount ?? 0) + (o.closedIssues?.totalCount ?? 0),
      contributedTo: o.repositoriesContributedTo?.totalCount ?? 0,
      repoCount: o.repositories.totalCount,
      repos: repos.map((r) => ({
        name: r.name, stars: r.stargazerCount, forks: r.forkCount, archived: r.isArchived,
        langs: r.languages.edges.map((e) => ({ name: e.node.name, color: e.node.color, size: e.size })),
      })),
    };
  });
}

// ---------- contributions by year (commits, streak, activity) ----------

const YEARS_Q = `query($login: String!) { user(login: $login) { createdAt contributionsCollection { contributionYears } } }`;

export function contributions(login) {
  login = login.toLowerCase();
  return cache.get(`contrib:${login}`, TTL.contrib, async () => {
    const y = await graphql(YEARS_Q, { login });
    if (!y.user) throw new NotFound(`No GitHub user "${login}" (streak and activity work for people only)`);
    const years = y.user.contributionsCollection.contributionYears;
    const now = new Date();
    const parts = years.map((year) => {
      const from = `${year}-01-01T00:00:00Z`;
      const to = year === now.getUTCFullYear() ? now.toISOString() : `${year}-12-31T23:59:59Z`;
      return `y${year}: contributionsCollection(from: "${from}", to: "${to}") {
        totalCommitContributions totalPullRequestReviewContributions restrictedContributionsCount
        contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }`;
    });
    const d = await graphql(`query($login: String!) { user(login: $login) { ${parts.join('\n')} } }`, { login });
    let commits = 0, total = 0, reviews = 0;
    const days = new Map();
    for (const year of years) {
      const c = d.user[`y${year}`];
      commits += c.totalCommitContributions;
      reviews += c.totalPullRequestReviewContributions;
      total += c.contributionCalendar.totalContributions;
      for (const w of c.contributionCalendar.weeks) for (const day of w.contributionDays) days.set(day.date, day.contributionCount);
    }
    const sorted = [...days.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    return { commits, reviews, total, days: sorted, createdAt: y.user.createdAt };
  });
}

// ---------- single repository ----------

const REPO_Q = `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name nameWithOwner description stargazerCount forkCount isArchived isTemplate isFork
    primaryLanguage { name color } owner { login }
  }
}`;

export function repository(ownerLogin, name) {
  const key = `repo:${ownerLogin.toLowerCase()}/${name.toLowerCase()}`;
  return cache.get(key, TTL.repo, async () => {
    const d = await graphql(REPO_Q, { owner: ownerLogin, name });
    if (!d.repository) throw new NotFound(`No repository ${ownerLogin}/${name}`);
    const r = d.repository;
    return {
      name: r.name, full: r.nameWithOwner, description: r.description || '', stars: r.stargazerCount,
      forks: r.forkCount, archived: r.isArchived, template: r.isTemplate, fork: r.isFork,
      lang: r.primaryLanguage, owner: r.owner.login,
    };
  });
}

// ---------- PyPI ----------

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
  if (res.status === 404) throw new NotFound(`Not found: ${url}`);
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
  return res.json();
}

export function pypi(pkg) {
  pkg = pkg.toLowerCase();
  return cache.get(`pypi:${pkg}`, TTL.pypi, async () => {
    const old = cache.map.get(`pypi:${pkg}`)?.value;
    const info = await getJson(`https://pypi.org/pypi/${encodeURIComponent(pkg)}/json`);
    let downloads = null;
    try {
      const s = await getJson(`https://pypistats.org/api/packages/${encodeURIComponent(pkg)}/recent`);
      downloads = s.data; // last_day, last_week, last_month
    } catch {
      // pypistats is often rate-limited: keep the last known numbers.
      downloads = old?.downloads ?? null;
    }
    const files = info.urls ?? [];
    return {
      name: info.info.name, version: info.info.version, summary: info.info.summary || '',
      license: info.info.license_expression || (info.info.license?.length < 30 ? info.info.license : '') || '',
      python: info.info.requires_python || '',
      released: files[0]?.upload_time_iso_8601 ?? null,
      downloads,
    };
  });
}
