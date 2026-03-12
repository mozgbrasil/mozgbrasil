// Gamificação dinâmica de badges
const badges = [
  { name: 'Productivity Master', emoji: '💪', color: 'brightgreen' },
  { name: 'Top Repo Hero', emoji: '🚀', color: 'blue' },
  { name: 'All Systems Green', emoji: '✅', color: 'green' },
  { name: 'API Master', emoji: '👨‍💻', color: 'yellow' },
  { name: 'Fullstack Guru', emoji: '🧩', color: 'orange' },
  { name: 'Open Source Contributor', emoji: '🌟', color: 'blueviolet' },
  { name: 'Hyper Dev', emoji: '💡', color: 'red' },
  { name: 'Career Legend', emoji: '🌐', color: 'pink' },
  { name: 'Commit Legend', emoji: '🔥', color: 'ff4500' },
  { name: 'Issue Hero', emoji: '📌', color: '00bfff' },
  { name: 'PR Master', emoji: '✍️', color: 'ff69b4' },
];

const badgesGrid = document.querySelector('.badges-grid');

badges.forEach((badge, i) => {
  const span = document.createElement('span');
  span.textContent = `${badge.emoji} ${badge.name}`;
  span.style.backgroundColor = badge.color;
  span.style.color = '#fff';
  span.style.padding = '0.3rem 0.6rem';
  span.style.borderRadius = '0.5rem';
  span.style.opacity = 0;
  span.style.margin = '0.2rem';
  span.style.transition = 'opacity 0.5s, transform 0.5s';
  badgesGrid.appendChild(span);

  setTimeout(() => {
    span.style.opacity = 1;
    span.style.transform = 'scale(1)';
  }, i * 200);
});
