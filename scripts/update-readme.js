const fs = require('fs');
const path = 'README.md';

function updateReadme() {
  let readme = fs.readFileSync(path, 'utf-8');

  // Atualiza métricas SVG
  // readme = readme.replace(
  //   /<img src="\.\/metrics\/pr_issue_chart\.svg".*?\/>/,
  //   '<img src="./projects/github-profile/metrics/pr_issue_chart.svg" alt="PRs & Issues" />'
  // );

  // readme = readme.replace(
  //   /<img src="\.\/metrics\/commits_3d_live\.svg".*?\/>/,
  //   '<img src="./projects/github-profile/metrics/commits_3d_live.svg" alt="Commits 3D Live" />'
  // );

  // readme = readme.replace(
  //   /<img src="\.\/metrics\/streak_3d_live\.svg".*?\/>/,
  //   '<img src="./projects/github-profile/metrics/streak_3d_live.svg" alt="Heatmap 3D Live" />'
  // );

  // Atualiza insights Hyper AI
  // const insights =
  //   `- 🏆 Última atualização: ${new Date().toLocaleString('pt-BR')}\n` +
  //   '- ⚡ Novas conquistas desbloqueadas!\n' +
  //   '- 📊 Performance de commits, PRs e issues atualizada!';
  // readme = readme.replace(/<pre>.*?<\/pre>/s, `<pre>${insights}</pre>`);

  // fs.writeFileSync(path, readme);
  // console.log('✅ README atualizado com métricas e insights Hyper AI!');
}

updateReadme();
