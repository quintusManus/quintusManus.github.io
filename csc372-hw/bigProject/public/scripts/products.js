// public/scripts/products.js
document.addEventListener('DOMContentLoaded', () => {
  // Helper to resolve image URLs to public/images
  function imagePath(p) {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return p.startsWith('/') ? p : '/' + p;
  }
  // Helper to generate an inline placeholder PNG via Canvas
  function placeholderDataURL(text, width, height) {
    width = width || 200; height = height || 150;
    const cn = document.createElement('canvas');
    cn.width = width; cn.height = height;
    const ctx = cn.getContext('2d');
    ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#666'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = Math.max(12, Math.floor(width / 10));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, width / 2, height / 2, width - 10);
    return cn.toDataURL('image/png');
  }
  let productsData = [];
  const productList = document.querySelector('.product-list');
  const sortSelect = document.getElementById('sort');

  // Determine fetch URL based on search param
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  const fetchUrl = search
    ? `/api/products/search?q=${encodeURIComponent(search)}`
    : '/api/products';
  fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
      console.log('Products data:', data);
      productsData = data;
      renderProducts(productsData);
    })
    .catch(err => console.error('Error fetching products:', err));

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      let sorted = productsData.slice();
      if (val === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (val === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (val === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      }
      renderProducts(sorted);
    });
  }

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
      const h3 = document.createElement('h3');
      h3.textContent = p.name;
      article.appendChild(h3);
      const priceP = document.createElement('p');
      priceP.textContent = `$${p.price.toFixed(2)}`;
      article.appendChild(priceP);
      const link = document.createElement('a');
      link.textContent = 'View Details';
      link.href = `details.html?id=${p.id}`;
      article.appendChild(link);
      productList.appendChild(article);
    });
  }
});