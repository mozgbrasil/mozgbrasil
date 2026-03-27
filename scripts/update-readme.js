const fs = require('node:fs');
const path = require('node:path');

const readmePath = path.join(__dirname, '..', 'README.md');
const startMarker = '<!-- profile-metrics:start -->';
const endMarker = '<!-- profile-metrics:end -->';

function buildManagedBlock() {
  return [
    startMarker,
    '- Metrics assets: `metrics/pr_issue_chart.svg`, `metrics/commits_3d_live.svg`, `metrics/streak_3d_live.svg`',
    '- Metrics manifest: `metrics/manifest.json`',
    endMarker,
  ].join('\n');
}

function updateReadme(options = {}) {
  const apply = options.apply === true;
  const readme = fs.readFileSync(readmePath, 'utf8');
  const hasManagedBlock =
    readme.includes(startMarker) && readme.includes(endMarker);

  if (!hasManagedBlock) {
    return {
      status: 'noop',
      changed: false,
      detail: 'No managed metrics block found in README.md.',
    };
  }

  const nextReadme = readme.replace(
    new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'm'),
    buildManagedBlock(),
  );
  const changed = nextReadme !== readme;

  if (apply && changed) {
    fs.writeFileSync(readmePath, nextReadme, 'utf8');
  }

  return {
    status: changed ? (apply ? 'updated' : 'drift') : 'ready',
    changed,
    detail: changed
      ? apply
        ? 'Managed metrics block updated.'
        : 'Managed metrics block is out of sync.'
      : 'Managed metrics block already in sync.',
  };
}

function main() {
  const apply = process.argv.includes('--apply');
  const result = updateReadme({ apply });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status === 'drift' && !apply) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateReadme,
};
