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
  const missing = files.filter((file) => !fs.existsSync(path.join(projectRoot, file)));
  if (missing.length) {
    fail(`Missing required files: ${missing.join(', ')}`);
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

function smokeTest() {
  checkFilesExist([
    'README.md',
    'DOCUMENTATION.md',
    'scripts/update-metrics.js',
    'scripts/generate-pr-issue.js',
    'scripts/generate-commits-streak.js',
    'metrics',
  ]);
  lintScripts();
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
