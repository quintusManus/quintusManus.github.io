// public/scripts/admin-upload.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('upload-form');
  const fileInput = document.getElementById('file-input');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try {
        data = JSON.parse(reader.result);
      } catch (err) {
        alert('Invalid JSON file.');
        console.error(err);
        return;
      }
      if (!data.products || !Array.isArray(data.products)) {
        alert('JSON must contain a "products" array.');
        return;
      }
      // Fetch categories to map names to IDs
      fetch('/api/categories')
        .then(res => res.json())
        .then(categories => {
          const nameToId = {};
          categories.forEach(c => { nameToId[c.name] = c.id; });
          const promises = data.products.map(p => {
            const catId = nameToId[p.category];
            if (!catId) {
              console.error(`Unknown category: ${p.category}`);
              return Promise.resolve({ error: `Unknown category: ${p.category}` });
            }
            const body = {
              name: p.name,
              description: p.description,
              image_url: p.image || p.image_url,
              price: p.price,
              category_id: catId
            };
            return fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            })
              .then(res => res.json())
              .catch(err => ({ error: err.toString() }));
          });
          Promise.all(promises).then(results => {
            console.log('Bulk upload completed:', results);
            alert('Bulk upload completed. Check console for details.');
            window.location.href = 'admin-products.html';
          });
        });
    };
    reader.readAsText(file);
  });
});