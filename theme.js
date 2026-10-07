const themeButton = document.querySelector('#themeToggle');
function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem('ztp-theme', theme); if (themeButton) { themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); themeButton.querySelector('span').textContent = theme === 'dark' ? 'Light' : 'Dark'; } }
setTheme(localStorage.getItem('ztp-theme') || 'light');
if (themeButton) themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
