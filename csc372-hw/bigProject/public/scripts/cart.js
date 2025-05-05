// public/scripts/cart.js
document.addEventListener('DOMContentLoaded', () => {
  // Helper to resolve image URLs to public/images
  function imagePath(p) {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return p.startsWith('/') ? p : '/' + p;
  }
  // Helper to generate an inline placeholder PNG via Canvas
  function placeholderDataURL(text, width, height) {
    width = width || 100; height = height || 100;
    const cn = document.createElement('canvas'); cn.width = width; cn.height = height;
    const ctx = cn.getContext('2d');
    ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#666'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = Math.max(10, Math.floor(width / 8)); ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, width / 2, height / 2, width - 10);
    return cn.toDataURL('image/png');
  }
  const userId = 1; // default user
  let cartId = null;
  const tableBody = document.querySelector('table tbody');
  const subtotalEl = document.querySelector('h3:nth-of-type(1)');
  const taxEl = document.querySelector('h3:nth-of-type(2)');
  const totalEl = document.querySelector('h3:nth-of-type(3)');
  const checkoutBtn = document.getElementById('checkout-btn');

  function loadCart() {
    // get or create cart
    fetch(`/api/carts/user/${userId}`)
      .then(res => res.json())
      .then(cart => {
        console.log('Cart:', cart);
        cartId = cart.id;
        return fetch(`/api/carts/${cartId}`);
      })
      .then(res => res.json())
      .then(data => {
        console.log('Cart details:', data);
        renderCart(data.items);
      })
      .catch(err => console.error('Error loading cart:', err));
  }

  function renderCart(items) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    let subtotal = 0;
    items.forEach(item => {
      const tr = document.createElement('tr');
      // Image
      const tdImg = document.createElement('td');
      const img = document.createElement('img');
      img.alt = item.name;
      img.onerror = () => { img.onerror = null; img.src = placeholderDataURL(item.name, 100, 100); };
      img.src = imagePath(item.image_url);
      img.width = 50;
      tdImg.appendChild(img);
      tr.appendChild(tdImg);
      // Name
      const tdName = document.createElement('td');
      tdName.textContent = item.name;
      tr.appendChild(tdName);
      // Price
      const tdPrice = document.createElement('td');
      tdPrice.textContent = `$${item.price.toFixed(2)}`;
      tr.appendChild(tdPrice);
      // Quantity
      const tdQty = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.value = item.quantity;
      input.min = 1;
      input.disabled = true;
      tdQty.appendChild(input);
      tr.appendChild(tdQty);
      // Total
      const tdTotal = document.createElement('td');
      const total = item.price * item.quantity;
      subtotal += total;
      tdTotal.textContent = `$${total.toFixed(2)}`;
      tr.appendChild(tdTotal);
      // Action
      const tdAction = document.createElement('td');
      const btnRemove = document.createElement('button');
      btnRemove.textContent = 'Remove';
      btnRemove.addEventListener('click', () => {
        fetch(`/api/carts/${cartId}/products/${item.cart_product_id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            console.log('Removed item:', item.cart_product_id);
            loadCart();
          })
          .catch(err => console.error('Error removing item:', err));
      });
      tdAction.appendChild(btnRemove);
      tr.appendChild(tdAction);
      tableBody.appendChild(tr);
    });
    // Subtotal, tax, total
    const tax = subtotal * 0.0675;
    const total = subtotal + tax;
    if (subtotalEl) subtotalEl.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `Tax (6.75%): $${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cartId) return;
      fetch(`/api/carts/${cartId}/checkout`, { method: 'POST' })
        .then(res => res.json())
        .then(() => {
          alert('Checkout successful!');
          loadCart();
        })
        .catch(err => console.error('Error during checkout:', err));
    });
  }

  loadCart();
});