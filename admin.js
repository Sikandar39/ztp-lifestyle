const adminConfigured = window.ZTP_SUPABASE_URL?.startsWith('https://') && !window.ZTP_SUPABASE_URL.includes('YOUR-PROJECT') && window.ZTP_SUPABASE_KEY && !window.ZTP_SUPABASE_KEY.includes('YOUR-SUPABASE');
const adminClient = adminConfigured && window.supabase ? window.supabase.createClient(window.ZTP_SUPABASE_URL, window.ZTP_SUPABASE_KEY) : null;
const el = id => document.getElementById(id);
const loginCard = el('loginCard'), dashboard = el('dashboard'), loginMessage = el('loginMessage'), formMessage = el('formMessage'), productForm = el('productForm');
let currentAdmin = null, existingProducts = [];
const formatMoney = value => `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;
function message(node, text, kind = '') { node.textContent = text; node.className = `notice ${kind}`.trim(); }
function showAdmin(isAdmin) { loginCard.hidden = isAdmin; dashboard.hidden = !isAdmin; el('logoutButton').hidden = !isAdmin; }
function resetForm() { productForm.reset(); el('productId').value = ''; el('productActive').checked = true; el('formHeading').textContent = 'New product'; el('saveProduct').innerHTML = 'Save product <span>↗</span>'; el('productImage').required = true; el('cancelEdit').hidden = true; message(formMessage, ''); }
function renderAdminProducts(products) {
    const root = el('adminProducts'); root.replaceChildren(); el('productCount').textContent = products.length;
    if (!products.length) { root.innerHTML = '<p class="admin-empty">No products yet. Add your first item using the form.</p>'; return; }
    products.forEach(product => {
        const row = document.createElement('article'); row.className = 'admin-product';
        const image = document.createElement('div'); image.className = 'admin-thumb'; image.style.backgroundImage = `url("${String(product.image_url || '').replaceAll('"', '%22')}")`;
        const info = document.createElement('div'); const title = document.createElement('h4'); title.textContent = product.name;
        const line = document.createElement('p'); line.textContent = `${product.category} · ${formatMoney(product.price)}${product.compare_at_price ? ` (was ${formatMoney(product.compare_at_price)})` : ''}`;
        const status = document.createElement('p'); status.textContent = product.active ? 'Visible on storefront' : 'Hidden from storefront'; info.append(title, line, status);
        const actions = document.createElement('div'); actions.className = 'admin-product-actions';
        const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Edit'; edit.addEventListener('click', () => editProduct(product));
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'delete-button'; remove.textContent = 'Delete'; remove.addEventListener('click', () => deleteProduct(product));
        actions.append(edit, remove); row.append(image, info, actions); root.append(row);
    });
}
async function refreshProducts() {
    message(formMessage, 'Loading catalogue…');
    const { data, error } = await adminClient.from('products').select('*').order('created_at', { ascending: false });
    if (error) { message(formMessage, error.message, 'error'); return; }
    existingProducts = data || []; renderAdminProducts(existingProducts); message(formMessage, 'Catalogue updated.', 'success');
}
async function verifyAdmin(session) {
    if (!session) { currentAdmin = null; showAdmin(false); return; }
    const { data, error } = await adminClient.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle();
    if (error || !data) { await adminClient.auth.signOut(); currentAdmin = null; showAdmin(false); message(loginMessage, 'This account is not on the store admin list. Ask the store owner to grant admin access.', 'error'); return; }
    currentAdmin = session.user; showAdmin(true); await refreshProducts();
}
async function uploadPhoto(file) {
    if (!file) return null;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
    if (file.size > 5 * 1024 * 1024) throw new Error('This image is over 5 MB. Choose a smaller photo.');
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    const path = `${Date.now()}-${safeName}`;
    const { error } = await adminClient.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (error) throw error;
    return adminClient.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}
function editProduct(product) {
    el('productId').value = product.id; el('productName').value = product.name; el('productCategory').value = product.category; el('productBadge').value = product.badge || ''; el('productDetails').value = product.details || ''; el('productPrice').value = product.price; el('productComparePrice').value = product.compare_at_price || ''; el('productActive').checked = product.active; el('productImage').required = false; el('formHeading').textContent = 'Edit product'; el('saveProduct').innerHTML = 'Update product <span>↗</span>'; el('cancelEdit').hidden = false; message(formMessage, 'Choose a new photo only if you want to replace the current one.'); productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function deleteProduct(product) {
    if (!window.confirm(`Delete “${product.name}” from the catalogue?`)) return;
    const { error } = await adminClient.from('products').delete().eq('id', product.id);
    if (error) { message(formMessage, error.message, 'error'); return; }
    const marker = '/storage/v1/object/public/product-images/';
    const index = (product.image_url || '').indexOf(marker);
    if (index >= 0) { const path = decodeURIComponent(product.image_url.slice(index + marker.length)); await adminClient.storage.from('product-images').remove([path]); }
    await refreshProducts(); resetForm();
}
if (!adminClient) { message(loginMessage, 'Connect your Supabase project first. Follow the setup guide included with the website files.', 'error'); el('loginForm').querySelector('button').disabled = true; }
else {
    adminClient.auth.getSession().then(({ data }) => verifyAdmin(data.session));
    adminClient.auth.onAuthStateChange((_event, session) => { setTimeout(() => verifyAdmin(session), 0); });
}
el('loginForm').addEventListener('submit', async event => {
    event.preventDefault(); if (!adminClient) return;
    message(loginMessage, 'Signing in…');
    const { error } = await adminClient.auth.signInWithPassword({ email: el('adminEmail').value.trim(), password: el('adminPassword').value });
    if (error) message(loginMessage, error.message, 'error');
});
productForm.addEventListener('submit', async event => {
    event.preventDefault(); if (!currentAdmin) return;
    const submit = el('saveProduct'); submit.disabled = true; message(formMessage, 'Saving product…');
    try {
        const id = el('productId').value; const previous = existingProducts.find(item => item.id === id); const file = el('productImage').files[0];
        let imageUrl = previous?.image_url || ''; if (file) imageUrl = await uploadPhoto(file); if (!imageUrl) throw new Error('Choose a product photo.');
        const price = Number(el('productPrice').value); const compare = el('productComparePrice').value ? Number(el('productComparePrice').value) : null;
        let badge = el('productBadge').value.trim(); if (!badge && compare && compare > price) badge = `${Math.round((compare - price) / compare * 100)}% OFF`;
        const item = { name: el('productName').value.trim(), category: el('productCategory').value.trim(), details: el('productDetails').value.trim(), price, compare_at_price: compare, badge, image_url: imageUrl, active: el('productActive').checked, updated_at: new Date().toISOString() };
        const result = id ? await adminClient.from('products').update(item).eq('id', id) : await adminClient.from('products').insert(item);
        if (result.error) throw result.error;
        resetForm(); await refreshProducts(); message(formMessage, 'Product saved. It will now appear on the storefront.', 'success');
    } catch (error) { message(formMessage, error.message || 'Could not save this product.', 'error'); }
    finally { submit.disabled = false; }
});
el('cancelEdit').addEventListener('click', resetForm); el('newProductButton').addEventListener('click', () => { resetForm(); productForm.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); el('refreshProducts').addEventListener('click', refreshProducts);
el('logoutButton').addEventListener('click', async () => { await adminClient?.auth.signOut(); showAdmin(false); message(loginMessage, 'You are signed out.'); });
