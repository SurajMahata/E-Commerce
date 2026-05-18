import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm.jsx";
import { productApi } from "../services/api.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    setProducts(await productApi.all());
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function createProduct(product) {
    await productApi.create(product);
    setMessage("Product saved successfully");
    alert("Product saved successfully");
    await loadProducts();
  }

  async function updateProduct(product) {
    await productApi.update(editingProduct.id, product);
    setEditingProduct(null);
    setMessage("Product updated successfully");
    alert("Product updated successfully");
    await loadProducts();
  }

  async function deleteProduct(id) {
    await productApi.remove(id);
    setMessage("Product deleted");
    alert("Product deleted successfully");
    await loadProducts();
  }

  return (
    <section className="admin-page">
      <div>
        <h1>Product Management</h1>
        <p className="muted">Create product listing pages and display products dynamically.</p>
        {message && <div className="success">{message}</div>}
        <ProductForm
          key={editingProduct?.id || "create"}
          initialProduct={editingProduct}
          onSubmit={editingProduct ? updateProduct : createProduct}
          submitLabel={editingProduct ? "Update Product" : "Add Product"}
        />
        {editingProduct && (
          <button className="light-button" type="button" onClick={() => setEditingProduct(null)}>Cancel Edit</button>
        )}
      </div>
      <div className="admin-list">
        <h2>Current Products</h2>
        {products.map((product) => (
          <article key={product.id} className="admin-row">
            <img src={product.imageUrl} alt={product.name} />
            <div>
              <strong>{product.name}</strong>
              <p>₹{Number(product.price).toLocaleString("en-IN")} | Stock {product.stock}</p>
            </div>
            <div className="row-actions">
              <button onClick={() => setEditingProduct(product)}>Edit</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
