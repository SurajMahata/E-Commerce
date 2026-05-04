import { useState } from "react";

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
    setForm(emptyProduct);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Product name" />
      <textarea required value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Description" />
      <div className="form-grid">
        <input required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Price" />
        <input type="number" value={form.mrp || ""} onChange={(e) => update("mrp", e.target.value)} placeholder="MRP" />
        <input value={form.category || ""} onChange={(e) => update("category", e.target.value)} placeholder="Category" />
        <input value={form.brand || ""} onChange={(e) => update("brand", e.target.value)} placeholder="Brand" />
        <input type="number" step="0.1" value={form.rating} onChange={(e) => update("rating", e.target.value)} placeholder="Rating" />
        <input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="Stock" />
      </div>
      <input value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} placeholder="Image URL" />
      <button className="gold-button" type="submit">{submitLabel}</button>
    </form>
  );
}
