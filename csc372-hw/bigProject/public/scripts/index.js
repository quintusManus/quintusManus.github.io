// public/scripts/index.js
document.addEventListener('DOMContentLoaded', () => {
  // Helper to resolve image URLs to public/images
  function imagePath(p) {
    if (!p) return '';
    // Absolute URL?
    if (/^https?:\/\//i.test(p)) return p;
    // Already starts with slash?
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
  // Search form redirect
  const searchForm = document.querySelector('#search form');
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchForm.querySelector('input[name="search"]').value.trim();
      if (q) {
        window.location.href = `products.html?search=${encodeURIComponent(q)}`;
      }
    });
  }
  // Featured products
  const featuredContainer = document.querySelector('#featured-products .product-list');
  if (featuredContainer) {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        console.log('Fetched featured products:', products);
        const featured = products.slice(0, 3);
        featuredContainer.innerHTML = '';
        featured.forEach(p => {
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
          featuredContainer.appendChild(article);
        });
      })
      .catch(err => console.error('Error fetching featured products:', err));
  }
  // Random advice via external API
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  if (quoteText && quoteAuthor) {
    fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched advice:', data);
        quoteText.textContent = `"${data.slip.advice}"`;
        quoteAuthor.textContent = `— Advice #${data.slip.id}`;
      })
      .catch(err => {
        console.error('Error fetching advice:', err);
        quoteText.textContent = 'Could not load advice.';
        quoteAuthor.textContent = '';
      });
  }
});