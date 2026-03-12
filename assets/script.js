// Dark/Light theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light',
  );
});

// Persist theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Basic fade-in animation for dashboards
const dashboards = document.querySelectorAll('.dashboard-item');
dashboards.forEach((el, i) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  setTimeout(() => {
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
  }, i * 200);
});
