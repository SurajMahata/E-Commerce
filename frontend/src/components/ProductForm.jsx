import { useEffect, useState } from "react";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "Electronics",
  brand: "",
  imageUrl: "",
  rating: 4.2,
  stock: 10
};

export default function ProductForm({ initialProduct, onSubmit, submitLabel = "Save Product" }) {
  const [form, setForm] = useState(initialProduct || emptyProduct);

  useEffect(() => {
    setForm(initialProduct || emptyProduct);
  }, [initialProduct]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      rating: Number(form.rating),
      stock: Number(form.stock)
    });
    if (!initialProduct) {
      setForm(emptyProduct);
    }
  }

  return (
    <form className="product-form" data-testid="product-form" onSubmit={handleSubmit}>
      <input data-testid="product-name-input" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Product name" />
      <textarea data-testid="product-description-input" required value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Description" />
      <div className="form-grid">
        <input data-testid="product-price-input" required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Price" />
        <input data-testid="product-mrp-input" type="number" value={form.mrp || ""} onChange={(e) => update("mrp", e.target.value)} placeholder="MRP" />
        <input data-testid="product-category-input" value={form.category || ""} onChange={(e) => update("category", e.target.value)} placeholder="Category" />
        <input data-testid="product-brand-input" value={form.brand || ""} onChange={(e) => update("brand", e.target.value)} placeholder="Brand" />
        <input data-testid="product-rating-input" type="number" step="0.1" value={form.rating} onChange={(e) => update("rating", e.target.value)} placeholder="Rating" />
        <input data-testid="product-stock-input" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="Stock" />
      </div>
      <input data-testid="product-image-url-input" value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} placeholder="Image URL" />
      <button className="gold-button" data-testid="product-submit-button" type="submit">{submitLabel}</button>
    </form>
  );
}
