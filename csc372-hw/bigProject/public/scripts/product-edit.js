// public/scripts/product-edit.js
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const form = document.getElementById('product-form');
  const fieldId = document.getElementById('product-id');
  const nameInput = document.getElementById('name');
  const descInput = document.getElementById('description');
  const categorySelect = document.getElementById('category');
  const imgInput = document.getElementById('image_url');
  const priceInput = document.getElementById('price');
  const heading = document.querySelector('main h2');

  function loadCategories() {
    return fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        categories.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name;
          categorySelect.appendChild(opt);
        });
      });
  }

  function loadProduct(pid) {
    return fetch(`/api/products/${pid}`)
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(p => {
        fieldId.textContent = `Product ID: ${p.id}`;
        nameInput.value = p.name;
        descInput.value = p.description;
        imgInput.value = p.image_url;
        priceInput.value = p.price;
        categorySelect.value = p.category_id;
      });
  }

  loadCategories().then(() => {
    if (id) {
      heading.textContent = 'Edit Product Details';
      loadProduct(id);
    } else {
      heading.textContent = 'Add New Product';
      fieldId.textContent = '';
    }
  }).catch(err => console.error('Error loading categories or product:', err));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: nameInput.value.trim(),
      description: descInput.value.trim(),
      image_url: imgInput.value.trim(),
      price: parseFloat(priceInput.value),
      category_id: parseInt(categorySelect.value, 10)
    };
    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.ok ? res.json() : Promise.reject('Save failed'))
      .then(json => {
        console.log('Saved:', json);
        alert('Product saved successfully');
        window.location.href = 'admin-products.html';
      })
      .catch(err => {
        console.error(err);
        alert('Error saving product');
      });
  });
});