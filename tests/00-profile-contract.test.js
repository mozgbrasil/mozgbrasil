const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('README keeps public profile sections and links', () => {
  const readme = readProjectFile('README.md');

  for (const snippet of [
    '## O que eu construo',
    '## Skills em foco',
    '## Monorepo poliglota',
    '## Sinais publicos e operacionais',
    '## Perfis publicos oficiais',
    '## Governanca do perfil',
    '## Qualidade local',
    'https://mozg.com.br/',
    'https://mozgbrasil.github.io/',
    'https://bsky.app/profile/mozgbrasil.bsky.social',
    'https://github.com/sponsors/mozgbrasil',
    'https://developers.google.com/profile/u/mozgbrasil',
    'https://openprofile.dev/profile/mozgbrasil',
    'workspace fonte e privado no GitHub',
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
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
    'npm test',
    'bash scripts/build.sh',
    'tests/00-profile-contract.test.js',
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
  ]) {
    assert.match(
      documentation,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('profile surface snapshot keeps request metadata contract', () => {
  const surfaceScript = readProjectFile('scripts/profile-surface.js');

  for (const snippet of [
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
    'github-profile-static-surface',
  ]) {
    assert.match(
      surfaceScript,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('build script executes the documented phases', () => {
  const buildScript = readProjectFile('scripts/build.sh');

  for (const snippet of [
    'format-only',
    'lint-only',
    'test-only',
    'npm run format:check',
    'npm run lint',
    'npm test',
  ]) {
    assert.match(
      buildScript,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});
