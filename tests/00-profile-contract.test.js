const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function runSurface(args = []) {
  return cp.execFileSync(
    process.execPath,
    ['scripts/profile-surface.js', ...args],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    },
  );
}

test('README keeps public profile sections and links', () => {
  const readme = readProjectFile('README.md');

  for (const snippet of [
    '## O que eu construo',
    '## Skills em foco',
    '## Ecossistema digital',
    '## Canais públicos',
    '## Confiança pública',
    '## Perfis públicos oficiais',
    'https://mozg.com.br/',
    'https://mozgbrasil.github.io/',
    'https://bsky.app/profile/mozgbrasil.bsky.social',
    'https://github.com/sponsors/mozgbrasil',
    'https://developers.google.com/profile/u/mozgbrasil',
    'https://openprofile.dev/profile/mozgbrasil',
    'https://mozg.com.br/portfolio',
    'https://mozg.com.br/contato',
    'https://mozg.com.br/finalizar-compra',
    'https://mozg.com.br/politica-de-devolucao',
    'https://br.trustpilot.com/review/mozg.com.br',
    'https://brasilparticipativo.presidencia.gov.br/profiles/mozgbrasil/activity',
    '07.361.259/0001-07',
    'npm run surface:json',
    'api_version',
    'audit_headers',
  ]) {
    assert.match(
      readme,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('documentation keeps local commands and test contract', () => {
  const documentation = readProjectFile('DOCUMENTATION.md');

  for (const snippet of [
    '## Estrutura real do projeto',
    '## Comandos locais',
    '## Snapshot local para manutenção',
    'npm test',
    'bash scripts/build.sh',
    'tests/00-profile-contract.test.js',
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
    'api_version',
    'audit_headers',
    'supported_filters',
    'surface:links:ndjson',
    '/ready',
  ]) {
    assert.match(
      documentation,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('profile surface snapshot keeps request metadata contract', () => {
  const snapshot = JSON.parse(runSurface(['--format=json']));

  assert.ok(snapshot.request.request_id.startsWith('github-profile-'));
  assert.equal(snapshot.request.api_version, '2026.03');
  assert.equal(snapshot.request.x_request_path, '/surface');
  assert.equal(snapshot.request.x_request_method, 'READ');
  assert.equal(snapshot.surface.api_version, '2026.03');
  assert.ok(snapshot.surface.audit_headers.includes('request_id'));
  assert.ok(snapshot.surface.audit_headers.includes('api_version'));
  assert.equal(snapshot.surface.readiness_path, '/ready');
  assert.equal(snapshot.readiness.status, 'ready');
  assert.ok(snapshot.surface.supported_filters.includes('category'));
  assert.ok(snapshot.surface.export_formats.includes('ndjson'));
  assert.ok(snapshot.summary.public_urls_total >= 14);
});

test('profile surface links view supports filters and ndjson exports', () => {
  const output = runSurface([
    '--view=links',
    '--format=ndjson',
    '--category=website',
    '--limit=2',
  ]).trim();

  const items = output.split('\n').map((line) => JSON.parse(line));

  assert.ok(items.length >= 1);
  assert.ok(items.length <= 2);
  for (const item of items) {
    assert.equal(item.category, 'website');
    assert.equal(item.host, 'mozg.com.br');
  }
});

test('profile surface links expose trust surfaces', () => {
  const payload = JSON.parse(
    runSurface(['--view=links', '--format=json', '--category=trust']),
  );

  assert.ok(payload.items_total >= 1);
  assert.ok(
    payload.items.some(
      (item) => item.url === 'https://br.trustpilot.com/review/mozg.com.br',
    ),
  );
});

test('profile surface readiness view reports operational checks', () => {
  const readiness = JSON.parse(
    runSurface(['--view=readiness', '--format=json', '--status=ready']),
  );

  assert.equal(readiness.status, 'ready');
  assert.equal(readiness.endpoint, '/ready');
  assert.ok(readiness.checks_total >= 5);
  assert.ok(readiness.checks.every((check) => check.status === 'ready'));
  assert.ok(
    readiness.checks.some((check) => check.name === 'surface-contract'),
  );
});

test('package metadata points only to public support surfaces', () => {
  const pkg = JSON.parse(readProjectFile('package.json'));

  assert.equal(pkg.homepage, 'https://github.com/mozgbrasil');
  assert.equal(pkg.bugs?.email, 'mozgbrasil@gmail.com');
  assert.equal(pkg.bugs?.url, 'https://mozg.com.br/contato');
  assert.doesNotMatch(
    JSON.stringify(pkg),
    /github\.com\/mozgbrasil\/monorepo/i,
  );
});

test('metrics dry-run returns a planned manifest without mutating files', () => {
  const manifest = JSON.parse(
    cp.execFileSync(
      process.execPath,
      ['scripts/update-metrics.js', '--dry-run'],
      {
        cwd: projectRoot,
        encoding: 'utf8',
      },
    ),
  );

  assert.equal(manifest.status, 'planned');
  assert.equal(manifest.dry_run, true);
  assert.ok(manifest.request.request_id.startsWith('github-profile-metrics-'));
  assert.ok(
    manifest.artifacts.some(
      (entry) => entry.path === 'metrics/pr_issue_chart.svg',
    ),
  );
  assert.ok(
    manifest.artifacts.some(
      (entry) => entry.path === 'metrics/commits_3d_live.svg',
    ),
  );
  assert.ok(
    manifest.artifacts.some(
      (entry) => entry.path === 'metrics/streak_3d_live.svg',
    ),
  );
});

test('build script executes the documented phases', () => {
  const buildScript = readProjectFile('scripts/build.sh');

  for (const snippet of [
    'format-only',
    'lint-only',
    'test-only',
    'surface-only',
    'ready-only',
    'npm run format:check',
    'npm run lint',
    'npm test',
    'npm run surface:json',
    'npm run surface:ready',
  ]) {
    assert.match(
      buildScript,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});
