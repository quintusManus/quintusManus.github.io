// public/scripts/admin-products.js
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('main table tbody');
  const searchInput = document.querySelector('main input[type="text"]');
  const addBtn = document.querySelector('main button');
  let products = [];

  // Load categories mapping for display (though products include category_name)
  function loadProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        console.log('Admin loaded products:', data);
        products = data;
        renderProducts(products);
      })
      .catch(err => console.error('Error loading products:', err));
  }

  function renderProducts(list) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    list.forEach(p => {
      const tr = document.createElement('tr');
      // ID
      let td = document.createElement('td'); td.textContent = p.id; tr.appendChild(td);
      // Name
      td = document.createElement('td'); td.textContent = p.name; tr.appendChild(td);
      // Category
      td = document.createElement('td'); td.textContent = p.category_name; tr.appendChild(td);
      // Price
      td = document.createElement('td'); td.textContent = `$${p.price.toFixed(2)}`; tr.appendChild(td);
      // Actions
      td = document.createElement('td');
      // Edit link
      const linkEdit = document.createElement('a');
      linkEdit.textContent = 'Edit'; linkEdit.href = `product-edit.html?id=${p.id}`;
      td.appendChild(linkEdit);
      td.appendChild(document.createTextNode(' | '));
      // Delete link
      const linkDelete = document.createElement('a');
      linkDelete.textContent = 'Delete'; linkDelete.href = '#';
      linkDelete.addEventListener('click', e => {
        e.preventDefault();
        if (confirm(`Delete product ${p.id}?`)) {
          fetch(`/api/products/${p.id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => loadProducts())
            .catch(err => console.error('Error deleting product:', err));
        }
      });
      td.appendChild(linkDelete);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (q) {
        fetch(`/api/products/search?q=${encodeURIComponent(q)}`)
          .then(res => res.json())
          .then(data => renderProducts(data))
          .catch(err => console.error('Error searching:', err));
      } else {
        renderProducts(products);
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.location.href = 'product-edit.html';
    });
  }

  loadProducts();
});