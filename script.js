const items = [
    { name: 'The Everyday Shirt', type: 'Clothing · Relaxed fit', price: 'Rs. 3,490', tag: 'NEW', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
    { name: 'Weekend Runner', type: 'Shoes · Sand / white', price: 'Rs. 6,990', tag: 'JUST IN', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Daily Classic', type: 'Watch · Stainless steel', price: 'Rs. 8,490', tag: 'NEW', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { name: 'Soft Form Knit', type: 'Clothing · Easy layer', price: 'Rs. 4,290', tag: 'JUST IN', image: 'https://images.unsplash.com/photo-1551027119-0f0b3fbcf003?auto=format&fit=crop&w=800&q=80' }
];
document.querySelector('#products').innerHTML = items.map(item => `<article class="product"><div class="product-image" style="background-image:url('${item.image}')"><span class="pill">${item.tag}</span></div><div class="product-meta"><span>${item.name}<br><small>${item.type}</small></span><strong>${item.price}</strong></div></article>`).join('');
document.querySelector('#menuToggle').addEventListener('click', () => document.querySelector('#nav').classList.toggle('open'));
document.querySelector('#year').textContent = new Date().getFullYear();
const themeButton = document.querySelector('#themeToggle');
function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem('ztp-theme', theme); themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); themeButton.querySelector('span').textContent = theme === 'dark' ? 'Light' : 'Dark'; }
setTheme(localStorage.getItem('ztp-theme') || 'light');
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
