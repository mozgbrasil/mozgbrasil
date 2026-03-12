const path = require('path');

const fs = require('fs');
const axios = require('axios');
const { execSync } = require('child_process');

const user = 'mozgbrasil';
const repo = 'mozgbrasil';

// garante caminho relativo ao script
const outputDir = path.join(__dirname, '..', 'metrics');
const outputSVG = path.join(outputDir, 'pr_issue_chart.svg');

// cria a pasta se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchPRsAndIssues() {
  const prs = await axios.get(
    `https://api.github.com/repos/${user}/${repo}/pulls?state=all`,
  );
  const issues = await axios.get(
    `https://api.github.com/repos/${user}/${repo}/issues?state=all`,
  );
  return { prs: prs.data.length, issues: issues.data.length };
}

async function generateSVG(prs, issues) {
  const svg = `
<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { fill: #ff69b4; transition: all 1s; }
    .text { font: bold 18px sans-serif; fill: #000; }
  </style>
  <rect x="50" y="50" width="${prs * 10}" height="40" class="bar"/>
  <text x="50" y="45" class="text">PRs: ${prs}</text>
  <rect x="50" y="120" width="${issues * 5}" height="40" class="bar"/>
  <text x="50" y="115" class="text">Issues: ${issues}</text>
</svg>`;
  fs.writeFileSync(outputSVG, svg);
  console.log('✅ PR/Issue SVG gerado com sucesso!');
}

(async () => {
  try {
    const { prs, issues } = await fetchPRsAndIssues();
    await generateSVG(prs, issues);
  } catch (error) {
    console.error(error);
  }
})();
