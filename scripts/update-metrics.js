const fs = require('node:fs');
const path = require('node:path');

const {
  buildSourceFingerprint,
  createRequestContext,
  ensureMetricsDir,
  metricsDir,
  parseCliArgs,
} = require('./metrics-runtime');
const { generatePullIssueMetrics } = require('./generate-pr-issue');
const { generateCommitsStreakMetrics } = require('./generate-commits-streak');

async function generateMetrics(options = {}) {
  const dryRun = options.dryRun === true;
  const request = createRequestContext('metrics');
  ensureMetricsDir();

  const [pullIssue, commitsStreak] = await Promise.all([
    generatePullIssueMetrics({ dryRun, request }),
    generateCommitsStreakMetrics({ dryRun, request }),
  ]);

  const manifest = {
    request,
    status: dryRun ? 'planned' : 'ready',
    dry_run: dryRun,
    source_fingerprint: buildSourceFingerprint([
      'scripts/update-metrics.js',
      'scripts/generate-pr-issue.js',
      'scripts/generate-commits-streak.js',
      'scripts/metrics-runtime.js',
    ]),
    artifacts: [...pullIssue.produced_files, ...commitsStreak.produced_files],
    checks: [
      {
        name: pullIssue.name,
        status: pullIssue.status,
        counts: pullIssue.counts,
      },
      {
        name: commitsStreak.name,
        status: commitsStreak.status,
        counts: commitsStreak.counts,
      },
    ],
  };

  if (!dryRun) {
    fs.writeFileSync(
      path.join(metricsDir, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    );
  }

  return manifest;
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const manifest = await generateMetrics(args);
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  generateMetrics,
};
