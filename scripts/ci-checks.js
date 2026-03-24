const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const projectRoot = path.join(__dirname, '..');
const scriptsDir = path.join(projectRoot, 'scripts');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function checkFilesExist(files) {
  const missing = files.filter(
    (file) => !fs.existsSync(path.join(projectRoot, file)),
  );
  if (missing.length) {
    fail(`Missing required files: ${missing.join(', ')}`);
  }
}

function readProjectFile(file) {
  return fs.readFileSync(path.join(projectRoot, file), 'utf8');
}

function checkEqualFiles(leftFile, rightFile) {
  const left = readProjectFile(leftFile);
  const right = readProjectFile(rightFile);

  if (left !== right) {
    fail(`${leftFile} and ${rightFile} must remain equivalent.`);
  }
}

function checkRequiredSnippets(file, snippets) {
  const content = readProjectFile(file);
  const missing = snippets.filter((snippet) => !content.includes(snippet));

  if (missing.length) {
    fail(`${file} is missing required snippets: ${missing.join(', ')}`);
  }
}

function lintScripts() {
  const scriptFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => path.join(scriptsDir, file));

  if (!scriptFiles.length) {
    fail('No JavaScript files found in scripts/');
  }

  for (const file of scriptFiles) {
    cp.execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  }
  console.log(`Lint passed for ${scriptFiles.length} script file(s).`);
}

function runUnitTests() {
  const testsDir = path.join(projectRoot, 'tests');
  if (!fs.existsSync(testsDir)) {
    fail('Missing tests/ directory.');
  }

  const testFiles = fs
    .readdirSync(testsDir)
    .filter((file) => file.endsWith('.test.js'))
    .sort((left, right) => left.localeCompare(right))
    .map((file) => path.join('tests', file));

  if (!testFiles.length) {
    fail('No .test.js files found in tests/.');
  }

  cp.execFileSync(process.execPath, ['--test', ...testFiles], {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log(`Unit tests passed for ${testFiles.length} file(s).`);
}

function smokeTest() {
  checkFilesExist([
    'README.md',
    'DOCUMENTATION.md',
    'AGENTS.md',
    'CLAUDE.md',
    'scripts/profile-surface.js',
    'scripts/update-metrics.js',
    'scripts/generate-pr-issue.js',
    'scripts/generate-commits-streak.js',
    'metrics',
  ]);
  checkEqualFiles('AGENTS.md', 'CLAUDE.md');
  checkRequiredSnippets('README.md', [
    '## O que eu construo',
    '## Monorepo poliglota',
    '## Sinais publicos e operacionais',
    '## Governanca do perfil',
    'https://mozg.com.br/',
    'https://mozg.com.br/projetos/monorepo',
    'https://mozg.com.br/projetos/node-web-components',
    'https://mozgbrasil.github.io/node-web-components-storybook/?path=/docs/catalog-explorer--docs',
    'https://www.npmjs.com/package/node-web-components',
    'https://mozgbrasil.github.io/',
    'workspace fonte e privado no GitHub',
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
  ]);
  checkRequiredSnippets('DOCUMENTATION.md', [
    '## Estrutura real do projeto',
    '## Comandos locais',
    '## O que os checks validam',
    'projects/mozgbrasil.github.io/index.html',
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
  ]);
  checkRequiredSnippets('scripts/profile-surface.js', [
    'request_id',
    'x_request_timestamp',
    'x_request_path',
    'x_request_method',
  ]);
  lintScripts();
  runUnitTests();
  console.log('Smoke test passed.');
}

function checkFormat() {
  // This project currently stores mostly markdown + utility scripts.
  // CI uses this check to assert baseline consistency without mutating files.
  lintScripts();
  console.log('Format check passed.');
}

const mode = process.argv[2];

if (mode === 'lint') {
  lintScripts();
} else if (mode === 'test') {
  smokeTest();
} else if (mode === 'format') {
  checkFormat();
} else {
  fail(`Unknown mode "${mode}". Use: lint | test | format`);
}
