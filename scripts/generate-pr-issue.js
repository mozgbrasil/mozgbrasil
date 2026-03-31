const path = require('node:path');

const {
  createGithubRequestConfig,
  createRequestContext,
  ensureMetricsDir,
  metricsDir,
  parseCliArgs,
  recordArtifact,
} = require('./metrics-runtime');

const user = 'mozgbrasil';
const repo = 'mozgbrasil';

async function fetchPRsAndIssues() {
  const axios = require('axios');
  const pullsUrl = `https://api.github.com/repos/${user}/${repo}/pulls?state=all`;
  const issuesUrl = `https://api.github.com/repos/${user}/${repo}/issues?state=all`;
  const [pullsResponse, issuesResponse] = await Promise.all([
    axios.get(pullsUrl, createGithubRequestConfig('pull-issue-metrics')),
    axios.get(issuesUrl, createGithubRequestConfig('pull-issue-metrics')),
  ]);
  return {
    prs: pullsResponse.data.length,
    issues: issuesResponse.data.length,
  };
}

function generateSVG(prs, issues) {
  return `
<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { fill: #ff69b4; transition: all 1s; }
    .text { font: bold 18px sans-serif; fill: #000; }
  </style>
  <rect x="50" y="50" width="${prs * 10}" height="40" class="bar"/>
  <text x="50" y="45" class="text">PRs: ${prs}</text>
  <rect x="50" y="120" width="${issues * 5}" height="40" class="bar"/>
  <text x="50" y="115" class="text">Issues: ${issues}</text>
</svg>`.trimStart();
}

async function generatePullIssueMetrics(options = {}) {
  const dryRun = options.dryRun === true;
  const request = options.request || createRequestContext('pr-issue');
  ensureMetricsDir();

  const outputSvgPath = path.join(metricsDir, 'pr_issue_chart.svg');

  if (dryRun) {
    return {
      name: 'pr-issue',
      status: 'planned',
      request,
      dry_run: true,
      counts: {
        prs: 0,
        issues: 0,
      },
      produced_files: [
        recordArtifact(outputSvgPath, generateSVG(0, 0), { dryRun }),
      ],
    };
  }

  const { prs, issues } = await fetchPRsAndIssues();
  return {
    name: 'pr-issue',
    status: 'ready',
    request,
    dry_run: false,
    counts: {
      prs,
      issues,
    },
    produced_files: [recordArtifact(outputSvgPath, generateSVG(prs, issues))],
  };
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const result = await generatePullIssueMetrics(args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  generatePullIssueMetrics,
};
