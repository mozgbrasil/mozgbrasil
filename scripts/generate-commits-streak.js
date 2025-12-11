const path = require('path');
const fs = require('fs');
const axios = require('axios');

const user = 'mozgbrasil';
const repo = 'mozgbrasil.github.io';

// garante caminho relativo ao script
const outputDir = path.join(__dirname, '..', 'metrics');
const commitsSVG = path.join(outputDir, 'commits_3d_live.svg');
const streakSVG = path.join(outputDir, 'streak_3d_live.svg');

// cria a pasta se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const DAYS = 7; // Últimos 7 dias

async function fetchCommits() {
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://api.github.com/repos/${user}/${repo}/commits?since=${since}&per_page=100`;
  const res = await axios.get(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  return res.data.map((c) => new Date(c.commit.author.date));
}

function aggregateCommitsByDay(dates) {
  const today = new Date();
  let counts = Array(DAYS).fill(0);
  for (let i = 0; i < DAYS; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    counts[DAYS - i - 1] = dates.filter(
      (d) => d.toDateString() === day.toDateString(),
    ).length;
  }
  return counts;
}

function generateCommitsSVG(counts) {
  const heightScale = 2;
  let bars = '';
  for (let i = 0; i < counts.length; i++) {
    const h = counts[i] * heightScale;
    const x = 70 + i * 60;
    const y = 180 - h;
    bars += `<rect x="${x}" y="${y}" width="40" height="${h}" class="bar"/>\n`;
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
  <text x="370" y="195" class="text">Sáb</text>
  <text x="430" y="195" class="text">Dom</text>
</svg>`;
}

function generateStreakSVG(counts) {
  let rects = '';
  for (let i = 0; i < counts.length; i++) {
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
    .day { width: 20px; height: 20px; rx:4; ry:4; transition: fill 0.5s ease; }
    .level1 { fill: #d6e685; animation: pulse 1.5s infinite alternate; }
    .level2 { fill: #8cc665; animation: pulse 1.5s infinite alternate; }
    .level3 { fill: #44a340; animation: pulse 1.5s infinite alternate; }
    .level4 { fill: #1e6823; animation: pulse 1.5s infinite alternate; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
  </style>
  ${rects}
</svg>`;
}

(async () => {
  try {
    const dates = await fetchCommits();
    const counts = aggregateCommitsByDay(dates);

    fs.writeFileSync(commitsSVG, generateCommitsSVG(counts));
    fs.writeFileSync(streakSVG, generateStreakSVG(counts));

    console.log('✅ SVGs de commits e streaks gerados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao gerar SVGs:', err);
  }
})();
