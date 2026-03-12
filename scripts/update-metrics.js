const { execSync } = require('child_process');

function generateMetrics() {
  console.log('🚀 Generating PR & Issue metrics...');
  execSync('node generate-pr-issue.js', { cwd: __dirname, stdio: 'inherit' });

  console.log('💻 Generating commit streak metrics...');
  execSync('node generate-commits-streak.js', {
    cwd: __dirname,
    stdio: 'inherit',
  });

  // console.log('📝 Updating README...');
  // execSync('node update-readme.js', { cwd: __dirname, stdio: 'inherit' });

  console.log('✅ Metrics & README updated successfully.');
}

generateMetrics();
