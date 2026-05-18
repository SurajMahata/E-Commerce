import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { productApi } from "../services/api.js";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [filters, setFilters] = useState({
    q: params.get("q") || "",
    category: params.get("category") || ""
  });
  const title = params.get("q") ? `Results for "${params.get("q")}"` : params.get("category") || "All products";

  useEffect(() => {
    setFilters({
      q: params.get("q") || "",
      category: params.get("category") || ""
    });
  }, [params]);

  useEffect(() => {
    setLoading(true);
    productApi.all(location.search)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [location.search]);

  function applyFilters(event) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (filters.q.trim()) {
      next.set("q", filters.q.trim());
    }
    if (filters.category) {
      next.set("category", filters.category);
    }
    navigate(`/products${next.toString() ? `?${next.toString()}` : ""}`);
  }

  function clearFilters() {
    setFilters({ q: "", category: "" });
    navigate("/products");
  }

  return (
    <section className="content-section">
      <div className="section-heading">
        <h1>{title}</h1>
        <span>{products.length} items</span>
      </div>
      <form className="filter-panel" onSubmit={applyFilters}>
        <label>
          Search products
          <input
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
            placeholder="Search by name, category, or brand"
          />
        </label>
        <label>
          Category
          <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
            <option value="">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Audio">Audio</option>
            <option value="Wearables">Wearables</option>
            <option value="Computers">Computers</option>
            <option value="Home">Home</option>
            <option value="Cameras">Cameras</option>
          </select>
        </label>
        <button className="gold-button" type="submit">Apply</button>
        <button className="light-button" type="button" onClick={clearFilters}>Clear</button>
      </form>
      {loading ? <div className="notice">Loading products...</div> : (
        products.length === 0 ? <div className="notice">No products found for your search.</div> : (
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )
      )}
    </section>
  );
}
