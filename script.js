const defaultItems = [
    { name: 'The Everyday Shirt', category: 'Clothing', details: 'Relaxed fit', price: 3490, badge: 'NEW', image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
    { name: 'Weekend Runner', category: 'Shoes', details: 'Sand / white', price: 6990, badge: 'JUST IN', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Daily Classic', category: 'Watch', details: 'Stainless steel', price: 8490, badge: 'NEW', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { name: 'Soft Form Knit', category: 'Clothing', details: 'Easy layer', price: 4290, badge: 'JUST IN', image_url: 'https://images.unsplash.com/photo-1551027119-0f0b3fbcf003?auto=format&fit=crop&w=800&q=80' }
];
const configured = window.ZTP_SUPABASE_URL?.startsWith('https://') && !window.ZTP_SUPABASE_URL.includes('YOUR-PROJECT') && window.ZTP_SUPABASE_KEY && !window.ZTP_SUPABASE_KEY.includes('YOUR-SUPABASE');
const shopClient = configured && window.supabase ? window.supabase.createClient(window.ZTP_SUPABASE_URL, window.ZTP_SUPABASE_KEY) : null;
const money = value => `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;
function renderProducts(items) {
    const root = document.querySelector('#products');
    if (!root) return;
    root.replaceChildren();
    if (!items.length) { root.innerHTML = '<p class="catalog-empty">New products are on their way. Check back soon.</p>'; return; }
    items.forEach(item => {
        const article = document.createElement('article'); article.className = 'product';
        const photo = document.createElement('div'); photo.className = 'product-image'; photo.style.backgroundImage = `url("${String(item.image_url || '').replaceAll('"', '%22')}")`;
        if (item.badge) { const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = item.badge; photo.append(pill); }
        const meta = document.createElement('div'); meta.className = 'product-meta';
        const title = document.createElement('span'); title.textContent = item.name;
        const detail = document.createElement('small'); detail.textContent = `${item.category || ''}${item.details ? ` · ${item.details}` : ''}`; title.append(document.createElement('br'), detail);
        const prices = document.createElement('strong'); prices.className = 'product-prices'; prices.append(document.createTextNode(money(item.price)));
        if (item.compare_at_price && Number(item.compare_at_price) > Number(item.price)) { const old = document.createElement('del'); old.textContent = money(item.compare_at_price); prices.append(old); }
        meta.append(title, prices); article.append(photo, meta); root.append(article);
    });
}
async function loadStoreProducts() {
    if (!shopClient) { renderProducts(defaultItems); return; }
    const { data, error } = await shopClient.from('products').select('id,name,category,details,price,compare_at_price,badge,image_url').eq('active', true).order('created_at', { ascending: false });
    if (error) { console.error('ZTP product catalogue:', error.message); renderProducts(defaultItems); return; }
    renderProducts(data || []);
}
document.querySelector('#menuToggle')?.addEventListener('click', () => document.querySelector('#nav')?.classList.toggle('open'));
const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
loadStoreProducts();
