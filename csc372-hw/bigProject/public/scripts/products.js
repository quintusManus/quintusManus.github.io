// public/scripts/products.js
// public/scripts/products.js
document.addEventListener('DOMContentLoaded', () => {
  // Helper: resolve image URLs
  function imagePath(p) {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return p.startsWith('/') ? p : '/' + p;
  }
  // Helper: placeholder image via Canvas
  function placeholderDataURL(text, width = 200, height = 150) {
    const cn = document.createElement('canvas'); cn.width = width; cn.height = height;
    const ctx = cn.getContext('2d');
    ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#666'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = Math.max(12, Math.floor(width / 10));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, width / 2, height / 2, width - 10);
    return cn.toDataURL('image/png');
  }
  const productList = document.querySelector('.product-list');
  const sortSelect = document.getElementById('sort');
  let productsData = [];
  // Read optional 'category' parameter
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');

  // Populate category dropdown and handle selection
  const categorySelect = document.getElementById('category');
  if (categorySelect) {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        // build options
        categorySelect.innerHTML = '<option value="">All</option>';
        categories.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name;
          categorySelect.appendChild(opt);
        });
        // set current category
        if (categoryParam) categorySelect.value = categoryParam;
        // on change, reload with new category filter
        categorySelect.addEventListener('change', () => {
          const cid = categorySelect.value;
          const newUrl = window.location.pathname + (cid ? '?category=' + cid : '');
          window.location.href = newUrl;
        });
      })
      .catch(err => console.error('Error fetching categories:', err));
  }

  // Determine API URL: search overrides category
  let fetchUrl = '/api/products';
  if (searchParam) {
    fetchUrl = `/api/products/search?q=${encodeURIComponent(searchParam)}`;
    console.log('Searching products with:', searchParam);
  } else if (categoryParam) {
    // no-op: we fetch all then filter client-side
    console.log('Will filter products for category:', categoryParam);
  }
  // Fetch products from server
  fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
      productsData = data;
      console.log(`Loaded ${productsData.length} products from ${fetchUrl}`);
      let toDisplay = productsData;
      // client-side filter by category if no search applied
      if (!searchParam && categoryParam) {
        toDisplay = productsData.filter(p => p.category_id === Number(categoryParam));
        console.log(`Filtered to ${toDisplay.length} products for category ${categoryParam}`);
      }
      renderProducts(toDisplay);
    })
    .catch(err => console.error('Error fetching products:', err));
  function renderProducts(products) {
    if (!productList) return;
    productList.innerHTML = '';
    products.forEach(p => {
      const article = document.createElement('article');
      article.className = 'product-item';
      const img = document.createElement('img');
      img.alt = p.name;
      img.onerror = () => { img.onerror = null; img.src = placeholderDataURL(p.name, 400, 300); };
      img.src = imagePath(p.image_url);
      article.appendChild(img);
      const h3 = document.createElement('h3'); h3.textContent = p.name; article.appendChild(h3);
      const priceP = document.createElement('p'); priceP.textContent = `$${p.price.toFixed(2)}`; article.appendChild(priceP);
      const link = document.createElement('a'); link.textContent = 'View Details'; link.href = `details.html?id=${p.id}`; article.appendChild(link);
      productList.appendChild(article);
    });
  }
  // Initialize: bind sort change and load products
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      // apply category filter first
      let sorted = categoryParam
        ? productsData.filter(p => p.category_id === Number(categoryParam))
        : productsData.slice();
      if (val === 'price-asc') sorted.sort((a, b) => a.price - b.price);
      else if (val === 'price-desc') sorted.sort((a, b) => b.price - a.price);
      else if (val === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
      renderProducts(sorted);
    });
  }
});