// public/scripts/details.js
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
    const cn = document.createElement('canvas'); cn.width = width; cn.height = height;
    const ctx = cn.getContext('2d');
    ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#666'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = Math.max(12, Math.floor(width / 10)); ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, width / 2, height / 2, width - 10);
    return cn.toDataURL('image/png');
  }
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    console.error('No product id provided');
    return;
  }
  fetch(`/api/products/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    })
    .then(p => {
      console.log('Product details:', p);
      const details = document.querySelector('.product-details');
      if (!details) return;
      const img = details.querySelector('img');
      img.alt = p.name;
      img.onerror = () => { img.onerror = null; img.src = placeholderDataURL(p.name, 400, 300); };
      img.src = imagePath(p.image_url);
      const info = details.querySelector('.product-info');
      info.innerHTML = '';
      const h2 = document.createElement('h2');
      h2.textContent = p.name;
      info.appendChild(h2);
      const descP = document.createElement('p');
      descP.textContent = p.description;
      info.appendChild(descP);
      const priceP = document.createElement('p');
      priceP.textContent = `Price: $${p.price.toFixed(2)}`;
      info.appendChild(priceP);
      // Add to Cart button
      const btn = document.createElement('button');
      btn.textContent = 'Add to Cart';
      btn.type = 'button';
      btn.addEventListener('click', () => {
        const userId = 1; // default user id
        console.log('Requesting cart for user', userId);
        fetch(`/api/carts/user/${userId}`)
          .then(res => res.json())
          .then(cart => {
            console.log('Cart:', cart);
            return fetch(`/api/carts/${cart.id}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: p.id, quantity: 1 })
            });
          })
          .then(res => res.json())
          .then(json => {
            console.log('Added to cart:', json);
            alert('Product added to cart!');
          })
          .catch(err => console.error('Error adding to cart:', err));
      });
      info.appendChild(btn);
    })
    .catch(err => console.error('Error fetching product details:', err));
});