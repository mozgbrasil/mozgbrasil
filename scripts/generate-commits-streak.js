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
const DAYS = 7;

function aggregateCommitsByDay(dates) {
  const today = new Date();
  const counts = Array(DAYS).fill(0);
  for (let i = 0; i < DAYS; i += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    counts[DAYS - i - 1] = dates.filter(
      (entry) => entry.toDateString() === day.toDateString(),
    ).length;
  }
  return counts;
}

function generateCommitsSVG(counts) {
  const heightScale = 2;
  let bars = '';
  for (let i = 0; i < counts.length; i += 1) {
    const height = counts[i] * heightScale;
    const x = 70 + i * 60;
    const y = 180 - height;
    bars += `<rect x="${x}" y="${y}" width="40" height="${height}" class="bar"/>\n`;
  }
  return `
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { fill: #ff69b4; transform-origin: bottom; animation: grow 1.5s ease-in-out; }
    @keyframes grow { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
    .text { font: bold 14px sans-serif; fill: #000; }
  </style>
  <line x1="50" y1="180" x2="550" y2="180" stroke="#ccc" stroke-width="2"/>
  <line x1="50" y1="20" x2="50" y2="180" stroke="#ccc" stroke-width="2"/>
  ${bars}
  <text x="70" y="195" class="text">Seg</text>
  <text x="130" y="195" class="text">Ter</text>
  <text x="190" y="195" class="text">Qua</text>
  <text x="250" y="195" class="text">Qui</text>
  <text x="310" y="195" class="text">Sex</text>
  <text x="370" y="195" class="text">Sab</text>
  <text x="430" y="195" class="text">Dom</text>
</svg>`.trimStart();
}

function generateStreakSVG(counts) {
  let rects = '';
  for (let i = 0; i < counts.length; i += 1) {
    const x = 10 + i * 30;
    const level =
      counts[i] === 0
        ? 'level1'
        : counts[i] < 2
          ? 'level2'
          : counts[i] < 5
            ? 'level3'
            : 'level4';
    rects += `<rect x="${x}" y="10" class="day ${level}"/>`;
  }

  return `
<svg width="600" height="50" xmlns="http://www.w3.org/2000/svg">
  <style>
    .day { width: 20px; height: 20px; rx: 4; ry: 4; transition: fill 0.5s ease; }
    .level1 { fill: #d6e685; animation: pulse 1.5s infinite alternate; }
    .level2 { fill: #8cc665; animation: pulse 1.5s infinite alternate; }
    .level3 { fill: #44a340; animation: pulse 1.5s infinite alternate; }
    .level4 { fill: #1e6823; animation: pulse 1.5s infinite alternate; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
  </style>
  ${rects}
</svg>`.trimStart();
}

async function fetchCommits() {
  const axios = require('axios');
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://api.github.com/repos/${user}/${repo}/commits?since=${since}&per_page=100`;
  const response = await axios.get(
    url,
    createGithubRequestConfig('commits-streak'),
  );
  return response.data.map((entry) => new Date(entry.commit.author.date));
}

async function generateCommitsStreakMetrics(options = {}) {
  const dryRun = options.dryRun === true;
  const request = options.request || createRequestContext('commits-streak');
  ensureMetricsDir();

  const commitsSvgPath = path.join(metricsDir, 'commits_3d_live.svg');
  const streakSvgPath = path.join(metricsDir, 'streak_3d_live.svg');
  const plannedCounts = Array(DAYS).fill(0);

  if (dryRun) {
    const producedFiles = [
      recordArtifact(commitsSvgPath, generateCommitsSVG(plannedCounts), {
        dryRun,
      }),
      recordArtifact(streakSvgPath, generateStreakSVG(plannedCounts), {
        dryRun,
      }),
    ];
    return {
      name: 'commits-streak',
      status: 'planned',
      request,
      dry_run: true,
      counts: {
        days: DAYS,
        total_commits: 0,
      },
      produced_files: producedFiles,
    };
  }

  const dates = await fetchCommits();
  const counts = aggregateCommitsByDay(dates);
  const producedFiles = [
    recordArtifact(commitsSvgPath, generateCommitsSVG(counts)),
    recordArtifact(streakSvgPath, generateStreakSVG(counts)),
  ];

  return {
    name: 'commits-streak',
    status: 'ready',
    request,
    dry_run: false,
    counts: {
      days: DAYS,
      total_commits: counts.reduce((total, value) => total + value, 0),
    },
    produced_files: producedFiles,
  };
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const result = await generateCommitsStreakMetrics(args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  generateCommitsStreakMetrics,
};
