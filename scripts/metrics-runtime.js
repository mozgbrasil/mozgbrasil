const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const projectRoot = path.join(__dirname, '..');
const metricsDir = path.join(projectRoot, 'metrics');

function parseCliArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
  };
}

function ensureMetricsDir() {
  if (!fs.existsSync(metricsDir)) {
    fs.mkdirSync(metricsDir, { recursive: true });
  }
}

function createRequestContext(action) {
  return {
    request_id: `github-profile-${action}-${crypto.randomUUID().slice(0, 12)}`,
    generated_at: new Date().toISOString(),
    x_request_timestamp: new Date().toISOString(),
    x_request_path: `/metrics/${action}`,
    x_request_method: 'READ',
  };
}

function createGithubRequestConfig(action) {
  return {
    timeout: 10000,
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': `github-profile/${action}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };
}

function relativeToProject(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/');
}

function recordArtifact(filePath, content, options = {}) {
  const { dryRun = false } = options;
  const sizeBytes = Buffer.byteLength(content, 'utf8');
  const artifact = {
    path: relativeToProject(filePath),
    size_bytes: sizeBytes,
    planned: dryRun,
  };

  if (!dryRun) {
    fs.writeFileSync(filePath, content, 'utf8');
    artifact.sha256 = crypto.createHash('sha256').update(content).digest('hex');
  }

  return artifact;
}

function buildSourceFingerprint(relativeFiles) {
  const hash = crypto.createHash('sha256');
  for (const file of relativeFiles) {
    const fullPath = path.join(projectRoot, file);
    if (!fs.existsSync(fullPath)) continue;
    hash.update(file);
    hash.update('\n');
    hash.update(fs.readFileSync(fullPath));
    hash.update('\n');
  }
  return hash.digest('hex');
}

module.exports = {
  createGithubRequestConfig,
  createRequestContext,
  buildSourceFingerprint,
  ensureMetricsDir,
  metricsDir,
  parseCliArgs,
  recordArtifact,
  relativeToProject,
};
