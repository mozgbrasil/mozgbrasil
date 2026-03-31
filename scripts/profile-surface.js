const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const projectRoot = path.join(__dirname, '..');
const readmePath = path.join(projectRoot, 'README.md');
const documentationPath = path.join(projectRoot, 'DOCUMENTATION.md');
const agentsPath = path.join(projectRoot, 'AGENTS.md');
const claudePath = path.join(projectRoot, 'CLAUDE.md');

const requiredFiles = [
  'README.md',
  'DOCUMENTATION.md',
  'AGENTS.md',
  'CLAUDE.md',
  'scripts/profile-surface.js',
  'scripts/update-metrics.js',
  'scripts/generate-pr-issue.js',
  'scripts/generate-commits-streak.js',
  'metrics',
];

const requiredSections = [
  'O que eu construo',
  'Skills em foco',
  'Ecossistema digital',
  'Canais públicos',
  'Confiança pública',
  'Perfis públicos oficiais',
  'Ecossistema mobile',
];

const requiredPublicUrls = [
  'https://mozg.com.br/',
  'https://mozgbrasil.github.io/',
  'https://mozg.com.br/portfolio',
  'https://mozg.com.br/contato',
  'https://mozg.com.br/finalizar-compra',
  'https://github.com/mozgbrasil',
  'https://mozg.com.br/politica-de-devolucao',
  'https://br.trustpilot.com/review/mozg.com.br',
  'https://brasilparticipativo.presidencia.gov.br/profiles/mozgbrasil/activity',
];

const requiredContactUrls = [
  'mailto:mozgbrasil@gmail.com',
  'https://www.linkedin.com/in/mozgbrasil/',
];

function parseArgs(argv) {
  const args = {
    view: 'surface',
    format: 'json',
    category: null,
    host: null,
    search: null,
    section: null,
    status: null,
    limit: null,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, rawValue = 'true'] = arg.slice(2).split('=');
    const value = rawValue.trim();

    if (key === 'view') args.view = value;
    if (key === 'format') args.format = value;
    if (key === 'category') args.category = value;
    if (key === 'host') args.host = value;
    if (key === 'search') args.search = value;
    if (key === 'section') args.section = value;
    if (key === 'status') args.status = value;
    if (key === 'limit') {
      const parsed = Number.parseInt(value, 10);
      args.limit = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
  }

  return args;
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function buildRequestMeta(args) {
  const requestId =
    process.env.PROFILE_SURFACE_REQUEST_ID ||
    `github-profile-${crypto.randomUUID().slice(0, 12)}`;
  const timestamp =
    process.env.PROFILE_SURFACE_TIMESTAMP || new Date().toISOString();

  return {
    request_id: requestId,
    x_request_timestamp: timestamp,
    x_request_path:
      process.env.PROFILE_SURFACE_PATH || `/${args.view || 'surface'}`,
    x_request_method: process.env.PROFILE_SURFACE_METHOD || 'READ',
  };
}

function extractSections(readme) {
  const sections = [];
  const regex = /^##\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(readme))) {
    sections.push({
      name: match[1].trim(),
      slug: slugify(match[1]),
    });
  }

  return sections;
}

function categorizeUrl(rawUrl) {
  if (rawUrl.startsWith('mailto:')) {
    return { category: 'contact', host: 'mailto' };
  }

  const url = new URL(rawUrl);
  if (url.hostname === 'mozg.com.br') {
    return {
      category: url.pathname.startsWith('/projetos/') ? 'dossier' : 'website',
      host: url.hostname,
    };
  }
  if (url.hostname === 'mozgbrasil.github.io') {
    return {
      category: url.pathname.includes('storybook') ? 'storybook' : 'portal',
      host: url.hostname,
    };
  }
  if (url.hostname === 'github.com') {
    return {
      category: url.pathname.startsWith('/sponsors/') ? 'sponsors' : 'github',
      host: url.hostname,
    };
  }
  if (url.hostname === 'play.google.com') {
    return { category: 'mobile', host: url.hostname };
  }
  if (url.hostname === 'developers.google.com') {
    return { category: 'developer-profile', host: url.hostname };
  }
  if (url.hostname === 'openprofile.dev') {
    return { category: 'profile', host: url.hostname };
  }
  if (url.hostname === 'bsky.app') {
    return { category: 'social', host: url.hostname };
  }
  if (url.hostname === 'www.linkedin.com') {
    return { category: 'social', host: url.hostname };
  }
  if (url.hostname === 'br.trustpilot.com') {
    return { category: 'trust', host: url.hostname };
  }
  if (url.hostname === 'brasilparticipativo.presidencia.gov.br') {
    return { category: 'civic', host: url.hostname };
  }
  if (url.hostname === 'www.npmjs.com') {
    return { category: 'package', host: url.hostname };
  }
  if (url.hostname === 'packagist.org') {
    return { category: 'package', host: url.hostname };
  }

  return { category: 'external', host: url.hostname };
}

function extractLinks(readme, sections) {
  const entries = [];
  const markdownLinkRegex =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)]+)\)/g;
  const autolinkRegex = /<((?:https?:\/\/|mailto:)[^>]+)>/g;
  const byUrl = new Map();

  function currentSection(position) {
    let active = 'root';
    for (const section of sections) {
      const marker = `## ${section.name}`;
      const index = readme.indexOf(marker);
      if (index !== -1 && index <= position) {
        active = section.name;
      }
    }
    return active;
  }

  let match;
  while ((match = markdownLinkRegex.exec(readme))) {
    const label = match[1].trim();
    const url = match[2].trim();
    byUrl.set(url, {
      label,
      url,
      section: currentSection(match.index),
    });
  }

  while ((match = autolinkRegex.exec(readme))) {
    const url = match[1].trim();
    if (!byUrl.has(url)) {
      byUrl.set(url, {
        label: url,
        url,
        section: currentSection(match.index),
      });
    }
  }

  for (const item of byUrl.values()) {
    const details = categorizeUrl(item.url);
    entries.push({
      ...item,
      ...details,
      section_slug: slugify(item.section),
    });
  }

  return entries.sort((left, right) => left.url.localeCompare(right.url));
}

function buildReadiness(sections, links) {
  const checks = [];
  const agentsEqual = readText(agentsPath) === readText(claudePath);
  const fileMissing = requiredFiles.filter(
    (file) => !fs.existsSync(path.join(projectRoot, file)),
  );
  const sectionNames = new Set(sections.map((section) => section.name));
  const presentUrls = new Set(links.map((link) => link.url));
  const missingSections = requiredSections.filter(
    (section) => !sectionNames.has(section),
  );
  const missingPublicUrls = requiredPublicUrls.filter(
    (url) => !presentUrls.has(url),
  );
  const missingContactUrls = requiredContactUrls.filter(
    (url) => !presentUrls.has(url),
  );

  checks.push({
    name: 'required-files',
    status: fileMissing.length === 0 ? 'ready' : 'attention',
    detail:
      fileMissing.length === 0
        ? 'all required files and directories are present'
        : `missing: ${fileMissing.join(', ')}`,
  });
  checks.push({
    name: 'agents-parity',
    status: agentsEqual ? 'ready' : 'attention',
    detail: agentsEqual
      ? 'AGENTS.md and CLAUDE.md remain equivalent'
      : 'AGENTS.md and CLAUDE.md diverged',
  });
  checks.push({
    name: 'required-sections',
    status: missingSections.length === 0 ? 'ready' : 'attention',
    detail:
      missingSections.length === 0
        ? 'required editorial sections are present'
        : `missing: ${missingSections.join(', ')}`,
  });
  checks.push({
    name: 'public-surfaces',
    status: missingPublicUrls.length === 0 ? 'ready' : 'attention',
    detail:
      missingPublicUrls.length === 0
        ? 'required public surface URLs are present'
        : `missing: ${missingPublicUrls.join(', ')}`,
  });
  checks.push({
    name: 'contact-surface',
    status: missingContactUrls.length === 0 ? 'ready' : 'attention',
    detail:
      missingContactUrls.length === 0
        ? 'contact surface URLs are present'
        : `missing: ${missingContactUrls.join(', ')}`,
  });

  const status = checks.every((check) => check.status === 'ready')
    ? 'ready'
    : 'attention';

  return {
    status,
    endpoint: '/ready',
    checked_at: new Date().toISOString(),
    checks,
  };
}

function buildSnapshot(args) {
  const readme = readText(readmePath);
  const sections = extractSections(readme);
  const links = extractLinks(readme, sections);
  const readiness = buildReadiness(sections, links);
  const request = buildRequestMeta(args);
  const categories = [...new Set(links.map((link) => link.category))].sort();
  const hosts = [...new Set(links.map((link) => link.host))].sort();

  return {
    request,
    surface: {
      name: 'github-profile',
      kind: 'editorial-profile',
      runtime: 'nodejs',
      public_urls: links.map((link) => link.url),
      supported_filters: [
        'category',
        'host',
        'section',
        'search',
        'limit',
        'status',
      ],
      export_formats: ['json', 'md', 'ndjson'],
      readiness_path: '/ready',
    },
    query: {
      view: args.view,
      category: args.category,
      host: args.host,
      search: args.search,
      section: args.section,
      status: args.status,
      limit: args.limit,
    },
    sections,
    links,
    readiness,
    summary: {
      sections_total: sections.length,
      public_urls_total: links.length,
      categories,
      hosts,
      readiness_status: readiness.status,
    },
  };
}

function applySearch(values, search, fields) {
  if (!search) return values;
  const term = search.toLowerCase();
  return values.filter((entry) =>
    fields.some((field) =>
      String(entry[field] || '')
        .toLowerCase()
        .includes(term),
    ),
  );
}

function withLimit(values, limit) {
  return limit ? values.slice(0, limit) : values;
}

function buildView(snapshot, args) {
  if (args.view === 'surface') {
    return snapshot;
  }

  if (args.view === 'links') {
    let items = [...snapshot.links];
    if (args.category)
      items = items.filter((entry) => entry.category === args.category);
    if (args.host) items = items.filter((entry) => entry.host === args.host);
    if (args.section) {
      const sectionSlug = slugify(args.section);
      items = items.filter((entry) => entry.section_slug === sectionSlug);
    }
    items = applySearch(items, args.search, [
      'label',
      'url',
      'section',
      'category',
      'host',
    ]);
    items = withLimit(items, args.limit);
    return {
      request: snapshot.request,
      query: snapshot.query,
      items_total: items.length,
      items,
    };
  }

  if (args.view === 'sections') {
    let items = [...snapshot.sections];
    items = applySearch(items, args.search, ['name', 'slug']);
    items = withLimit(items, args.limit);
    return {
      request: snapshot.request,
      query: snapshot.query,
      items_total: items.length,
      items,
    };
  }

  if (args.view === 'readiness') {
    let checks = [...snapshot.readiness.checks];
    if (args.status)
      checks = checks.filter((check) => check.status === args.status);
    checks = applySearch(checks, args.search, ['name', 'status', 'detail']);
    checks = withLimit(checks, args.limit);
    return {
      request: snapshot.request,
      status: snapshot.readiness.status,
      endpoint: snapshot.readiness.endpoint,
      checked_at: snapshot.readiness.checked_at,
      query: snapshot.query,
      checks_total: checks.length,
      checks,
    };
  }

  throw new Error(
    `Unsupported view "${args.view}". Use surface, links, sections or readiness.`,
  );
}

function toMarkdown(view, payload) {
  if (view === 'surface') {
    return [
      '# GitHub Profile Surface',
      '',
      `- request_id: ${payload.request.request_id}`,
      `- x_request_timestamp: ${payload.request.x_request_timestamp}`,
      `- x_request_path: ${payload.request.x_request_path}`,
      `- x_request_method: ${payload.request.x_request_method}`,
      `- readiness_path: ${payload.surface.readiness_path}`,
      `- readiness_status: ${payload.summary.readiness_status}`,
      `- public_urls_total: ${payload.summary.public_urls_total}`,
      `- sections_total: ${payload.summary.sections_total}`,
      '',
      '## Supported Filters',
      ...payload.surface.supported_filters.map((entry) => `- ${entry}`),
      '',
      '## Export Formats',
      ...payload.surface.export_formats.map((entry) => `- ${entry}`),
      '',
      '## Public URLs',
      ...payload.links.map(
        (entry) => `- [${entry.label}](${entry.url}) (${entry.category})`,
      ),
    ].join('\n');
  }

  if (view === 'links') {
    return [
      '# GitHub Profile Links',
      '',
      `- items_total: ${payload.items_total}`,
      '',
      '## Items',
      ...payload.items.map(
        (entry) =>
          `- [${entry.label}](${entry.url}) | category=${entry.category} | host=${entry.host} | section=${entry.section}`,
      ),
    ].join('\n');
  }

  if (view === 'sections') {
    return [
      '# GitHub Profile Sections',
      '',
      `- items_total: ${payload.items_total}`,
      '',
      '## Items',
      ...payload.items.map((entry) => `- ${entry.name} (${entry.slug})`),
    ].join('\n');
  }

  return [
    '# GitHub Profile Readiness',
    '',
    `- status: ${payload.status}`,
    `- endpoint: ${payload.endpoint}`,
    `- checks_total: ${payload.checks_total}`,
    '',
    '## Checks',
    ...payload.checks.map(
      (entry) => `- ${entry.name}: ${entry.status} | detail=${entry.detail}`,
    ),
  ].join('\n');
}

function toNdjson(view, payload) {
  let items = [payload];
  if (view === 'links' || view === 'sections') items = payload.items;
  if (view === 'readiness') items = payload.checks;
  return items.map((entry) => JSON.stringify(entry)).join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshot = buildSnapshot(args);
  const payload = buildView(snapshot, args);

  if (args.format === 'json') {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  if (args.format === 'md') {
    process.stdout.write(`${toMarkdown(args.view, payload)}\n`);
    return;
  }

  if (args.format === 'ndjson') {
    process.stdout.write(`${toNdjson(args.view, payload)}\n`);
    return;
  }

  throw new Error(
    `Unsupported format "${args.format}". Use json, md or ndjson.`,
  );
}

main();
